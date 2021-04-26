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
    req.user.getProducts({where: { id: productId}})
        .then(products => {
            const product = products[0];
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
    const product = new Product(title, price, imageUrl, description);
    if(id !== '') {
        Product.findByPk(id)
            .then(product => {
                product.title = title;
                product.price = price;
                product.imageUrl = imageUrl;
                product.description =description;
                return product.save()
            })
            .then(() => res.redirect('/admin/products-list'))
            .catch(error => console.log(error));
    }
    else {
        product.save()
            .then(() => res.redirect('/admin/products-list'))
            .catch(error => console.log(error));
    }
}

exports.getProductsList = (req, res) => {
    req.user.getProducts()
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
    Product.findByPk(productId)
        .then(product => {
            return product.destroy();
        })
        .then(() => res.redirect('/admin/products-list'))
        .catch(error => console.log(error));
}

