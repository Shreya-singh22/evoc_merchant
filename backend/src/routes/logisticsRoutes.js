'use strict';

const express = require('express');
const router = express.Router();

const logisticsController = require('../controllers/logisticsController');
const { publicLimiter } = require('../middleware/rateLimit');

// ─── Public logistics routes ──────────────────────────────────────────────────

// Track shipment by AWB number
router.get('/public/track', publicLimiter, logisticsController.trackShipmentPublic);

// Check pincode serviceability
router.get('/public/pincode/:code', publicLimiter, logisticsController.checkPincode);

// Hot / trending products for a store
router.get('/public/hot-products', publicLimiter, logisticsController.getHotProducts);

module.exports = router;
