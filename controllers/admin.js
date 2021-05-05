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
        .then(product => {
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                product: product
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
    //const userId = req.user._id;
    if(id !== '') {
        const editedProduct = new Product(title, price, imageUrl, description, id, userId);
        return editedProduct.save()
            .then(() => res.redirect('/admin/products-list'))
            .catch(error => console.log(error));
    }
    else {
        const product = new Product({title: title, price: price, imageUrl: imageUrl, description: description});
        product.save()
            .then(() => res.redirect('/admin/products-list'))
            .catch(error => console.log(error));
    }
}

exports.getProductsList = (req, res) => {
    Product.find()
        .then(products => {
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
    Product.delete(productId)
        .then(() => res.redirect('/admin/products-list'))
        .catch(error => console.log(error));
}

