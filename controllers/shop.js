const Product = require('../models/product');
const Cart = require('../models/cart');

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

exports.getProductDetails = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId, product => {
        console.log("getProductDetailssss", productId, product);
        if(product) {
            res.render('shop/product-details', {
                pageTitle: product.title,
                path: '/shop/product-details',
                product: product
            });
        }
    });
}

exports.getCart = (req, res) => {
    const productsToRender = [];
    Cart.getCart(cart => {
        const cartPropductIds = cart.products.map(p => p.id);
        Product.fetchAll(products => {
            for(cartProduct of cart.products) {
                productsToRender.push({
                    "product": products.find(p => p.id === cartProduct.id),
                    "quantity": cartProduct.quantity
                });
            }
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/shop/cart',
                cart: productsToRender,
                totalPrice: cart.totalPrice
            });
        });
    })
}

exports.PostCart = (req, res) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.addProduct(product);
        res.redirect('/cart');    
    });
}

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/shop/checkout'
    });
}

exports.getOrders = (req, res) => {
    res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/shop/orders'
    });
}

exports.deleteFromCart = (req, res) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.deleteProduct(product, () => {
            res.redirect('/cart');
        });
    });
}