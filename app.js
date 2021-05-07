const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorsRoutes = require('./routes/errors');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://marouane:062178416@cluster0.jwqbp.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded());
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bulma', 'css')));
app.use('/css', express.static(path.join(__dirname, 'node_modules', '@fortawesome', 'fontawesome-free', 'css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', '@fortawesome', 'fontawesome-free', 'js')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
            .then(user => {
                req.user = user;
                next();
            })
            .catch(error => console.log(error));
});

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/auth', authRoutes);
app.use(errorsRoutes);

mongoose.connect(MONGODB_URI)
    .then(() => {
        return User.findOne()
            .then(user => {
                if(!user) {
                    const user = new User({
                        name: 'Marouane',
                        email: 'marouane@bouhouch.com',
                        cart: []
                    });
                    return user.save();
                }
            })
    })
    .then(() => app.listen(80))
    .catch(error => console.log(error));
