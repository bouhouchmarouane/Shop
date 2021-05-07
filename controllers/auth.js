const bcrypt = require('bcryptjs');

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

exports.getSignup = (req, res) => {
    res.render('auth/signup', {
        pageTitle: 'Sign up',
        path: '/auth/signup',
        isLoggedIn: false
    });
}

exports.PostSignup = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    User.find({email: email})
        .then(user => {
            console.log(user.length > 0);
            if(user.length > 0) {
                return res.redirect('/auth/signup');
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                        cart: []
                    });
                    console.log('1');
                    return newUser.save();
                })
                .then(() => res.redirect('/auth/login'));
        })
        .catch(error => console.log(error));
}

exports.getLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}