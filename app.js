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
        callback(null, 'image');
    },
    filename: (req, file, callback) => {
        callback(null, new Date().toISOString() + "-" + file.originalname);
    }
});
const fileFilter = (req, file, callback) => {
    callback(null, file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
}

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded());
app.use(multer({storage: fileStorage}).single('image'));
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
                if(!user) next()
                req.user = user;
                next();
            })
            .catch(error => {
                throw new Error(error);
            });
});

app.use((req, res, next) => {
    console.log("LOGGGGG", req.session.isLoggedIn);
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/auth', authRoutes);
app.use(errorsRoutes);
app.use((error, req, res, next) => {
    const errorMessages = []
    errorMessages.push(error.toString())
    res.status(500).render('errors/500', {pageTitle: '500 - Error occured', path:'', errorMessages});
});

mongoose.connect(MONGODB_URI)
    .then(() => app.listen(80))
    .catch(error => console.log(error));
