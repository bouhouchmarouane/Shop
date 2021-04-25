const database = require('../util/database');

const Cart = require('./cart');

module.exports = class Product {
    constructor(title, price, imageUrl, description, id) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    save() {
        return database.execute('insert into products (title, price, description, imageUrl) values(?, ?, ?, ?)',
            [this.title, this.price, this.description, this.imageUrl]);
    }

    static delete(productId, callback) {
        // getProductsFromFile(products => {
        //     const newProducts = products.filter(p => p.id !== productId);
        //     Product.findById(productId, product => {
        //         Cart.deleteProduct(product);
        //         fs.writeFile(p, JSON.stringify(newProducts), error => {
        //             if(error) {
        //                 console.log(error);
        //             }
        //             callback();
        //         });
        //     });
        // });
    }

    static fetchAll(callback) {
        return database.execute('select * from products');
    }

    static findById(id) {
        return database.execute('select * from products where id = ?', [id]);
    }
}