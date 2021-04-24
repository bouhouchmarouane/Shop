const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const products = [];
const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', 
    'products.json'
);
const getProductsFromFile = callback => {    
    fs.readFile(p, (error, data) => {
        if(error) {
            callback([]);
        }
        else {
            callback(JSON.parse(data));
        }
    });
}

module.exports = class Product {
    constructor(title, price, imageUrl, description, id) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    save() {
        getProductsFromFile(products => {
            let prodsToSave;
            if(this.id === '') {
                this.id = Math.floor(Math.random()*10000000).toString();
                products.push(this);
                prodsToSave = products;
            }
            else {
                const index = products.findIndex(p => p.id === this.id);
                const editedProducts = [...products];
                editedProducts[index] = this;
                prodsToSave = editedProducts;
            }
            fs.writeFile(p, JSON.stringify(prodsToSave), error => {
                if(error) {
                    console.log(error);
                }
            });
        });
    }

    static delete(productId, callback) {
        getProductsFromFile(products => {
            const newProducts = products.filter(p => p.id !== productId);
            Product.findById(productId, product => {
                Cart.deleteProduct(product);
                fs.writeFile(p, JSON.stringify(newProducts), error => {
                    if(error) {
                        console.log(error);
                    }
                    callback();
                });
            });
        });
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }

    static findById(id, callback) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            callback(product);
        });
    }
}