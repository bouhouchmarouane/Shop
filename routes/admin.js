const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');


router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/save-product', isAuth, adminController.postSaveProduct);
router.get('/products-list', isAuth, adminController.getProductsList);
router.post('/delete-product', isAuth, adminController.deleteProduct);
module.exports = router;