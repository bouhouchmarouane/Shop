const {validationResult} = require('express-validator/check');

const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product',
        product: null
    });
}

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findOne({_id: productId, userId: req.user._id})
        .then(product => {
            if(!product) {
                req.flash('errorMessages', 'Invalid userId');
                return res.redirect('/admin/products-list');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit product',
                path: '/admin/edit-product',
                product
            });
        })
        .catch(error => next(error));
}

exports.postSaveProduct = (req, res, next) => {
    const id = req.body.id;
    const title = req.body.title;
    const price = req.body.price;
    const image = req.file;
    const imageUrl = "/" + image.path;
    const description = req.body.description;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const productToUpdate = new Product({title, price, imageUrl, description, id: ''});
        const errorMessages = [...new Set(errors.array().map(error => error.msg))];
        if(id !== '') {
            productToUpdate._id = id
            return res.status(422).render('admin/edit-product', {
                pageTitle: 'Edit product',
                path: '/admin/edit-product',
                product: productToUpdate,
                errorMessages,
                price,
                validationErrors: errors.array()
            });
        }
        else {
            productToUpdate._id = null;
            return res.status(422).render('admin/edit-product', {
                pageTitle: 'Add product',
                path: '/admin/add-product',
                errorMessages,
                product: productToUpdate,
                price,
                validationErrors: errors.array()
            });
        }
    }
    if(id !== '') {
        return Product.findById(id)
            .then(product => {
                if(!product.userId.equals(req.user._id)) {
                    req.flash('errorMessages', 'Invalid userId');
                    return res.redirect('/admin/products-list');
                }
                product.title = title;
                product.price = price;
                if(image)
                    product.imageUrl = imageUrl;
                product.description = description;
                product.save()
                    .then(() => res.redirect('/admin/products-list'))
                    .catch(error => next(error));
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
            .catch(error => next(error));
    }
}

exports.getProductsList = (req, res, next) => {
    Product.find({userId: req.user._id})
        .then(products => {
            res.render('admin/products-list', {
                pageTitle: 'Products',
                path: '/admin/products-list',
                products,
                messageError: req.flash('errorMessages')
            });
        })
        .catch(error => next(error));
}

exports.deleteProduct = (req, res) => {
    const productId = req.body.productId;
    Product.deleteOne({_id: productId, userId: req.user._id})
        .then(() => res.redirect('/admin/products-list'))
        .catch(error => next(error));
}

