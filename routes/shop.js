const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex)
router.get('/products-list', shopController.getProductsList);
router.get('/product-details/:productId', shopController.getProductDetails);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.PostCart);
router.get('/orders', isAuth, shopController.getOrders);
router.post('/delete-from-cart', isAuth, shopController.deleteFromCart);
router.post('/create-order', isAuth, shopController.createOrder);
router.get('/orders/:orderId', isAuth, shopController.getInvoice);

module.exports = router;