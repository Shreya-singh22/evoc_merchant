'use strict';

const OrbitApiError = require('./OrbitApiError');

/**
 * Sleep helper for exponential backoff
 * @param {number} ms
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * BaseClient
 *
 * Thin HTTP wrapper used by all SDK modules.
 * Handles:
 *   - Tenant identification (x-store-id header)
 *   - Standard envelope unwrapping
 *   - OrbitApiError throwing on non-ok responses
 *   - 429 retry with exponential backoff (max 3 attempts)
 *   - requestId propagation into console errors
 */
class BaseClient {
  /**
   * @param {object} config
   * @param {string} config.baseUrl   - e.g. 'https://api.evoclabs.com'
   * @param {string} config.storeId  - merchant UUID sent as x-store-id
   * @param {number} [config.timeout] - request timeout in ms (default 10000)
   */
  constructor({ baseUrl, storeId, timeout = 10000 }) {
    if (!baseUrl) throw new Error('[OrbitSDK] baseUrl is required');
    if (!storeId) throw new Error('[OrbitSDK] storeId is required');

    this.baseUrl = baseUrl.replace(/\/$/, ''); // strip trailing slash
    this.storeId = storeId;
    this.timeout = timeout;
  }

  /**
   * Build full URL from a path
   * @param {string} path
   * @returns {string}
   */
  _url(path) {
    return `${this.baseUrl}${path}`;
  }

  /**
   * Build standard request headers
   * @param {object} [extra] - additional headers to merge
   * @returns {object}
   */
  _headers(extra = {}) {
    return {
      'Content-Type': 'application/json',
      'x-store-id': this.storeId,
      ...extra,
    };
  }

  /**
   * Core fetch wrapper with retry logic.
   *
   * @param {string} method       - 'GET' | 'POST' | 'PUT' | 'DELETE'
   * @param {string} path         - API path, e.g. '/api/orders/direct'
   * @param {object} [options]
   * @param {object} [options.body]    - request body (will be JSON.stringify'd)
   * @param {object} [options.headers] - extra headers
   * @param {object} [options.params]  - query string params
   * @param {number} [options.retries] - override max retries (default 3)
   * @returns {Promise<*>}         - unwrapped data from envelope
   */
  async request(method, path, { body, headers = {}, params, retries = 3 } = {}) {
    // Build query string
    let url = this._url(path);
    if (params && Object.keys(params).length > 0) {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))
      ).toString();
      if (qs) url += '?' + qs;
    }

    const requestHeaders = this._headers(headers);
    let attempt = 0;

    while (attempt < retries) {
      attempt++;

      let response;
      let responseData;

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeout);

        response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timer);
        responseData = await response.json();
      } catch (fetchErr) {
        // Network error or timeout — retry if we have attempts left
        if (attempt < retries) {
          await sleep(200 * Math.pow(2, attempt - 1));
          continue;
        }
        throw new OrbitApiError(
          'NETWORK_ERROR',
          `Network request failed: ${fetchErr.message}`,
          'unknown',
          0
        );
      }

      // ── Handle 429 rate limit — retry with backoff ────────────────────────
      if (response.status === 429 && attempt < retries) {
        const retryAfter = parseInt(response.headers.get('retry-after') || '1', 10);
        await sleep(retryAfter * 1000 || 200 * Math.pow(2, attempt - 1));
        continue;
      }

      // ── Unwrap envelope ───────────────────────────────────────────────────
      if (responseData?.ok === true) {
        return responseData.data;
      }

      // ── Non-ok response → throw typed error ───────────────────────────────
      const errCode = responseData?.error?.code || 'UNKNOWN_ERROR';
      const errMsg = responseData?.error?.message || 'An unexpected error occurred';
      const requestId = responseData?.error?.requestId || responseData?.meta?.requestId || 'unknown';

      // Log requestId so support can trace
      if (typeof console !== 'undefined') {
        console.error(`[OrbitSDK] ${method} ${path} → ${errCode} (requestId: ${requestId})`);
      }

      throw new OrbitApiError(errCode, errMsg, requestId, response.status);
    }
  }

  get(path, options) { return this.request('GET', path, options); }
  post(path, options) { return this.request('POST', path, options); }
  put(path, options) { return this.request('PUT', path, options); }
  del(path, options) { return this.request('DELETE', path, options); }
}

module.exports = BaseClient;
