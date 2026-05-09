// app/api/webhooks/order-status/route.js
//
// POST /api/webhooks/order-status
//
// Inbound status updates from logistics partner (FShip). Spec sections 2.2 + 4.2.
//
// The Express version had a critical bug: app.use(express.json()) was mounted
// globally before the webhook route, so the request stream was already consumed
// by the time the captureRawBody middleware ran. HMAC signature verification
// would silently fail on every legitimate webhook in production.
//
// Next.js Route Handlers don't have global body parsers — we control the order:
//   1. await request.text() to read the exact bytes the partner signed
//   2. verify HMAC against those bytes
//   3. JSON.parse() ourselves
//
// No way to get the order wrong here — it's all in one function.

import { withErrorHandler } from '@/lib/with-error-handler';
import { OrbitApiError } from '@/lib/orbit-api-error';
import { jsonOk } from '@/lib/api-response';
import { prisma, safePrisma } from '@/lib/prisma';
import { verifyFShipSignature } from '@/lib/webhooks/verify-fship-signature';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FSHIP_STATUS_MAP = {
  pickup_scheduled: 'PLACED',
  picked_up: 'PACKED',
  in_transit: 'SHIPPED',
  out_for_delivery: 'OUT_FOR_DELIVERY',
  delivered: 'DELIVERED',
  cancelled: 'CANCELLED',
  rto_initiated: 'CANCELLED',
  rto_delivered: 'CANCELLED',
};

const STATUS_ORDER = [
  'PLACED',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

export const POST = withErrorHandler(async (request, context) => {
  const { requestId, startTime } = context;

  // ── 1. Raw body FIRST — before any JSON parsing ────────────────────────────
  const rawBody = await request.text();

  // ── 2. Verify HMAC signature ───────────────────────────────────────────────
  const signature =
    request.headers.get('x-fship-signature') || request.headers.get('x-webhook-signature');
  const secret = process.env.FSHIP_WEBHOOK_SECRET;

  if (secret) {
    if (!verifyFShipSignature(rawBody, signature, secret)) {
      throw new OrbitApiError(
        'INVALID_WEBHOOK_SIGNATURE',
        'Webhook signature verification failed.',
        requestId,
        401,
      );
    }
  } else if (process.env.NODE_ENV === 'production') {
    throw new OrbitApiError(
      'WEBHOOK_SECRET_NOT_CONFIGURED',
      'FSHIP_WEBHOOK_SECRET is not set on this server.',
      requestId,
      500,
    );
  } else {
    console.warn('[webhook] FSHIP_WEBHOOK_SECRET not set — skipping signature check (dev only)');
  }

  // ── 3. Parse JSON ──────────────────────────────────────────────────────────
  let payload;
  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    throw new OrbitApiError(
      'INVALID_WEBHOOK_PAYLOAD',
      'Body is not valid JSON.',
      requestId,
      400,
    );
  }

  const { awb, trackingId, orderNumber, status, timestamp, location, remarks, partnerData } =
    payload;

  if (!status) {
    throw new OrbitApiError(
      'INVALID_WEBHOOK_PAYLOAD',
      'status field is required.',
      requestId,
      400,
    );
  }
  if (!trackingId && !orderNumber && !awb) {
    throw new OrbitApiError(
      'INVALID_WEBHOOK_PAYLOAD',
      'One of trackingId, orderNumber, or awb is required.',
      requestId,
      400,
    );
  }

  // ── 4. Resolve the order ───────────────────────────────────────────────────
  let order = null;
  if (trackingId) {
    order = await safePrisma(
      () => prisma.order.findUnique({ where: { trackingId } }),
      { fallback: null, context: 'webhook.byTrackingId' },
    );
  }
  if (!order && orderNumber) {
    order = await safePrisma(
      () => prisma.order.findFirst({ where: { orderNumber } }),
      { fallback: null, context: 'webhook.byOrderNumber' },
    );
  }

  if (!order) {
    // Acknowledge with 200 so the partner doesn't retry forever for unknown orders
    console.warn(
      `[webhook] order not found — trackingId=${trackingId} awb=${awb} orderNumber=${orderNumber}`,
    );
    return jsonOk({ received: true, matched: false }, { requestId, startTime });
  }

  // ── 5. Map partner status → our enum ──────────────────────────────────────
  const mappedStatus = FSHIP_STATUS_MAP[status?.toLowerCase()] || null;

  const existingTimestamps = Array.isArray(order.partnerTimestamps)
    ? order.partnerTimestamps
    : [];

  const newEvent = {
    awb: awb || null,
    partnerStatus: status,
    mappedStatus,
    timestamp: timestamp || new Date().toISOString(),
    location: location || null,
    remarks: remarks || null,
    partnerData: partnerData || null,
    receivedAt: new Date().toISOString(),
  };

  const updateData = { partnerTimestamps: [...existingTimestamps, newEvent] };

  // Only advance status, never regress (CANCELLED is terminal and overrides)
  const currentIdx = STATUS_ORDER.indexOf(order.status);
  const newIdx = mappedStatus ? STATUS_ORDER.indexOf(mappedStatus) : -1;
  if (mappedStatus && (newIdx > currentIdx || mappedStatus === 'CANCELLED')) {
    updateData.status = mappedStatus;
  }

  await safePrisma(
    () => prisma.order.update({ where: { id: order.id }, data: updateData }),
    { context: 'webhook.update' },
  );

  return jsonOk(
    {
      received: true,
      matched: true,
      orderId: order.id,
      statusUpdated: !!updateData.status,
    },
    { requestId, startTime },
  );
});
