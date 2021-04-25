const fs = require('fs');
const path = require('path');

const Product = require('./product');

const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', 
    'cart.json'
);

module.exports = class Cart {
    static addProduct(product) {
        let cart = {products: [], totalPrice: 0};
        fs.readFile(p, (error, data) => {
            if(!error) {
                cart = JSON.parse(data);
            }
            const existingProductIndex = cart.products.findIndex(prod => prod.id === product.id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.quantity++;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            }
            else {
                updatedProduct = {id: product.id, quantity: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = parseFloat(cart.totalPrice) + parseFloat(product.price);
            fs.writeFile(p, JSON.stringify(cart), error => {
                if(error) {
                    console.log(error);
                }
            });
        });
    }

    static deleteProduct(product, callback) {
        fs.readFile(p, (error, data) => {
            if(!error) {
                const cart = JSON.parse(data);
                const updatedCart = {...cart};
                const deletedProduct = updatedCart.products.find(p => p.id === product.id);
                console.log("updatedCart.products1", updatedCart.products);
                updatedCart.products = updatedCart.products.filter(p => p.id !== product.id);
                console.log("updatedCart.products2", updatedCart.products);
                updatedCart.totalPrice = updatedCart.totalPrice - product.price * deletedProduct.quantity;
                fs.writeFile(p, JSON.stringify(updatedCart), error => {
                    if(error) {
                        console.log(error);
                    }
                    callback();
                });
            }
        });
    }

    static getCart(callback) {
        fs.readFile(p, (error, data) => {            
            if(error) {
                callback({products: [], totalPrice: 0});
            }
            else {
                callback(JSON.parse(data));
            }
        });
    }
 }