const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsRoutes = require('./routes/errors');
const User = require('./models/user');
//const mongoConnect = require('./util/database').mongoConnect;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded());
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bulma', 'css')));
app.use('/css', express.static(path.join(__dirname, 'node_modules', '@fortawesome', 'fontawesome-free', 'css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', '@fortawesome', 'fontawesome-free', 'js')));

app.use((req, res, next) => {
    User.findById("6089d3284fc753884fbf3822")
        .then(user => {            
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(error => console.log(error));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorsRoutes);

mongoose.connect('mongodb+srv://marouane:062178416@cluster0.jwqbp.mongodb.net/shop?retryWrites=true&w=majority')
    .then(app.listen(80))
    .catch(error => console.log(error));
