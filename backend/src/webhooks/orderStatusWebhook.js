'use strict';

const crypto = require('crypto');
const { prisma, safePrisma } = require('../config/prisma');
const OrbitApiError = require('../utils/OrbitApiError');
const { sendSuccess } = require('../utils/response');

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verify HMAC-SHA256 signature sent by the logistics partner.
 *
 * FShip signs the raw request body with a shared secret and sends:
 *   X-FShip-Signature: sha256=<hex_digest>
 *
 * We recompute and compare using a timing-safe equality check.
 */
function verifyFShipSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;

  const expected = 'sha256=' +
    crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signatureHeader),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

/**
 * Map FShip's internal status codes → our OrderStatus enum.
 * Unmapped statuses are returned as-is so we can store them in
 * partnerTimestamps without crashing.
 */
const FSHIP_STATUS_MAP = {
  'pickup_scheduled':   'PLACED',
  'picked_up':          'PACKED',
  'in_transit':         'SHIPPED',
  'out_for_delivery':   'OUT_FOR_DELIVERY',
  'delivered':          'DELIVERED',
  'cancelled':          'CANCELLED',
  'rto_initiated':      'CANCELLED',
  'rto_delivered':      'CANCELLED',
  // Add more mappings as FShip documents them
};

const VALID_ORDER_STATUSES = new Set([
  'PLACED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'
]);

// ─────────────────────────────────────────────────────────────────────────────
// WEBHOOK HANDLER
// POST /api/webhooks/order-status  🟢 (public — verified via HMAC signature)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Receives inbound status updates from FShip (or any logistics partner).
 *
 * Expected payload from FShip:
 * {
 *   "awb": "FSHIP123456",
 *   "trackingId": "trk_<uuid>",        // our tracking ID (preferred)
 *   "orderNumber": "ORD-001",           // fallback if trackingId absent
 *   "status": "out_for_delivery",
 *   "timestamp": "2024-01-15T10:30:00Z",
 *   "location": "Mumbai Hub",
 *   "remarks": "Out for delivery",
 *   "partnerData": { … }               // any extra partner fields
 * }
 */
async function handleOrderStatusWebhook(req, res, next) {
  const startTime = Date.now();
  const requestId = req.requestId;

  try {
    // ── 1. Verify HMAC signature ─────────────────────────────────────────────
    const signature = req.headers['x-fship-signature'] || req.headers['x-webhook-signature'];
    const webhookSecret = process.env.FSHIP_WEBHOOK_SECRET;

    // rawBody is attached by the express.raw() middleware applied on this route
    const rawBody = req.rawBody;

    if (webhookSecret) {
      const valid = verifyFShipSignature(rawBody, signature, webhookSecret);
      if (!valid) {
        throw new OrbitApiError(
          'INVALID_WEBHOOK_SIGNATURE',
          'Webhook signature verification failed.',
          requestId,
          401
        );
      }
    } else {
      // No secret configured — log a warning but don't crash in dev
      if (process.env.NODE_ENV === 'production') {
        throw new OrbitApiError(
          'WEBHOOK_SECRET_NOT_CONFIGURED',
          'Webhook secret is not configured on this server.',
          requestId,
          500
        );
      }
      console.warn('[webhook] FSHIP_WEBHOOK_SECRET not set — skipping signature check (dev only)');
    }

    // ── 2. Parse & validate payload ──────────────────────────────────────────
    const { awb, trackingId, orderNumber, status, timestamp, location, remarks, partnerData } = req.body;

    if (!status) {
      throw new OrbitApiError('INVALID_WEBHOOK_PAYLOAD', 'status field is required.', requestId, 400);
    }
    if (!trackingId && !orderNumber && !awb) {
      throw new OrbitApiError(
        'INVALID_WEBHOOK_PAYLOAD',
        'One of trackingId, orderNumber, or awb is required.',
        requestId,
        400
      );
    }

    // ── 3. Resolve order ─────────────────────────────────────────────────────
    let order = null;

    if (trackingId) {
      order = await safePrisma(
        () => prisma.order.findUnique({ where: { trackingId } }),
        { fallback: null, context: 'webhook.orderStatus.byTrackingId' }
      );
    }

    if (!order && orderNumber) {
      order = await safePrisma(
        () => prisma.order.findFirst({ where: { orderNumber } }),
        { fallback: null, context: 'webhook.orderStatus.byOrderNumber' }
      );
    }

    if (!order) {
      // Return 200 to prevent the partner from retrying endlessly for unknown orders
      console.warn(`[webhook] Order not found — trackingId=${trackingId} awb=${awb} orderNumber=${orderNumber}`);
      return sendSuccess(
        res,
        { received: true, matched: false },
        { statusCode: 200, requestId, startTime }
      );
    }

    // ── 4. Map partner status → our enum ─────────────────────────────────────
    const mappedStatus = FSHIP_STATUS_MAP[status.toLowerCase()] || null;
    const newStatus = mappedStatus && VALID_ORDER_STATUSES.has(mappedStatus)
      ? mappedStatus
      : null;

    // ── 5. Build partnerTimestamps update ─────────────────────────────────────
    // Merge new event into existing partnerTimestamps array (append-only)
    const existingTimestamps = Array.isArray(order.partnerTimestamps)
      ? order.partnerTimestamps
      : [];

    const newEvent = {
      awb: awb || null,
      partnerStatus: status,
      mappedStatus: newStatus,
      timestamp: timestamp || new Date().toISOString(),
      location: location || null,
      remarks: remarks || null,
      partnerData: partnerData || null,
      receivedAt: new Date().toISOString(),
    };

    const updatedTimestamps = [...existingTimestamps, newEvent];

    // ── 6. Update order in DB ─────────────────────────────────────────────────
    const updateData = {
      partnerTimestamps: updatedTimestamps,
    };

    // Only advance status — never regress (e.g. don't go DELIVERED → SHIPPED)
    const STATUS_ORDER = ['PLACED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    const currentIndex = STATUS_ORDER.indexOf(order.status);
    const newIndex = newStatus ? STATUS_ORDER.indexOf(newStatus) : -1;

    if (newStatus && (newIndex > currentIndex || newStatus === 'CANCELLED')) {
      updateData.status = newStatus;
    }

    await safePrisma(
      () => prisma.order.update({
        where: { id: order.id },
        data: updateData,
      }),
      { context: 'webhook.orderStatus.update' }
    );

    console.log(`[webhook] Order ${order.id} updated — status=${updateData.status || 'unchanged'} event=${status}`);

    // ── 7. Acknowledge ────────────────────────────────────────────────────────
    return sendSuccess(
      res,
      { received: true, matched: true, orderId: order.id, statusUpdated: !!updateData.status },
      { statusCode: 200, requestId, startTime }
    );

  } catch (err) {
    next(err);
  }
}

module.exports = { handleOrderStatusWebhook };
