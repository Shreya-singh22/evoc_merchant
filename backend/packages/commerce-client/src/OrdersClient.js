'use strict';

const { v4: uuidv4 } = require !== undefined && typeof require === 'function'
  ? require('uuid')
  : { v4: () => Math.random().toString(36).slice(2) }; // browser fallback

/**
 * OrdersClient
 *
 * Covers all of Gauthami's order endpoints:
 *   - directCheckout  POST /api/orders/direct
 *   - trackOrder      GET  /api/orders/track/:trackingId
 *   - lookupOrder     POST /api/orders/lookup
 *
 * Used by the Next.js storefront — never exposes raw Prisma types.
 */
class OrdersClient {
  /**
   * @param {import('./BaseClient')} client
   */
  constructor(client) {
    this._client = client;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // directCheckout
  // Atomic single-call guest checkout.
  //
  // @param {object} payload
  // @param {Array<{productId:string, variantId:string, qty:number}>} payload.items
  // @param {{name:string, phone:string, email:string}} payload.buyer
  // @param {{line1:string, city:string, state:string, pincode:string}} payload.shipTo
  // @param {{method:'COD'|'PREPAID', intentId?:string}} payload.payment
  // @param {string} [idempotencyKey]  - UUID; auto-generated if omitted
  //
  // @returns {Promise<{orderId:string, trackingId:string, trackingUrl:string}>}
  // ───────────────────────────────────────────────────────────────────────────
  async directCheckout(payload, idempotencyKey) {
    const key = idempotencyKey || uuidv4();

    return this._client.post('/api/orders/direct', {
      body: payload,
      headers: {
        'Idempotency-Key': key,
      },
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // trackOrder
  // Public order tracking — no auth required.
  //
  // @param {string} trackingId  - opaque trk_<uuid> token
  //
  // @returns {Promise<{
  //   orderId: string,
  //   trackingId: string,
  //   status: 'PLACED'|'PACKED'|'SHIPPED'|'OUT_FOR_DELIVERY'|'DELIVERED'|'CANCELLED',
  //   fulfillmentStatus: string|null,
  //   items: Array<{productName:string, qty:number}>,
  //   createdAt: string,
  //   updatedAt: string,
  //   partnerTimestamps: Array<object>|null
  // }>}
  // ───────────────────────────────────────────────────────────────────────────
  async trackOrder(trackingId) {
    if (!trackingId) throw new Error('[OrdersClient] trackingId is required');
    return this._client.get(`/api/orders/track/${encodeURIComponent(trackingId)}`);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // lookupOrder
  // Let a buyer find their order with orderNumber + email.
  //
  // @param {string} orderNumber
  // @param {string} email
  //
  // @returns {Promise<{orderId, orderNumber, trackingId, status, items, createdAt, updatedAt}>}
  // ───────────────────────────────────────────────────────────────────────────
  async lookupOrder(orderNumber, email) {
    if (!orderNumber || !email) {
      throw new Error('[OrdersClient] orderNumber and email are required');
    }
    return this._client.post('/api/orders/lookup', {
      body: { orderNumber, email },
    });
  }
}

module.exports = OrdersClient;
