const fs = require('fs');
const path = require('path');

const Order = require('../models/order');
const Product = require('../models/product');

exports.getIndex = (req, res) => {
    Product.find()
        .then(products => {
            res.render('shop/products-list', {
                pageTitle: 'Shop',
                path: '/shop/index',
                products
            });
        })
        .catch(error => {
            return next(error);
        });
}

exports.getProductsList = (req, res) => {
    Product.find()
        .then(products => {
            res.render('shop/products-list', {
                pageTitle: 'Products',
                path: '/shop/products-list',
                products
            });
        })
        .catch(error => {
            return next(error);
        });
}

exports.getProductDetails = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            res.render('shop/product-details', {
                pageTitle: product.title,
                path: '/shop/product-details',
                product
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
        .catch(error => {
            return next(error);
        });
}

exports.PostCart = (req, res) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(() => res.redirect('/cart'))
        .catch(error => {
            return next(error);
        });
}

exports.getOrders = (req, res) => {
    Order.find({"userId": req.user}).sort({ date: -1 })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Orders',
                path: '/shop/orders',
                orders
            });
        })
        .catch(error => {
            return next(error);
        });
}

exports.deleteFromCart = (req, res) => {
    const productId = req.body.productId;
    req.user.deleteFromCart(productId)
        .then(() => res.redirect('/cart'))
        .catch(error => {
            return next(error);
        });
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
            const order = new Order({
                userId: user,
                items: products,
                date: new Date()
            });
            return order.save();
        })
        .then(() => req.user.clearCart())
        .then(() => res.redirect('/orders'))
        .catch(error => {
            return next(error);
        });
}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    const invoiceFileName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceFileName);
    fs.readFile(invoicePath, (error, data) => {
        if(error) return next(error);
        res.send(data);
    })
}