const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex)
router.get('/products-list', shopController.getProductsList);
router.get('/product-details/:productId', shopController.getProductDetails);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.PostCart);
router.get('/orders', shopController.getOrders);
router.post('/delete-from-cart', shopController.deleteFromCart);
router.post('/create-order', shopController.createOrder);

module.exports = router;