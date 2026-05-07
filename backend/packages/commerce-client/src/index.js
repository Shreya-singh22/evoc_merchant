'use strict';

const BaseClient = require('./BaseClient');
const OrdersClient = require('./OrdersClient');
const LogisticsClient = require('./LogisticsClient');
const OrbitApiError = require('./OrbitApiError');

/**
 * CommerceClient
 *
 * The single entry point for the Orbit-360 commerce SDK.
 * Used by the Next.js storefront to call all of Gauthami's endpoints.
 *
 * @example
 * // In your Next.js app (server component or API route):
 * const { CommerceClient } = require('@orbit-360/commerce-client');
 *
 * const commerce = new CommerceClient({
 *   baseUrl: process.env.NEXT_PUBLIC_API_URL,  // 'https://api.evoclabs.com'
 *   storeId: process.env.NEXT_PUBLIC_STORE_ID, // merchant UUID
 * });
 *
 * // Check pincode
 * const pinResult = await commerce.logistics.checkPincode('560001');
 *
 * // Place order
 * const order = await commerce.orders.directCheckout({ items, buyer, shipTo, payment });
 *
 * // Track order
 * const tracking = await commerce.orders.trackOrder('trk_xxx');
 */
class CommerceClient {
  /**
   * @param {object} config
   * @param {string} config.baseUrl   - API base URL
   * @param {string} config.storeId  - Merchant UUID (sent as x-store-id)
   * @param {number} [config.timeout] - Request timeout in ms (default 10000)
   */
  constructor(config) {
    const base = new BaseClient(config);

    /** @type {OrdersClient} */
    this.orders = new OrdersClient(base);

    /** @type {LogisticsClient} */
    this.logistics = new LogisticsClient(base);
  }
}

module.exports = {
  CommerceClient,
  OrdersClient,
  LogisticsClient,
  OrbitApiError,
};
