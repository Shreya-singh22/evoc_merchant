'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

// ── Config & connections ─────────────────────────────────────────────────────
const { connectMongo } = require('./config/mongo');
const redis = require('./config/redis');

// ── Global middleware ────────────────────────────────────────────────────────
const requestId = require('./middleware/requestId');
const validateDomain = require('./middleware/validateDomain');
const errorHandler = require('./middleware/errorHandler');

// ── Routes ───────────────────────────────────────────────────────────────────
const orderRoutes = require('./routes/orderRoutes');
const logisticsRoutes = require('./routes/logisticsRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

// ─────────────────────────────────────────────────────────────────────────────

const app = express();

// ── Security & parsing ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// ── GLOBAL MIDDLEWARE (order matters) ────────────────────────────────────────
// 1. Attach requestId to every request (must be first)
app.use(requestId);

// 2. Resolve tenant from subdomain / x-store-id header
app.use(validateDomain);

// ── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'orbit-360-gauthami', requestId: req.requestId });
});

// ── ROUTE MOUNTS ─────────────────────────────────────────────────────────────
app.use('/api/orders', orderRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/webhooks', webhookRoutes);

// ── 404 HANDLER ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found.`,
      requestId: req.requestId,
    },
  });
});

// ── GLOBAL ERROR HANDLER (must be last) ──────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;

async function boot() {
  // Connect to Redis (lazy — errors are logged but won't crash the server)
  try {
    await redis.connect();
  } catch (err) {
    console.error('[Redis] Failed to connect on boot:', err.message);
  }

  // Connect to MongoDB
  await connectMongo();

  // Start Express
  app.listen(PORT, () => {
    console.log(`\n🚀  Orbit-360 Gauthami backend running on http://localhost:${PORT}`);
    console.log(`    Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`    Health      : http://localhost:${PORT}/health\n`);
  });
}

boot().catch((err) => {
  console.error('[boot] Fatal error:', err);
  process.exit(1);
});

module.exports = app; // for testing
