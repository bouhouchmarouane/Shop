const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
}

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const product = new Product(title, price, imageUrl, description);
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