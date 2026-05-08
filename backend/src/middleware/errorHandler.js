'use strict';

const OrbitApiError = require('../utils/OrbitApiError');

/**
 * Global Express error handler (4-argument middleware).
 * Must be the LAST middleware registered in server.js.
 *
 * Handles:
 *   - OrbitApiError instances → mapped status + standard envelope
 *   - PrismaClientKnownRequestError → P2002/P2025/P2021/P2022 codes
 *   - All other errors → 500 INTERNAL_SERVER_ERROR
 *
 * Never exposes stack traces or raw messages in production.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const requestId = req.requestId || 'unknown';
  const isProd = process.env.NODE_ENV === 'production';

  // ── OrbitApiError ──────────────────────────────────────────────────────────
  if (err.name === 'OrbitApiError') {
    return res.status(err.statusCode).json({
      ok: false,
      error: {
        code: err.code,
        message: err.message,
        requestId,
      },
    });
  }

  // ── Prisma known request errors ───────────────────────────────────────────
  try {
    const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          return res.status(409).json({
            ok: false,
            error: {
              code: 'DUPLICATE_RESOURCE',
              message: 'A resource with these details already exists.',
              requestId,
            },
          });

        case 'P2025':
          return res.status(404).json({
            ok: false,
            error: {
              code: 'RESOURCE_NOT_FOUND',
              message: 'The requested resource was not found.',
              requestId,
            },
          });

        case 'P2021':
        case 'P2022':
          return res.status(503).json({
            ok: false,
            error: {
              code: 'DB_MIGRATION_REQUIRED',
              message: 'Run npx prisma migrate deploy on the server.',
              requestId,
            },
          });

        default:
          return res.status(500).json({
            ok: false,
            error: {
              code: 'DATABASE_ERROR',
              message: isProd ? 'A database error occurred.' : err.message,
              requestId,
            },
          });
      }
    }
  } catch (_importErr) {
    // Prisma not available — fall through to generic handler
  }

  // ── Generic / unexpected errors ───────────────────────────────────────────
  if (!isProd) {
    console.error('[errorHandler]', err);
  }

  return res.status(500).json({
    ok: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isProd ? 'An unexpected error occurred. Please try again later.' : err.message,
      requestId,
    },
  });
}

module.exports = errorHandler;
