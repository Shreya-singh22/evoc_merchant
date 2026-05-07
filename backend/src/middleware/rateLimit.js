'use strict';

const rateLimit = require('express-rate-limit');

/**
 * publicLimiter — applied to public-facing routes.
 * 60 requests per minute per IP.
 */
const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests — please try again after a minute.',
    },
  },
});

/**
 * merchantLimiter — slightly more generous for authenticated routes.
 * 200 requests per minute per IP.
 */
const merchantLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests — please slow down.',
    },
  },
});

module.exports = { publicLimiter, merchantLimiter };
