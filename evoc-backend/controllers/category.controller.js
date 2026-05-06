
const { prisma } = require('../config/db');
const { safePrisma } = require('../utils/safePrisma');

// GET /api/categories
async function getCategories(req, res) {
  const storeId = req.storeId;
  const requestId = 'req_' + Date.now();

  const result = await safePrisma(
    () => prisma.category.findMany({
      where: { storeId },
      // Optional: include subcategories if parentId is used for a tree
    }),
    { fallback: [], context: 'categories.list', requestId }
  );

  const statusCode = result.ok ? 200 : 500;
  return res.status(statusCode).json(result);
}

// GET /api/categories/:slug
async function getCategoryBySlug(req, res) {
  const storeId = req.storeId;
  const { slug } = req.params;
  const requestId = 'req_' + Date.now();

  const result = await safePrisma(
    () => prisma.category.findUnique({
      where: { storeId_slug: { storeId, slug } },
      include: { products: true } // Include products in this category
    }),
    { fallback: null, context: `categories.getBySlug(${slug})`, requestId }
  );

  if (result.ok && !result.data) {
    return res.status(404).json({
      ok: false,
      error: { code: 'CATEGORY_NOT_FOUND', message: 'Category not found in this store.' },
      meta: { requestId, tookMs: result.meta.tookMs }
    });
  }

  const statusCode = result.ok ? 200 : 500;
  return res.status(statusCode).json(result);
}

module.exports = { getCategories, getCategoryBySlug };
