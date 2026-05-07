'use strict';

const express = require('express');
const router = express.Router();

const { handleOrderStatusWebhook } = require('../webhooks/orderStatusWebhook');
const { publicLimiter } = require('../middleware/rateLimit');

/**
 * Webhook routes — called by external logistics partners (FShip etc.)
 *
 * IMPORTANT: The raw body must be preserved for HMAC signature verification.
 * We use express.raw() on this specific route instead of express.json().
 * After capturing rawBody, we parse JSON manually.
 */

// Middleware to capture raw body for signature verification
// then parse JSON into req.body as usual
function captureRawBody(req, res, next) {
  let data = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => { data += chunk; });
  req.on('end', () => {
    req.rawBody = data;
    try {
      req.body = data ? JSON.parse(data) : {};
    } catch {
      req.body = {};
    }
    next();
  });
}

// POST /api/webhooks/order-status
// Called by FShip when shipment status changes
router.post(
  '/order-status',
  publicLimiter,   // still rate-limit to prevent abuse
  captureRawBody,  // must come before the handler
  handleOrderStatusWebhook
);

module.exports = router;
