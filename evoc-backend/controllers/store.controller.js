// evoc-backend/controllers/store.controller.js
//
// WHY THIS FILE EXISTS:
// Day 2 Morning task requires 3 new backend endpoints:
//   GET /api/store/settings  → branding (logo, colors, store name)
//   GET /api/store/contact   → contact info (email, phone, address)
//   GET /api/store/policies  → legal text (shipping, returns, privacy)
//
// All 3 follow the exact same pattern as product/category controllers:
//   tenantResolver injects req.storeId → we query the DB with it → safePrisma wraps the query

// Pull in the shared Prisma client (the single DB connection we always reuse)
const { prisma } = require('../config/db');

// Pull in our safety wrapper that prevents DB crashes from killing the server
const { safePrisma } = require('../utils/safePrisma');


// ─────────────────────────────────────────────────────────────────────────────
// GET /api/store/settings
// Returns the visual branding data for this merchant's store.
// Used by the storefront to show the correct logo, brand color, and store name.
// ─────────────────────────────────────────────────────────────────────────────
async function getStoreSettings(req, res) {
  // req.storeId was attached by tenantResolver middleware before this function ran.
  // It tells us WHICH store is making this request.
  const storeId = req.storeId;

  // Generate a unique ID for this specific request.
  // This gets returned in every response so frontend errors can be traced back
  // to a specific server-side request in the logs.
  const requestId = 'req_' + Date.now();

  // safePrisma takes a function (not a value) so it controls when the query runs.
  // If the DB query throws (network error, bad SQL, etc.), safePrisma catches it
  // and returns { ok: false } instead of crashing the server.
  const result = await safePrisma(
    () => prisma.storeSettings.findUnique({
      // findUnique means: find exactly ONE row where storeId matches.
      // storeId is marked @unique in schema.prisma, so there's at most 1 row per store.
      where: { storeId }
    }),
    {
      fallback: null,           // If DB fails, return null data (not crash)
      context: 'store.settings', // Label shown in server error logs
      requestId                  // Passed through so the response carries it
    }
  );

  // If DB query succeeded but no settings exist yet for this store → return 404
  // This is NOT a DB error (safePrisma didn't throw), just means the store
  // hasn't set up their branding yet.
  if (result.ok && !result.data) {
    return res.status(404).json({
      ok: false,
      error: {
        code: 'SETTINGS_NOT_FOUND',
        message: 'Store settings have not been configured yet.'
      },
      meta: { requestId }
    });
  }

  // result.ok = true means DB query worked fine → send 200 with the data
  // result.ok = false means DB itself failed → send 500
  const statusCode = result.ok ? 200 : 500;
  return res.status(statusCode).json(result);
}


// ─────────────────────────────────────────────────────────────────────────────
// GET /api/store/contact
// Returns the contact details for this merchant store.
// Used in the storefront footer, contact page, etc.
// ─────────────────────────────────────────────────────────────────────────────
async function getStoreContact(req, res) {
  const storeId = req.storeId;
  const requestId = 'req_' + Date.now();

  const result = await safePrisma(
    () => prisma.storeContact.findUnique({
      where: { storeId }
      // Returns: { email, phone, address, city, country }
    }),
    { fallback: null, context: 'store.contact', requestId }
  );

  if (result.ok && !result.data) {
    return res.status(404).json({
      ok: false,
      error: {
        code: 'CONTACT_NOT_FOUND',
        message: 'Store contact information has not been configured yet.'
      },
      meta: { requestId }
    });
  }

  const statusCode = result.ok ? 200 : 500;
  return res.status(statusCode).json(result);
}


// ─────────────────────────────────────────────────────────────────────────────
// GET /api/store/policies
// Returns all legal/operational text policies for this store.
// Used to render /shipping, /returns, /privacy pages on the storefront.
// ─────────────────────────────────────────────────────────────────────────────
async function getStorePolicies(req, res) {
  const storeId = req.storeId;
  const requestId = 'req_' + Date.now();

  const result = await safePrisma(
    () => prisma.storePolicy.findUnique({
      where: { storeId }
      // Returns: { shippingPolicy, returnPolicy, privacyPolicy }
    }),
    { fallback: null, context: 'store.policies', requestId }
  );

  if (result.ok && !result.data) {
    return res.status(404).json({
      ok: false,
      error: {
        code: 'POLICIES_NOT_FOUND',
        message: 'Store policies have not been configured yet.'
      },
      meta: { requestId }
    });
  }

  const statusCode = result.ok ? 200 : 500;
  return res.status(statusCode).json(result);
}


// Export all 3 handlers so the route file can import and use them
module.exports = { getStoreSettings, getStoreContact, getStorePolicies };
