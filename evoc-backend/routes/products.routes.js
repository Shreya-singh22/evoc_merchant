
const express = require('express');
const { getProducts, getProductBySlug } = require('../controllers/product.controller');
const { tenantResolver } = require('../middlewares/tenantResolver');

// Import the SEO controller we built in Day 2
const { getProductSeoMeta } = require('../controllers/seo.controller');

const router = express.Router();

// Apply the tenantResolver middleware to all product routes
router.use(tenantResolver);

router.get('/', getProducts);

// ⚠️ ORDER MATTERS: /:slug/meta MUST come BEFORE /:slug
// Why? Express matches routes top-to-bottom. If /:slug came first,
// a request to /api/products/red-shoes/meta would match /:slug
// with slug = "red-shoes/meta" — which is wrong.
// By putting the specific pattern first, Express matches it correctly.
router.get('/:slug/meta', getProductSeoMeta);

router.get('/:slug', getProductBySlug);

module.exports = router;
