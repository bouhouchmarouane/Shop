const mongodb = require('mongodb');

const getDb = require("../util/database").getDb;

class Product {
    constructor(title, price, imageUrl, description, id) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this._id = new mongodb.ObjectId(id);
    }

    save() {
        const db = getDb();
        if(this._id) {
            return db.collection('products').updateOne({_id: this._id}, {$set: this});
        }
        return db.collection('products').insertOne(this);
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray();
    }

    static findById(productId) {
        const db = getDb();
        return db.collection('products').find({_id: new mongodb.ObjectId(productId)}).next();
    }
}

module.exports = Product;