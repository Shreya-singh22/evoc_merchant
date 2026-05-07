'use strict';

/**
 * OrbitApiError — thrown by every SDK method on non-ok responses.
 * Mirrors the backend's OrbitApiError shape so callers get
 * consistent typed errors on both sides.
 */
class OrbitApiError extends Error {
  /**
   * @param {string} code        - e.g. 'ORDER_NOT_FOUND'
   * @param {string} message     - human-readable description
   * @param {string} requestId   - trace ID from meta.requestId
   * @param {number} statusCode  - HTTP status code
   */
  constructor(code, message, requestId, statusCode) {
    super(message);
    this.name = 'OrbitApiError';
    this.code = code;
    this.message = message;
    this.requestId = requestId || 'unknown';
    this.statusCode = statusCode || 400;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OrbitApiError);
    }
  }
}

module.exports = OrbitApiError;
