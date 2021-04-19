const fs = require('fs');
const path = require('path');

const products = [];
const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', 
    'products.json'
);

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        
        fs.readFile(p, (error, data) => {
            let products = [];
            if(!error) {
                products = JSON.parse(data);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (error) => {
                if(error) {
                    console.log(error);
                }
            });
        })
    }

    static fetchAll(callback) {
        fs.readFile(p, (error, data) => {
            if(error) {
                callback([]);
            }
            callback(JSON.parse(data));
        });
    }
}