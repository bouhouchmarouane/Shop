const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://marouane:062178416@cluster0.jwqbp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
        .then(client => {
            console.log("connected");
            callback(client);
        })
        .catch(error => console.log(error));
}

module.exports = mongoConnect;