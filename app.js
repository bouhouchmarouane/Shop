const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

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
const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    }
});
const fileFilter = (req, file, callback) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
    callback(null, true);
    else 
    callback(null, false);
}

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({dest: 'images', fileFilter}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bulma', 'css')));
app.use('/css', express.static(path.join(__dirname, 'node_modules', '@fortawesome', 'fontawesome-free', 'css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', '@fortawesome', 'fontawesome-free', 'js')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store}));
app.use(csrfProtection);
app.use(flash());


app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
            .then(user => {
                if(!user) next()
                req.user = user;
                next();
            })
            .catch(error => {
                throw new Error(error);
            });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/auth', authRoutes);
app.use((error, req, res, next) => {
    console.log(error);
    const errorMessages = []
    errorMessages.push(error.toString())
    res.status(500).render('errors/500', {
        pageTitle: '500 - Error occured',
        path:'', 
        errorMessages
    });
});

mongoose.connect(MONGODB_URI)
    .then(() => app.listen(80))
    .catch(error => console.log(error));
