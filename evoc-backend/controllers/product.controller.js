
const { prisma } = require('../config/db');
const { safePrisma } = require('../utils/safePrisma');

// GET /api/products
async function getProducts(req, res) {
  const storeId = req.storeId; // Injected by tenantResolver middleware
  const requestId = 'req_' + Date.now();

  const result = await safePrisma(
    () => prisma.product.findMany({
      where: { storeId },
      include: { category: true } // Include category details
    }),
    { fallback: [], context: 'products.list', requestId }
  );

  const statusCode = result.ok ? 200 : 500;
  return res.status(statusCode).json(result);
}

// GET /api/products/:slug
async function getProductBySlug(req, res) {
  const storeId = req.storeId;
  const { slug } = req.params;
  const requestId = 'req_' + Date.now();

  const result = await safePrisma(
    () => prisma.product.findUnique({
      // using the compound unique constraint defined in schema.prisma
      where: { storeId_slug: { storeId, slug } },
      include: { category: true }
    }),
    { fallback: null, context: `products.getBySlug(${slug})`, requestId }
  );

  // If safePrisma succeeded but data is null, return 404
  if (result.ok && !result.data) {
    return res.status(404).json({
      ok: false,
      error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found in this store.' },
      meta: { requestId, tookMs: result.meta.tookMs }
    });
  }

  const statusCode = result.ok ? 200 : 500;
  return res.status(statusCode).json(result);
}

module.exports = { getProducts, getProductBySlug };
