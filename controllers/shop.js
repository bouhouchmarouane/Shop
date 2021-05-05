const Order = require('../models/order');
const product = require('../models/product');
const Product = require('../models/product');

exports.getIndex = (req, res) => {
    Product.find()
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
    Product.find()
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
    req.user.populate('cart.productId').execPopulate()
        .then(user => {
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/shop/cart',
                items: user.cart
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
    req.user.getOrders()
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
    req.user.populate('cart.productId').execPopulate()
        .then(user => {
            const products = user.cart.map(item => {
                return {
                    quantity: item.quantity,
                    product: {...item.productId._doc}
                }
            });
            console.log(products)
            const order = new Order({
                userId: user,
                items: products,
                date: new Date()
            });
            return order.save();
        })
        .then(() => res.redirect('/orders'))
        .catch(error => console.log(error));
}