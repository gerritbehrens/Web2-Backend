var mongoose = require('mongoose');
const config = require('config');

let _db;

const connectionString = config.get('db.connectionString');

function initDB(callback) {
    if (_db) {
        if (callback) {
            return callback(null, _db);
        }
        else {
            return _db;
        }
    }
    else {
        mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        _db = mongoose.connection;

        _db.on('error', console.error.bind(console, 'connection error:'));
        _db.prependOnceListener('open', function () {
            console.log("Connection to database " + connectionString + " in DB.js " + _db);
            callback(null, _db);
        });
    }
}

function getDB() {
    return _db;
}

module.exports = {
    getDB,
    initDB
}