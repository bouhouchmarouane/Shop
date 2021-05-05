const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
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
    User.findById("6091e4db9b502018e8511d6b")
        .then(user => {            
            req.user = user;
            next();
        })
        .catch(error => console.log(error));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/auth', authRoutes);
app.use(errorsRoutes);

mongoose.connect('mongodb+srv://marouane:062178416@cluster0.jwqbp.mongodb.net/shop?retryWrites=true&w=majority')
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
