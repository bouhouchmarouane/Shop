const Product = require('../models/product');

exports.getIndex = (req, res) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            pageTitle: 'Shop',
            path: '/shop/index',
            products: products
        });
    });
}

exports.getProductsList = (req, res) => {
    Product.fetchAll(products => {
        res.render('shop/products-list', {
            pageTitle: 'Products',
            path: '/shop/products-list',
            products: products
        });
    });
}

exports.getCart = (req, res) => {
    res.render('shop/product-details', {
        pageTitle: 'Product details',
        path: '/shop/product-details'
    });
}

exports.getCart = (req, res) => {
    res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/shop/cart'
    });
}

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/shop/checkout'
    });
}