const Product = require('../models/product');

exports.getIndex = (req, res) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', {
                pageTitle: 'Shop',
                path: '/shop/index',
                products: products
            });
        })
        .catch(error => console.log(error));
}

exports.getProductsList = (req, res) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/products-list', {
                pageTitle: 'Products',
                path: '/shop/products-list',
                products: products
            });
        })
        .catch(error => console.log(error));
}

exports.getProductDetails = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            res.render('shop/product-details', {
                pageTitle: product.title,
                path: '/shop/product-details',
                product: product
            });
        });
}

exports.getCart = (req, res) => {
    req.user.getCart()
        .then(products => {
            console.log(products);
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/shop/cart',
                products: products
            });
        })
        .catch(error => console.log(error));
}

exports.PostCart = (req, res) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(() => res.redirect('/cart'))
        .catch(error => console.log(error));
}

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/shop/checkout'
    });
}

exports.getOrders = (req, res) => {
    req.user.getOrders({include: ['products']})
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Orders',
                path: '/shop/orders',
                orders
            });
        })
        .catch(error => console.log(error));
}

exports.deleteFromCart = (req, res) => {
    const productId = req.body.productId;
    req.user.deleteFromCart(productId)
        .then(() => res.redirect('/cart'))
        .catch(error => console.log(error));
}

exports.createOrder = (req, res) => {
    req.user.addOrder()
        .then(() => res.redirect('/orders'))
        .catch(error => console.log(error));
}