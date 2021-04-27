const mongodb = require('mongodb');

const getDb = require("../util/database").getDb;

class Product {
    constructor(title, price, imageUrl, description) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    save() {
        const db = getDb();
        return db.collection('products').insertOne(this)
            .then(res => console.log(res))
            .catch(error => console.log(error));
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray();
    }

    static findById(productId) {
        const db = getDb();
        console.log('pp', productId);
        return db.collection('products').find({_id: new mongodb.ObjectId(productId)}).next();
    }
}

module.exports = Product;