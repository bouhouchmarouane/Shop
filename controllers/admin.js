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
    Product.findById(productId)
        .then(([product]) => {
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                product: product[0]
            });
        })
        .catch(error => console.log(error));
}

exports.postSaveProduct = (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const product = new Product(title, price, imageUrl, description, id);
    product.save()
        .then(() => res.redirect('/admin/products-list'))
        .catch(error => console.log(error));
    
}

exports.getProductsList = (req, res) => {
    Product.fetchAll()
        .then(([products]) => {
            res.render('admin/products-list', {
                pageTitle: 'Products',
                path: '/admin/products-list',
                products: products
            });
        })
        .catch(error => console.log(error));
}

exports.deleteProduct = (req, res) => {
    const productId = req.body.productId;
    Product.delete(productId, () => res.redirect('/admin/products-list'));
}

