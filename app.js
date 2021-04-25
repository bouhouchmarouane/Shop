const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsRoutes = require('./routes/errors');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded());
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bulma', 'css')));
app.use('/css', express.static(path.join(__dirname, 'node_modules', '@fortawesome', 'fontawesome-free', 'css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', '@fortawesome', 'fontawesome-free', 'js')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorsRoutes);

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(error => console.log(error));
});

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
sequelize.sync().then(() => {
    return User.findByPk(1);
})
    .then(user => {
        if(!user) {
            return User.create({
                name: 'Marouane',
                email: 'marouane@gmail.com'
            });
        }
        return user
    })
    .then(() => app.listen(80))
    .catch(error => console.log(error));

