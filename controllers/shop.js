const Product = require('../models/product');

exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render('shop/products-list', {
            pageTitle: 'Shop',
            path: '/',
            products: products
        });
    });
}