const express = require('express');
const path = require('path');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getProducts)
router.get('/products-list');
router.get('/product-details');
router.get('/cart');
router.get('/checkout');

module.exports = router;