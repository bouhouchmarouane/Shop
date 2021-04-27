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
        .then(cart => {
            console.log("cart", cart);
            return cart.getProducts();
        })
        .then(products => {
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
    let fetchedCart;
    let newQuantity;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({where: {id: productId}});
        })
        .then(products => {
            if(products.length === 0) {
                newQuantity = 1;
                return Product.findByPk(productId);
            }
            else {
                const product = products[0];
                newQuantity = product.cartItem.quantity + 1;
                return product;
            }
        })
        .then(product => {
            return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
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
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({where: {id: productId}});
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => res.redirect('/cart'))
        .catch(error => console.log(error));
}

exports.createOrder = (req, res) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = {quantity: product.cartItem.quantity};
                        return product;
                    }));
                });
        })
        .then(() => {
            return fetchedCart.setProducts(null);
        })
        .then(() => res.redirect('/orders'))
        .catch(error => console.log(error));
}