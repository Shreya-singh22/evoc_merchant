// lib/orbit-api-error.js
//
// Single error type used everywhere. Routes throw this; withErrorHandler catches
// it and renders the standard error envelope from spec section 3.4.

export class OrbitApiError extends Error {
  /**
   * @param {string} code        machine-readable error code (UPPER_SNAKE_CASE)
   * @param {string} message     human-readable message safe to surface to users
   * @param {string} requestId   pass through from the route's context
   * @param {number} statusCode  HTTP status to send
   */
  constructor(code, message, requestId, statusCode = 500) {
    super(message);
    this.name = 'OrbitApiError';
    this.code = code;
    this.requestId = requestId;
    this.statusCode = statusCode;
  }
}
