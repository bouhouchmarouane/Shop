const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        product: null
    });
}

exports.getEditProduct = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId, product => {
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            product: product
        });
    });
}

exports.postSaveProduct = (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const product = new Product(title, price, imageUrl, description, id);
    product.save();
    res.redirect('/admin/products-list');
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

exports.deleteProduct = (req, res) => {
    const productId = req.body.productId;
    Product.delete(productId, () => res.redirect('/admin/products-list'));
}

