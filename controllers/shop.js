const fs = require('fs');
const path = require('path');

const Order = require('../models/order');
const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/products-list', {
                pageTitle: 'Shop',
                path: '/shop/index',
                products
            });
        })
        .catch(error => next(error));
}

exports.getProductsList = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/products-list', {
                pageTitle: 'Products',
                path: '/shop/products-list',
                products
            });
        })
        .catch(error => next(error));
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

exports.getCart = (req, res, next) => {
    req.user.populate('cart.productId').execPopulate()
        .then(user => {
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/shop/cart',
                items: user.cart
            });
        })
        .catch(error => next(error));
}

exports.PostCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(() => res.redirect('/cart'))
        .catch(error => next(error));
}

exports.getOrders = (req, res, next) => {
    Order.find({"userId": req.user}).sort({ date: -1 })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Orders',
                path: '/shop/orders',
                orders
            });
        })
        .catch(error => next(error));
}

exports.deleteFromCart = (req, res, next) => {
    const productId = req.body.productId;
    req.user.deleteFromCart(productId)
        .then(() => res.redirect('/cart'))
        .catch(error => next(error));
}

exports.createOrder = (req, res, next) => {
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
        .catch(error => next(error));
}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findOne({_id: orderId, userId: req.user._id})
        .then(order => {
            if(!order) {
                return next(new Error('Unauthorized'));
            }
            const invoiceFileName = 'invoice-' + orderId + '.pdf';
            const invoicePath = path.join('data', 'invoices', invoiceFileName);
            // fs.readFile(invoicePath, (error, data) => {
            //     if(error) return next(error);
            //     res.setHeader('Content-type', 'application/pdf');
            //     res.setHeader('Content-disposition', 'attachement; filename="' + invoiceFileName + '"');
            //     res.send(data);
            // });
            const file = fs.createReadStream(invoicePath);
            res.setHeader('Content-type', 'application/pdf');
            res.setHeader('Content-disposition', 'attachement; filename="' + invoiceFileName + '"');
            file.pipe(res);
        })
        .catch(error => next(error));
}