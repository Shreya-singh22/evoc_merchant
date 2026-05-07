'use strict';

/**
 * LogisticsClient
 *
 * Covers Gauthami's logistics endpoints:
 *   - checkPincode     GET /api/logistics/public/pincode/:code
 *   - trackShipment    GET /api/logistics/public/track?awb=
 *   - getHotProducts   GET /api/logistics/public/hot-products
 */
class LogisticsClient {
  /**
   * @param {import('./BaseClient')} client
   */
  constructor(client) {
    this._client = client;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // checkPincode
  // Validate pincode serviceability before allowing checkout submit.
  // Call this onBlur on the pincode field (debounced 300ms per spec).
  //
  // @param {string} pincode  - 6-digit Indian pincode
  //
  // @returns {Promise<{
  //   serviceable: boolean,
  //   codEligible: boolean,
  //   estimatedDays: number|null,
  //   etaMessage: string
  // }>}
  // ───────────────────────────────────────────────────────────────────────────
  async checkPincode(pincode) {
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      throw new Error('[LogisticsClient] pincode must be a 6-digit string');
    }
    return this._client.get(`/api/logistics/public/pincode/${encodeURIComponent(pincode)}`);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // trackShipment
  // Track a shipment by AWB number — proxied from FShip.
  //
  // @param {string} awb  - Air Waybill number from logistics partner
  //
  // @returns {Promise<{
  //   awb: string,
  //   carrier: string|null,
  //   status: string|null,
  //   events: Array<object>,
  //   estimatedDelivery: string|null
  // }>}
  // ───────────────────────────────────────────────────────────────────────────
  async trackShipment(awb) {
    if (!awb) throw new Error('[LogisticsClient] awb is required');
    return this._client.get('/api/logistics/public/track', {
      params: { awb },
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // getHotProducts
  // Returns top-selling products for the store (for storefront widgets).
  //
  // @returns {Promise<{products: Array<{productId, productName, totalSold}>}>}
  // ───────────────────────────────────────────────────────────────────────────
  async getHotProducts() {
    return this._client.get('/api/logistics/public/hot-products');
  }
}

module.exports = LogisticsClient;
