const bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');

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
            sendEmail(email, name);
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

const sendEmail = (email, name) => {
    transporter.sendMail({
        from: 'marouanebhch@gmail.com',
        to: email,
        subject: 'Welcome aboard',
        html: '<h1>Welcome to Shop ' + name + '</h1>'
    }, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}