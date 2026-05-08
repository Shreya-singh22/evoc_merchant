// WHY THIS FILE EXISTS:
// This is the "traffic director" for all /api/store/* endpoints.
// It maps incoming URLs to the right controller function.
//
// Route structure this file creates:
//   GET /api/store/settings  → getStoreSettings()
//   GET /api/store/contact   → getStoreContact()
//   GET /api/store/policies  → getStorePolicies()
// Notice: ALL routes here require tenantResolver first.
// That middleware MUST run before controllers so req.storeId is available.

const express = require('express');

// Import the 3 controller functions we built in store.controller.js
const { getStoreSettings, getStoreContact, getStorePolicies } = require('../controllers/store.controller');

// Import the tenant middleware — this validates WHO is making the request
const { tenantResolver } = require('../middlewares/tenantResolver');

// Create a mini Express app (a "Router") for just the /store sub-routes.
// When index.js does app.use('/api/store', storeRoutes), Express prefixes
// all routes below with /api/store automatically.
const router = express.Router();

// Apply tenantResolver to ALL routes in this router in one line.
// Without this, every route handler would need to validate the tenant manually.
// router.use() means: "run this function BEFORE any route handler below"
router.use(tenantResolver);

// GET /api/store/settings
// No :params here — a store has exactly one settings record, identified by storeId
router.get('/settings', getStoreSettings);

// GET /api/store/contact
router.get('/contact', getStoreContact);

// GET /api/store/policies
router.get('/policies', getStorePolicies);

module.exports = router;
