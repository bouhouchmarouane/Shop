const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const crypto = require('crypto');

const User = require('../models/user');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'marouanebhch@gmail.com',
        pass: '062178416++'
    },
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
});

exports.getLogin = (req, res) => {  
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/auth/login',
        errorMessage: req.flash('errorMessage')
    });
}

exports.postLogin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email})
        .then(user => {
            if(!user) {
                req.flash('errorMessage', 'Invalid email or password');
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
                    req.flash('errorMessage', 'Invalid email or password');
                    res.redirect('/auth/login');
                })
        })
        .catch(error => console.log(error));
}

exports.getSignup = (req, res) => {
    res.render('auth/signup', {
        pageTitle: 'Sign up',
        path: '/auth/signup',
        errorMessage: req.flash('errorMessage')
    });
}

exports.PostSignup = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email})
        .then(user => {
            if(user) {
                req.flash('errorMessage', 'This email has been already used');
                return res.redirect('/auth/signup');
            }
            sendEmail(email, 'Welcome aboard', '<h1>Welcome to Shop ' + name + '</h1>');
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                        cart: []
                    });
                    return newUser.save();
                })
                .then(() => res.redirect('/auth/login'));
        })
        .catch(error => console.log(error));
}

exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}

exports.getResetPassword = (req, res) => {
    res.render('auth/reset-password', {
        pageTitle: 'Reset password',
        path: '/auth/reset-password',
        errorMessage: req.flash('errorMessage')
    });
}

exports.postResetPassword = (req, res) => {
    crypto.randomBytes(32, (error, buffer) => {
        if(error) {
            console.log(error);
            req.flash('errorMessage', 'An error has occured');
            return res.redirect('/auth/reset-password');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
            .then(user => {
                if(!user) {
                    req.flash('errorMessage', 'No account with that email address');
                    return res.redirect('/auth/reset-password');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 60 * 60 * 1000;
                user.save();
            })
            .then(() => {
                res.redirect('/');
                sendEmail(req.body.email, "Password reset", `
                    <h1>Password reset</h1>
                    <b>Click <a href="http://localhost:80/reset-password/${token}">this link</a> to set a new password</b>
                `)
            })
            .catch(error => console.log(error));
    })
}

exports.getNewPassword = (req, res) => {
    const token = req.param.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user => {
            if(!user) {
                req.flash('errorMessage', 'No account with that email address');
                return res.redirect('/auth/new-password');
            }
            res.render('auth/new-password', {
                pageTitle: 'New password',
                path: '/auth/new-password',
                errorMessage: req.flash('errorMessage'),
                userId: user._id.toString()
        })
        .catch(error => console.log(error));
    });
}

const sendEmail = (email, subject, htmlText) => {
    transporter.sendMail({
        from: 'marouanebhch@gmail.com',
        to: email,
        subject,
        html: htmlText
    }, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}