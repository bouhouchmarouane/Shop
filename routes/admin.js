const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/add-product', adminController.getAddProduct);
// router.get('/edit-product/:productId', adminController.getEditProduct);
router.post('/save-product', adminController.postSaveProduct);
// router.get('/products-list', adminController.getProductsList);
// router.post('/delete-product', adminController.deleteProduct);
module.exports = router;