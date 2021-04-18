const express = require('express');
const path = require('path');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('in the /');
    const products = adminData.products;
    //res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    res.render('shop', {
        docTitle: 'Shop',
        path: '/',
        products: products,
        hasProducts: products.length > 0,
        activeShop: true,
        productsCss: true
    });
});

module.exports = router;