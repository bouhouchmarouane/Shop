const User = require('../models/user');

exports.getLogin = (req, res) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/auth/login',
        isLoggedIn: false
    });
}

exports.postLogin = (req, res) => {
    User.findById("6091e4db9b502018e8511d6b")
        .then(user => {            
            req.session.user = user;
            req.session.isLoggedIn = true;
            req.session.save(() => res.redirect('/'));
        })
        .catch(error => console.log(error));
}

exports.getLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}