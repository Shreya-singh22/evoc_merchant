
const express = require('express');
const { getProducts, getProductBySlug } = require('../controllers/product.controller');
const { tenantResolver } = require('../middlewares/tenantResolver');

const router = express.Router();

// Apply the tenantResolver middleware to all product routes
router.use(tenantResolver);

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

module.exports = router;
