const express = require('express');
const {check, body} = require('express-validator/check');

const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const productValidation = [
    check('title').isLength({min: 1}).withMessage('Please enter a valid title'),
    body('price', 'Please enter a valid price').isFloat().custom(value => parseFloat(value) > 0)
];

router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/save-product', isAuth, productValidation, adminController.postSaveProduct);
router.get('/products-list', isAuth, adminController.getProductsList);
router.post('/delete-product', isAuth, adminController.deleteProduct);
module.exports = router;