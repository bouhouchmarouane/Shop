const {validationResult} = require('express-validator/check');

const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product',
        product: null
    });
}

exports.getEditProduct = (req, res) => {
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
        .catch(error => {
            const err = new Error(error);
            err.httpStatusCode = 500;
            return next(err);
        });
}

exports.postSaveProduct = (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
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
                product.imageUrl = imageUrl;
                product.description = description;
                product.save()
                    .then(() => res.redirect('/admin/products-list'))
                    .catch(error => {
                        const err = new Error(error);
                        err.httpStatusCode = 500;
                        return next(err);
                    });
            });
    }
    else {
        const product = new Product({
            _id: new ObjectId('6096726cc4a43b26c8c4f167'),
            title: title, 
            price: price, 
            imageUrl: imageUrl, 
            description: description,
            userId: req.session.user._id
        });
        product.save()
            .then(() => res.redirect('/admin/products-list'))
            .catch(error => {
                const err = new Error(error);
                err.httpStatusCode = 500;
                return next(err);
            });
    }
}

exports.getProductsList = (req, res) => {
    Product.find({userId: req.user._id})
        .then(products => {
            res.render('admin/products-list', {
                pageTitle: 'Products',
                path: '/admin/products-list',
                products,
                messageError: req.flash('errorMessages')
            });
        })
        .catch(error => {
            const err = new Error(error);
            err.httpStatusCode = 500;
            return next(err);
        });
}

exports.deleteProduct = (req, res) => {
    const productId = req.body.productId;
    Product.deleteOne({_id: productId, userId: req.user._id})
        .then(() => res.redirect('/admin/products-list'))
        .catch(error => {
            const err = new Error(error);
            err.httpStatusCode = 500;
            return next(err);
        });
}

