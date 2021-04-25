const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res) => {
    Product.findAll()
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
    Product.findAll()
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
        .then(([product]) => {
            if(product[0]) {
                res.render('shop/product-details', {
                    pageTitle: product[0].title,
                    path: '/shop/product-details',
                    product: product[0]
                });
            }
        });
}

exports.getCart = (req, res) => {
    const productsToRender = [];
    Cart.getCart(cart => {
        const cartPropductIds = cart.products.map(p => p.id);
        Product.fetchAll()
            .then(([products]) => {
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
            })
            .catch(error => console.log(error));
    });
}

exports.PostCart = (req, res) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(([product]) => {
            Cart.addProduct(product[0]);
            res.redirect('/cart');
        })
        .catch(error => console.log(error));
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
    Product.findById(productId)
        .then(([product]) => {
            Cart.deleteProduct(product[0], () => {
                res.redirect('/cart');
            });
        })
        .catch(error => console.log(error));
}