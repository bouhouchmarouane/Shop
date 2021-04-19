const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
}

exports.postAddProduct = (req, res) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

exports.getProductsList = (req, res) => {
    Product.fetchAll(products => {
        res.render('admin/products-list', {
            pageTitle: 'Products',
            path: '/admin/products-list',
            products: products
        });
    });
}