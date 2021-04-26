const getDb = require("../util/database").getDb;

class Product {
    constructor(title, price, imageUrl, description) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    save() {
        const db = getDb();
        return db.collection('products').insertOne(this)
            .then(res => console.log(res))
            .catch(error => console.log(error));
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray();
    }
}

module.exports = Product;