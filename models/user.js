const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;
const Product = require('../models/product')
const ObjectId = mongodb.ObjectId;

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        if(cart)
            this.cart = cart;
        else {
            this.cart = {items: [], totalPrice: 0}
        }
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray();
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)});
    }

    static delete(productId) {
        const db = getDb();
        return db.collection('products').deleteOne({_id: new mongodb.ObjectId(productId)});
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(item => {
            console.log(item.productId)
            console.log(product._id)

            console.log(item.productId.equals(product._id))
            return item.productId.equals(product._id)
        });
        let updatedCart = {...this.cart};
        updatedCart.items = [...this.cart.items];
        updatedCart.totalPrice = this.cart.totalPrice;
        if(cartProductIndex >= 0) {
            console.log("here1")
            const cartProduct = this.cart.items[cartProductIndex];
            const updatedCartProduct = {...cartProduct}; 
            updatedCartProduct.quantity = updatedCartProduct.quantity + 1;
            updatedCart.items[cartProductIndex] = updatedCartProduct;
        }
        else {
            console.log("here2ddd")
            updatedCart.items.push({productId: new ObjectId(product._id), quantity: 1});                                      
        }
        updatedCart.totalPrice = parseFloat(updatedCart.totalPrice) + parseFloat(product.price);
        const db = getDb();  
        return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart: updatedCart}});
    }
}

module.exports = User;