'use strict';

/**
 * Send a standard success envelope.
 *
 * { ok: true, data: {...}, meta: { requestId, tookMs } }
 */
function sendSuccess(res, data, { statusCode = 200, requestId, startTime } = {}) {
  const tookMs = startTime ? Date.now() - startTime : 0;
  return res.status(statusCode).json({
    ok: true,
    data,
    meta: {
      requestId: requestId || res.req?.requestId || 'unknown',
      tookMs,
    },
  });
}

/**
 * Send a standard error envelope.
 *
 * { ok: false, error: { code, message, requestId } }
 */
function sendError(res, { statusCode = 500, code = 'INTERNAL_SERVER_ERROR', message = 'An unexpected error occurred', requestId } = {}) {
  return res.status(statusCode).json({
    ok: false,
    error: {
      code,
      message,
      requestId: requestId || 'unknown',
    },
  });
}

module.exports = { sendSuccess, sendError };
