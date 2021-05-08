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
    resetToken: String,
    resetTokenExpiration: Date
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