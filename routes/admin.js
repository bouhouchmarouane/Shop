const express = require('express');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
    console.log('in the /add-product get');
    //res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('add-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        productCss: true,
        formsCss: true,
        activeAddProduct: true
    });
});

router.post('/add-product', (req, res, next) => {
    console.log('in the /add-product post');
    products.push({ title: req.body.title });
    res.redirect('/');
});


exports.routes = router;
exports.products = products;