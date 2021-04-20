const fs = require('fs');
const path = require('path');

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
    constructor(title, price, imageUrl, description) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    save() {
        getProductsFromFile((products) => {
            console.log(this);
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (error) => {
                if(error) {
                    console.log(error);
                }
            });
        })
    }

    static fetchAll(callback) {
        getProductsFromFile(callback)
    }
}