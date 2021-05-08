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
                product
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
    if(id !== '') {
        return Product.findById(id)
            .then(product => {
                product.title = title;
                product.price = price;
                product.imageUrl = imageUrl;
                product.description = description;
                product.save()
                    .then(() => res.redirect('/admin/products-list'))
                    .catch(error => console.log(error));
            });
    }
    else {
        const product = new Product({
            title: title, 
            price: price, 
            imageUrl: imageUrl, 
            description: description,
            userId: req.session.user._id
        });
        product.save()
            .then(() => res.redirect('/admin/products-list'))
            .catch(error => console.log(error));
    }
}

exports.getProductsList = (req, res) => {
    console.log('id', req.user._id)
    Product.find({userId: req.user._id})
        .then(products => {
            res.render('admin/products-list', {
                pageTitle: 'Products',
                path: '/admin/products-list',
                products
            });
        })
        .catch(error => console.log(error));
}

exports.deleteProduct = (req, res) => {
    const productId = req.body.productId;
    Product.findByIdAndRemove(productId)
        .then(() => res.redirect('/admin/products-list'))
        .catch(error => console.log(error));
}

