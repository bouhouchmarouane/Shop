const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    imageUrl: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);

// const mongodb = require('mongodb');

// const getDb = require("../util/database").getDb;

// class Product {
//     constructor(title, price, imageUrl, description, id, userId) {
//         this.title = title;
//         this.price = price;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this._id = id? new mongodb.ObjectId(id): null;
//         this.userId = userId;
//     }

//     save() {
//         const db = getDb();
//         if(this._id) {
//             return db.collection('products').updateOne({_id: this._id}, {$set: this});
//         }
//         return db.collection('products').insertOne(this);
//     }

//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products').find().toArray();
//     }

//     static findById(productId) {
//         const db = getDb();
//         return db.collection('products').find({_id: new mongodb.ObjectId(productId)}).next();
//     }

//     static delete(productId) {
//         const db = getDb();
//         return db.collection('products').deleteOne({_id: new mongodb.ObjectId(productId)});
//     }
// }

// module.exports = Product;