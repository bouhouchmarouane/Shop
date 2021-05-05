exports.getLogin = (req, res) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/auth/login',
    });
}

exports.postLogin = (req, res) => {
    req.isLoggedIn = true;
    res.redirect('/');
}