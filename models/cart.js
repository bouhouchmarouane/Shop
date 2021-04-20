const fs = require('fs');
const path = require('path');

const Product = require('./product');

const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', 
    'cart.json'
);

module.exports = class Cart {
    static addProduct(productId) {
        Product.findById(productId, product => {
            let cart = {products: [], totalPrice: 0};
            fs.readFile(p, (error, data) => {
                if(!error) {
                    cart = JSON.parse(data);
                }
                const existingProductIndex = cart.products.findIndex(prod => prod.id === productId);
                const existingProduct = cart.products[existingProductIndex];
                let updatedProduct;
                if(existingProduct) {
                    updatedProduct = {...existingProduct};
                    updatedProduct.quantity++;
                    cart.products = [...cart.products];
                    cart.products[existingProductIndex] = updatedProduct;
                }
                else {
                    updatedProduct = {id: productId, quantity: 1};
                    cart.products = [...cart.products, updatedProduct];
                }
                cart.totalPrice = parseFloat(cart.totalPrice) + parseFloat(product.price);
                fs.writeFile(p, JSON.stringify(cart), error => {
                    if(error) {
                        console.log(error);
                    }
                });
            });
        });
    }
}