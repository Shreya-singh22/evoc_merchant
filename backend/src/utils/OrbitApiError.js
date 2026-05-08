'use strict';

/**
 * OrbitApiError
 * Typed error class used throughout the Orbit-360 backend.
 * The global errorHandler converts every OrbitApiError into
 * the standard error envelope.
 */
class OrbitApiError extends Error {
  /**
   * @param {string} code        - Machine-readable error code, e.g. 'ORDER_NOT_FOUND'
   * @param {string} message     - Human-readable description
   * @param {string} requestId   - req.requestId propagated for tracing
   * @param {number} statusCode  - HTTP status (default 400)
   */
  constructor(code, message, requestId, statusCode = 400) {
    super(message);
    this.name = 'OrbitApiError';
    this.code = code;
    this.message = message;
    this.requestId = requestId;
    this.statusCode = statusCode;

    // Maintain proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OrbitApiError);
    }
  }
}

module.exports = OrbitApiError;
