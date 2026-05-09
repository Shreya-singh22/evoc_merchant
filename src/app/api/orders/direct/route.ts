// app/api/orders/direct/route.js
//
// POST /api/orders/direct
//
// Atomic single-call guest checkout. Spec section 4.2 step 4.
//
// Improvements vs. the Express version:
//   1. Single findMany pre-fetch instead of N+1 inside the transaction.
//      Old: per item, one findFirst + one update + two more findUniques (~4N round trips
//      while holding row locks). Under 100 concurrent checkouts the pool would saturate.
//      New: one findMany before the transaction, then conditional updateMany +
//      one nested-create inside.
//
//   2. Conditional stock decrement via updateMany(where: { stock: { gte: qty } }).
//      If a parallel checkout drained stock between our read and write, updateMany
//      returns count=0 and we throw INSUFFICIENT_STOCK — no partial commits.
//
//   3. Server-side pincode revalidation. The client checks pincode onBlur, but the
//      atomic step must not trust client claims (defense in depth).
//
//   4. Idempotency-Key required (via withIdempotency wrapper).
//
//   5. Strict tenant resolution (resolveTenant throws if x-store-id is unknown,
//      instead of silently passing a bogus ID through to a foreign-key error).

import { withErrorHandler } from '@/lib/with-error-handler';
import { withIdempotency } from '@/lib/idempotency';
import { OrbitApiError } from '@/lib/orbit-api-error';
import { jsonOk } from '@/lib/api-response';
import { resolveTenant } from '@/lib/tenant';
import { prisma, safePrisma } from '@/lib/prisma';
import { checkPincodeWithFShip } from '@/lib/logistics/fship';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = async (request, context) => {
  const { requestId, startTime } = context;
  const store = await resolveTenant(request, requestId);

  // ── 1. Parse + validate body ────────────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    throw new OrbitApiError('INVALID_REQUEST', 'Body must be valid JSON.', requestId, 400);
  }

  const { items, buyer, shipTo, payment } = body || {};

  if (!Array.isArray(items) || items.length === 0) {
    throw new OrbitApiError('INVALID_REQUEST', 'items must be a non-empty array.', requestId, 400);
  }
  if (!buyer?.name || !buyer?.phone || !buyer?.email) {
    throw new OrbitApiError('INVALID_REQUEST', 'buyer.name, phone, and email are required.', requestId, 400);
  }
  if (!shipTo?.line1 || !shipTo?.city || !shipTo?.state || !shipTo?.pincode) {
    throw new OrbitApiError(
      'INVALID_REQUEST',
      'shipTo.line1, city, state, and pincode are required.',
      requestId,
      400,
    );
  }
  if (!payment?.method || !['COD', 'PREPAID'].includes(payment.method)) {
    throw new OrbitApiError(
      'INVALID_REQUEST',
      'payment.method must be COD or PREPAID.',
      requestId,
      400,
    );
  }

  // ── 2. Server-side pincode revalidation ────────────────────────────────────
  const logisticsConfig = await safePrisma(
    () => prisma.logisticsConfig.findUnique({ where: { storeId: store.id } }),
    { fallback: null, context: 'direct.logisticsConfig' },
  );
  if (logisticsConfig) {
    const serviceability = await checkPincodeWithFShip({
      pincode: shipTo.pincode,
      apiKey: logisticsConfig.apiKey,
      requestId,
    });
    if (!serviceability.serviceable) {
      throw new OrbitApiError(
        'PINCODE_NOT_SERVICEABLE',
        `We do not deliver to pincode ${shipTo.pincode}.`,
        requestId,
        400,
      );
    }
  }

  // ── 3. Pre-fetch all variants (one query, scoped to tenant) ────────────────
  const variantIds = [...new Set(items.map((i) => i.variantId))];
  const variants = await safePrisma(
    () =>
      prisma.productVariant.findMany({
        where: {
          id: { in: variantIds },
          product: { storeId: store.id },
        },
        include: {
          product: { select: { id: true, name: true, storeId: true } },
        },
      }),
    { fallback: [], context: 'direct.variants' },
  );

  if (variants.length !== variantIds.length) {
    throw new OrbitApiError(
      'PRODUCT_NOT_FOUND',
      'One or more items are not available in this store.',
      requestId,
      404,
    );
  }

  const variantById = new Map(variants.map((v) => [v.id, v]));

  // Optimistic stock + qty validation in memory before opening the transaction
  for (const item of items) {
    const v = variantById.get(item.variantId);
    if (!v) {
      throw new OrbitApiError(
        'PRODUCT_NOT_FOUND',
        `Variant ${item.variantId} not found.`,
        requestId,
        404,
      );
    }
    if (typeof item.qty !== 'number' || item.qty < 1 || !Number.isInteger(item.qty)) {
      throw new OrbitApiError('INVALID_REQUEST', 'qty must be a positive integer.', requestId, 400);
    }
    if (v.stock < item.qty) {
      throw new OrbitApiError(
        'INSUFFICIENT_STOCK',
        `Only ${v.stock} left for ${v.product.name}.`,
        requestId,
        409,
      );
    }
  }

  // ── 4. Atomic transaction ──────────────────────────────────────────────────
  const trackingId =
    'trk_' + (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));

  const order = await prisma.$transaction(async (tx) => {
    // Conditional decrement — fails (count=0) if stock changed under us
    for (const item of items) {
      const v = variantById.get(item.variantId);
      const updated = await tx.productVariant.updateMany({
        where: { id: item.variantId, stock: { gte: item.qty } },
        data: { stock: { decrement: item.qty } },
      });
      if (updated.count === 0) {
        throw new OrbitApiError(
          'INSUFFICIENT_STOCK',
          `Stock for ${v.product.name} changed during checkout.`,
          requestId,
          409,
        );
      }
    }

    // Single nested create — order + items in one round trip
    return tx.order.create({
      data: {
        storeId: store.id,
        status: 'PLACED',
        trackingId,
        buyerName: buyer.name,
        buyerPhone: buyer.phone,
        buyerEmail: buyer.email,
        shipLine1: shipTo.line1,
        shipCity: shipTo.city,
        shipState: shipTo.state,
        shipPincode: shipTo.pincode,
        paymentMethod: payment.method,
        paymentIntentId: payment.intentId || null,
        items: {
          create: items.map((i) => {
            const v = variantById.get(i.variantId);
            return {
              variantId: i.variantId,
              productId: v.product.id,
              productName: v.product.name,
              qty: i.qty,
              price: v.price,
            };
          }),
        },
      },
    });
  });

  // ── 5. Build tracking URL ──────────────────────────────────────────────────
  const trackingUrl = `https://${store.subdomain}.evoclabs.shop/track/${order.trackingId}`;

  return jsonOk(
    {
      orderId: order.id,
      trackingId: order.trackingId,
      trackingUrl,
    },
    { requestId, startTime, status: 201 },
  );
};

// withIdempotency runs first (key check) then withErrorHandler wraps the result
export const POST = withErrorHandler(withIdempotency(handler));
