const configs = require('../config.js');
const MongoClient = require('mongodb').MongoClient;

const uri = configs.mongodb;
class MongodbContoller {
    constructor() {
        this.init = this.init.bind(this);
        this.insertOne = this.insertOne.bind(this);
        this.find = this.find.bind(this);
    }

    init() {
        let _this = this;
        return new Promise((resolve,reject) => {
            MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) {
                    console.log('connect error:', err);
                    reject({
                        success: false,
                        message: err
                    });
                }
                else {
                    console.log('success connect to db');
                    _this.db = db;
                    resolve({ success: true });
                }
                //resolve(err || 'success');
            });
        })
    }
    insertOne(dbName, collection, document) {
        return new Promise(resolve => {
            let dbo = this.db.db(dbName);
            dbo.collection(collection).insertOne(document, function (err, res) {
                if (err) {
                    console.log('connect error:', err);
                }
                else {
                    console.log('success insert document');
                }

                resolve(err || 'success');
            });
        })
    }

    find(dbName, collection, query){
        return new Promise((resolve, reject) => {
            try{
                let dbo = this.db.db(dbName);
                dbo.collection(collection).find(query).toArray(function(err, res) {
                    if (err){
                        console.log('[DB] find error:', err); 
                        reject({
                            success: false,
                            error: err
                        });
                    }
                    else { 
                        console.log('[DB] success find documents, length:', res.length);
                        resolve({
                            success: true,
                            document: res
                        });
                    }
                });
            }catch(err){
                reject({
                    success: false,
                    error: err
                });
            }
        })
    }
}
module.exports = new MongodbContoller();