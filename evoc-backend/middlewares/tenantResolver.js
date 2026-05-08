

/**
 * Middleware to extract the merchant tenant ID from the request.
 * As per the PDF specs, it checks `x-store-id` header first, then falls back to `Origin`/`Host`.
 */
function tenantResolver(req, res, next) {
  // Option A: x-store-id header (preferred)
  let storeId = req.headers['x-store-id'];

  // Option B: Subdomain parsing from Host/Origin (simplified for this scaffold)
  if (!storeId) {
    const host = req.headers['origin'] || req.headers['host'];
    if (host && host.includes('.evoclabs.shop')) {
      // Extract subdomain (e.g., "mystore" from "mystore.evoclabs.shop")
      const subdomain = host.split('.')[0].replace('https://', '').replace('http://', '');
      // In a real app, you'd look up the storeId by subdomain here.
      // For this scaffold, we'll assume the subdomain string IS the storeId or maps directly.
      storeId = subdomain;
    }
  }

  // Enforce rule: If no tenant is found, return 400 TENANT_REQUIRED
  if (!storeId) {
    return res.status(400).json({
      ok: false,
      error: { code: 'TENANT_REQUIRED', message: 'Missing x-store-id header or valid merchant subdomain.' },
      meta: { requestId: 'req_' + Date.now() }
    });
  }

  // Attach to request object so controllers can access it securely
  req.storeId = storeId;
  next();
}

module.exports = { tenantResolver };
