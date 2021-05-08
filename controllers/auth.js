const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const {validationResult} = require('express-validator/check');

const crypto = require('crypto');

const User = require('../models/user');

const transporter = nodemailer.createTransport({
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
        errorMessages: req.flash('errorMessages'),
        inputs: {
            email: "",
            password: ""
        }
    });
}

exports.postLogin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const errorMessages = [...new Set(errors.array().map(error => error.msg))];
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: '/auth/login',
            errorMessages,
            inputs: {
                email,
                password
            },
            validationErrors: errors.array()
        });
    }
    User.findOne({email})
        .then(user => {
            if(!user) {
                req.flash('errorMessages', 'Invalid email or password');
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
                    req.flash('errorMessages', 'Invalid email or password');
                    res.redirect('/auth/login');
                })
        })
        .catch(error => console.log(error));
}

exports.getSignup = (req, res) => {
    res.render('auth/signup', {
        pageTitle: 'Sign up',
        path: '/auth/signup',
        errorMessages: req.flash('errorMessages'),
        inputs: {  
            name: "",
            email: "",
            password: ""
        }
    });
}

exports.PostSignup = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const errorMessages = [...new Set(errors.array().map(error => error.msg))];
        return res.status(422).render('auth/signup', {
            pageTitle: 'Sign up',
            path: '/auth/signup',
            errorMessages: errors,
            inputs: {  
                name,
                email,
                password
            },
            validationErrors: errors.array()
        });
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
        .then(() => res.redirect('/auth/login'))
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
        errorMessages: req.flash('errorMessages')
    });
}

exports.postResetPassword = (req, res) => {
    crypto.randomBytes(32, (error, buffer) => {
        if(error) {
            console.log(error);
            req.flash('errorMessages', 'An error has occured');
            return res.redirect('/auth/reset-password');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
            .then(user => {
                if(!user) {
                    req.flash('errorMessages', 'No account with that email address');
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
                    <b>Click <a href="http://localhost:80/auth/reset-password/${token}">this link</a> to set a new password</b>
                `)
            })
            .catch(error => console.log(error));
    })
}

exports.getNewPassword = (req, res) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user => {
            if(!user) {
                req.flash('errorMessages', 'No account with that email address');
                return res.redirect('/auth/reset-password');
            }
            res.render('auth/new-password', {
                pageTitle: 'New password',
                path: '/auth/new-password',
                errorMessages: req.flash('errorMessages'),
                userId: user._id.toString(),
                resetToken: token
        })
        .catch(error => console.log(error));
    });
}

exports.postNewPassword = (req, res) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const resetToken = req.body.resetToken;
    let resetUser;
    User.findOne({
        resetToken, 
        resetTokenExpiration: {$gt: Date.now()},
        _id: userId 
    })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12)
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(() => res.redirect('/auth/login'))
        .catch(error => console.log(error));
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