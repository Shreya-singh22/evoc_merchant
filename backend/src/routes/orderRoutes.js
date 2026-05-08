'use strict';

const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const idempotencyMiddleware = require('../middleware/idempotency');
const { publicLimiter } = require('../middleware/rateLimit');
const { ROLES } = require('../utils/roles');

// ─── Public routes ────────────────────────────────────────────────────────────

// Existing storefront order creation
router.post('/', orderController.createStorefrontOrder);

// Order lookup by orderNumber + email
router.post('/lookup', publicLimiter, orderController.lookupOrder);

// Atomic direct checkout — idempotency-protected
router.post('/direct', idempotencyMiddleware, orderController.directCheckout);

// Public shipment tracking
router.get('/track/:trackingId', publicLimiter, orderController.trackOrder);

// ─── Merchant-authenticated routes ───────────────────────────────────────────

// List all orders for a store
router.get(
  '/store/:storeId',
  auth,
  rbac([ROLES.MERCHANT, ROLES.ADMIN]),
  orderController.getStoreOrders
);

// Get a single order by DB id
router.get('/:id', auth, orderController.getOrderById);

// Update order status (e.g. PACKED, SHIPPED)
router.put(
  '/:id/status',
  auth,
  rbac([ROLES.MERCHANT, ROLES.ADMIN]),
  orderController.updateOrderStatus
);

// Update fulfillment status
router.put(
  '/:id/fulfillment',
  auth,
  rbac([ROLES.MERCHANT, ROLES.ADMIN]),
  orderController.updateFulfillmentStatus
);

// Soft-cancel an order
router.delete(
  '/:id',
  auth,
  rbac([ROLES.MERCHANT, ROLES.ADMIN]),
  orderController.cancelOrder
);

module.exports = router;
