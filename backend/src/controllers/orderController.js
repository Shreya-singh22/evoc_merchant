'use strict';

const { v4: uuidv4 } = require('uuid');
const { prisma, safePrisma } = require('../config/prisma');
const OrbitApiError = require('../utils/OrbitApiError');
const { sendSuccess } = require('../utils/response');

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Build the public tracking URL for a store + trackingId */
function buildTrackingUrl(store, trackingId) {
  const subdomain = store?.subdomain || 'store';
  return `https://${subdomain}.evoclabs.shop/track/${trackingId}`;
}

/** Safely resolve storeId from header or req.store */
function resolveStoreId(req) {
  return req.headers['x-store-id'] || req.store?.id || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — directCheckout  POST /api/orders/direct  🟢
// ─────────────────────────────────────────────────────────────────────────────
async function directCheckout(req, res, next) {
  const startTime = Date.now();
  const requestId = req.requestId;

  try {
    const storeId = resolveStoreId(req);

    if (!storeId) {
      throw new OrbitApiError('TENANT_REQUIRED', 'x-store-id header is required.', requestId, 400);
    }

    const { items, buyer, shipTo, payment } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new OrbitApiError('INVALID_REQUEST', 'items array is required and must not be empty.', requestId, 400);
    }
    if (!buyer || !shipTo || !payment) {
      throw new OrbitApiError('INVALID_REQUEST', 'buyer, shipTo, and payment fields are required.', requestId, 400);
    }

    // All DB work inside a single Prisma transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // ── 1. Validate each item: belongs to store, stock sufficient ──────────
      for (const item of items) {
        const product = await tx.product.findFirst({
          where: { id: item.productId, storeId },
          include: { variants: { where: { id: item.variantId } } },
        });

        if (!product || product.variants.length === 0) {
          throw new OrbitApiError(
            'PRODUCT_NOT_FOUND',
            `Product ${item.productId} not found in this store.`,
            requestId,
            404
          );
        }

        const variant = product.variants[0];
        if (variant.stock < item.qty) {
          throw new OrbitApiError(
            'INSUFFICIENT_STOCK',
            `Only ${variant.stock} left for product ${product.name}, quantity adjusted.`,
            requestId,
            409
          );
        }
      }

      // ── 2 & 3. Decrement stock for each variant ────────────────────────────
      for (const item of items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.qty } },
        });
      }

      // ── 4. Create the Order row ────────────────────────────────────────────
      const trackingId = 'trk_' + uuidv4();

      const order = await tx.order.create({
        data: {
          storeId,
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
        },
      });

      // ── 5. Create OrderItem rows ───────────────────────────────────────────
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } });

        await tx.orderItem.create({
          data: {
            orderId: order.id,
            variantId: item.variantId,
            productId: item.productId,
            productName: product?.name || 'Unknown Product',
            qty: item.qty,
            price: variant?.price || 0,
          },
        });
      }

      return order;
    });

    // Resolve store for tracking URL (may already be in req.store)
    const store = req.store || (await safePrisma(
      () => prisma.store.findUnique({ where: { id: storeId } }),
      { fallback: null, context: 'orders.directCheckout.store' }
    ));

    return sendSuccess(
      res,
      {
        orderId: result.id,
        trackingId: result.trackingId,
        trackingUrl: buildTrackingUrl(store, result.trackingId),
      },
      { statusCode: 201, requestId, startTime }
    );
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — trackOrder  GET /api/orders/track/:trackingId  🟢
// ─────────────────────────────────────────────────────────────────────────────
async function trackOrder(req, res, next) {
  const startTime = Date.now();
  const requestId = req.requestId;

  try {
    const { trackingId } = req.params;

    const order = await safePrisma(
      () =>
        prisma.order.findUnique({
          where: { trackingId },
          include: {
            items: {
              select: {
                productName: true,
                qty: true,
              },
            },
          },
        }),
      { fallback: null, context: 'orders.trackOrder' }
    );

    if (!order) {
      throw new OrbitApiError('ORDER_NOT_FOUND', 'No order found for this tracking ID.', requestId, 404);
    }

    // Return only safe, non-PII fields
    return sendSuccess(
      res,
      {
        orderId: order.id,
        trackingId: order.trackingId,
        status: order.status,
        fulfillmentStatus: order.fulfillmentStatus,
        items: order.items.map((i) => ({ productName: i.productName, qty: i.qty })),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        partnerTimestamps: order.partnerTimestamps || null,
      },
      { statusCode: 200, requestId, startTime }
    );
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — lookupOrder  POST /api/orders/lookup  🟢
// ─────────────────────────────────────────────────────────────────────────────
async function lookupOrder(req, res, next) {
  const startTime = Date.now();
  const requestId = req.requestId;

  try {
    const { orderNumber, email } = req.body;

    if (!orderNumber || !email) {
      throw new OrbitApiError('INVALID_REQUEST', 'orderNumber and email are required.', requestId, 400);
    }

    const order = await safePrisma(
      () =>
        prisma.order.findFirst({
          where: {
            orderNumber,
            buyerEmail: email,
          },
          include: {
            items: {
              select: { productName: true, qty: true },
            },
          },
        }),
      { fallback: null, context: 'orders.lookupOrder' }
    );

    if (!order) {
      throw new OrbitApiError('ORDER_NOT_FOUND', 'No order found with these details.', requestId, 404);
    }

    // Return only safe fields — no PII beyond what buyer already knows
    return sendSuccess(
      res,
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        trackingId: order.trackingId,
        status: order.status,
        fulfillmentStatus: order.fulfillmentStatus,
        items: order.items.map((i) => ({ productName: i.productName, qty: i.qty })),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      { statusCode: 200, requestId, startTime }
    );
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MERCHANT — getStoreOrders  GET /api/orders/store/:storeId  🟠
// ─────────────────────────────────────────────────────────────────────────────
async function getStoreOrders(req, res, next) {
  const startTime = Date.now();
  const requestId = req.requestId;

  try {
    const { storeId } = req.params;
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const skip = (page - 1) * limit;

    // Verify this store belongs to the requesting user
    const store = await safePrisma(
      () => prisma.store.findUnique({ where: { id: storeId } }),
      { fallback: null, context: 'orders.getStoreOrders.storeCheck' }
    );

    if (!store || store.ownerId !== req.user.id) {
      throw new OrbitApiError('FORBIDDEN', 'You do not have access to this store.', requestId, 403);
    }

    const [orders, total] = await Promise.all([
      safePrisma(
        () =>
          prisma.order.findMany({
            where: { storeId },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
              items: {
                select: { productName: true, qty: true, price: true },
              },
            },
          }),
        { fallback: [], context: 'orders.getStoreOrders.list' }
      ),
      safePrisma(
        () => prisma.order.count({ where: { storeId } }),
        { fallback: 0, context: 'orders.getStoreOrders.count' }
      ),
    ]);

    return sendSuccess(
      res,
      {
        orders: orders.map((o) => ({
          orderId: o.id,
          orderNumber: o.orderNumber,
          trackingId: o.trackingId,
          status: o.status,
          fulfillmentStatus: o.fulfillmentStatus,
          buyerName: o.buyerName,
          items: o.items,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
      { statusCode: 200, requestId, startTime }
    );
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MERCHANT — getOrderById  GET /api/orders/:id  🟡
// ─────────────────────────────────────────────────────────────────────────────
async function getOrderById(req, res, next) {
  const startTime = Date.now();
  const requestId = req.requestId;

  try {
    const { id } = req.params;

    const order = await safePrisma(
      () =>
        prisma.order.findUnique({
          where: { id },
          include: { items: true, store: { select: { id: true, ownerId: true, subdomain: true } } },
        }),
      { fallback: null, context: 'orders.getOrderById' }
    );

    if (!order) {
      throw new OrbitApiError('ORDER_NOT_FOUND', 'Order not found.', requestId, 404);
    }

    if (order.store.ownerId !== req.user.id) {
      throw new OrbitApiError('FORBIDDEN', 'You do not have access to this order.', requestId, 403);
    }

    return sendSuccess(res, { order }, { statusCode: 200, requestId, startTime });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MERCHANT — updateOrderStatus  PUT /api/orders/:id/status  🟠
// ─────────────────────────────────────────────────────────────────────────────
async function updateOrderStatus(req, res, next) {
  const startTime = Date.now();
  const requestId = req.requestId;

  const VALID_STATUSES = ['PLACED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      throw new OrbitApiError(
        'INVALID_STATUS',
        `status must be one of: ${VALID_STATUSES.join(', ')}`,
        requestId,
        400
      );
    }

    const order = await safePrisma(
      () => prisma.order.findUnique({ where: { id }, include: { store: { select: { ownerId: true } } } }),
      { fallback: null, context: 'orders.updateOrderStatus.find' }
    );

    if (!order) {
      throw new OrbitApiError('ORDER_NOT_FOUND', 'Order not found.', requestId, 404);
    }
    if (order.store.ownerId !== req.user.id) {
      throw new OrbitApiError('FORBIDDEN', 'You do not have access to this order.', requestId, 403);
    }

    const updated = await safePrisma(
      () => prisma.order.update({ where: { id }, data: { status } }),
      { context: 'orders.updateOrderStatus.update' }
    );

    return sendSuccess(
      res,
      { orderId: updated.id, status: updated.status },
      { statusCode: 200, requestId, startTime }
    );
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MERCHANT — updateFulfillmentStatus  PUT /api/orders/:id/fulfillment  🟠
// ─────────────────────────────────────────────────────────────────────────────
async function updateFulfillmentStatus(req, res, next) {
  const startTime = Date.now();
  const requestId = req.requestId;

  try {
    const { id } = req.params;
    const { fulfillmentStatus } = req.body;

    if (!fulfillmentStatus) {
      throw new OrbitApiError('INVALID_REQUEST', 'fulfillmentStatus is required.', requestId, 400);
    }

    const order = await safePrisma(
      () => prisma.order.findUnique({ where: { id }, include: { store: { select: { ownerId: true } } } }),
      { fallback: null, context: 'orders.updateFulfillmentStatus.find' }
    );

    if (!order) {
      throw new OrbitApiError('ORDER_NOT_FOUND', 'Order not found.', requestId, 404);
    }
    if (order.store.ownerId !== req.user.id) {
      throw new OrbitApiError('FORBIDDEN', 'You do not have access to this order.', requestId, 403);
    }

    const updated = await safePrisma(
      () => prisma.order.update({ where: { id }, data: { fulfillmentStatus } }),
      { context: 'orders.updateFulfillmentStatus.update' }
    );

    return sendSuccess(
      res,
      { orderId: updated.id, fulfillmentStatus: updated.fulfillmentStatus },
      { statusCode: 200, requestId, startTime }
    );
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MERCHANT — cancelOrder  DELETE /api/orders/:id  🟠
// ─────────────────────────────────────────────────────────────────────────────
async function cancelOrder(req, res, next) {
  const startTime = Date.now();
  const requestId = req.requestId;

  try {
    const { id } = req.params;

    const order = await safePrisma(
      () => prisma.order.findUnique({ where: { id }, include: { store: { select: { ownerId: true } } } }),
      { fallback: null, context: 'orders.cancelOrder.find' }
    );

    if (!order) {
      throw new OrbitApiError('ORDER_NOT_FOUND', 'Order not found.', requestId, 404);
    }
    if (order.store.ownerId !== req.user.id) {
      throw new OrbitApiError('FORBIDDEN', 'You do not have access to this order.', requestId, 403);
    }
    if (order.status === 'CANCELLED') {
      throw new OrbitApiError('ALREADY_CANCELLED', 'This order is already cancelled.', requestId, 409);
    }

    const updated = await safePrisma(
      () => prisma.order.update({ where: { id }, data: { status: 'CANCELLED' } }),
      { context: 'orders.cancelOrder.update' }
    );

    return sendSuccess(
      res,
      { orderId: updated.id, status: updated.status },
      { statusCode: 200, requestId, startTime }
    );
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STUB — createStorefrontOrder  POST /api/orders  (existing route placeholder)
// ─────────────────────────────────────────────────────────────────────────────
async function createStorefrontOrder(req, res, next) {
  // Existing storefront order creation — wire in your pre-existing logic here.
  next(new OrbitApiError('NOT_IMPLEMENTED', 'createStorefrontOrder is handled by a separate module.', req.requestId, 501));
}

module.exports = {
  directCheckout,
  trackOrder,
  lookupOrder,
  getStoreOrders,
  getOrderById,
  updateOrderStatus,
  updateFulfillmentStatus,
  cancelOrder,
  createStorefrontOrder,
};
