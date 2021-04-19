const products = [];

exports.getAddProduct = (req, res) => {
    res.render('add-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product'
    });
}

exports.postAddProduct = (req, res) => {
    products.push({ title: req.body.title });
    res.redirect('/');
}

exports.getProducts = (req, res) => {
    console.log('in the /');
    res.render('shop', {
        docTitle: 'Shop',
        path: '/'
    });
}