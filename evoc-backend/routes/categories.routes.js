
const express = require('express');
const { getCategories, getCategoryBySlug } = require('../controllers/category.controller');
const { tenantResolver } = require('../middlewares/tenantResolver');

const router = express.Router();

// Apply the tenantResolver middleware to all category routes
router.use(tenantResolver);

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

module.exports = router;
