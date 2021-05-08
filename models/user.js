const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: [{
        productId: { 
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }, 
        quantity: {
            type: Number,
            required: true
        }
    }],
});

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.findIndex(item => item.productId.equals(product._id));
    let updatedCart = [...this.cart];
    if(cartProductIndex >= 0) {
        const updatedCartProduct = this.cart[cartProductIndex]; 
        updatedCartProduct.quantity = updatedCartProduct.quantity + 1;
        updatedCart[cartProductIndex] = updatedCartProduct;
    }
    else {
        updatedCart.push({productId: product._id, quantity: 1});                                      
    }
    this.cart = updatedCart;
    return this.save();
}


userSchema.methods.deleteFromCart = function(productId) {
    this.cart = this.cart.filter(item => !item.productId.equals(productId));
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = [];
    return this.save();
}


module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');

// const getDb = require('../util/database').getDb;
// const Product = require('../models/product')
// const ObjectId = mongodb.ObjectId;

// class User {
//     constructor(name, email, cart, id) {
//         this.name = name;
//         this.email = email;
//         if(cart)
//             this.cart = cart;
//         else {
//             this.cart = [];
//         }
//         this._id = id;
//     }

//     save() {
//         const db = getDb();
//         return db.collection('users').insertOne(this);
//     }

//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products').find().toArray();
//     }

//     static findById(userId) {
//         const db = getDb();
//         return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)});
//     }

//     static delete(productId) {
//         const db = getDb();
//         return db.collection('products').deleteOne({_id: new mongodb.ObjectId(productId)});
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart.findIndex(item => item.productId.equals(product._id));
//         let updatedCart = [...this.cart];
//         if(cartProductIndex >= 0) {
//             const cartProduct = this.cart[cartProductIndex];
//             const updatedCartProduct = {...cartProduct}; 
//             updatedCartProduct.quantity = updatedCartProduct.quantity + 1;
//             updatedCart[cartProductIndex] = updatedCartProduct;
//         }
//         else {
//             updatedCart.push({productId: new ObjectId(product._id), quantity: 1});                                      
//         }
//         const db = getDb();  
//         return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart: updatedCart}});
//     }

//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.map(item => item.productId);
//         return db.collection('products').find({_id: {$in: productIds}}).toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {...p, quantity: this.cart.find(item => item.productId.equals(p._id)).quantity};
//                 })
//             })
//     }

//     deleteFromCart(productId) {
//         const db = getDb();
//         const updatedCart = this.cart.filter(item => item.productId != productId);
//         return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart: updatedCart}});
//     }

//     addOrder() {
//         const db = getDb();
//         return this.getCart()
//             .then(products => {
//                 const order = {
//                     items: products,
//                     userId: this._id,
//                     date: new Date()
//                 }
//                 return db.collection('orders').insertOne(order)
//                     .then(() => {
//                         this.cart = [];
//                         return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart: []}});
//                     })
//             });
//     }

//     getOrders() {
//         const db = getDb();
//         return db.collection('orders').find({userId: new ObjectId(this._id)}).sort({date: -1}).toArray();
//     }
// }

// module.exports = User;