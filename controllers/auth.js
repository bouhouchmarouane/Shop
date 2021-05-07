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
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email})
        .then(user => {
            if(!user) {
                return res.redirect('/auth/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if(doMatch) {
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        return req.session.save((error) => {
                            console.log(error);
                            res.redirect('/');
                        });
                    }
                    res.redirect('/auth/login');
                })
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
    User.findOne({email})
        .then(user => {
            if(user) {
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