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
    constructor(title) {
        this.title = title;
    }

    save() {
        getProductsFromFile((products) => {
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