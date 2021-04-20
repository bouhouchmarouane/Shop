const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getProductsList)
router.get('/products-list', shopController.getProductsList);
router.get('/product/:productId', shopController.getProductDetails);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.PostCart);
router.get('/orders', shopController.getOrders);
router.get('/checkout', shopController.getCheckout);

module.exports = router;