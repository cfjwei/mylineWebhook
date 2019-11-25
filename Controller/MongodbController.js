const configs = require('../config.js');
const MongoClient = require('mongodb').MongoClient;

const uri = configs.mongodb;
class MongodbContoller{
    constructor(){

    }

    init(){
        let _this = this;
        return new Promise(resolve=>{
            MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
                if (err){ 
                    console.log('connect error:', err); 
                }
                else { 
                    console.log('success connect to db');
                    _this.db = db; 
                    //DB斷線處理
                    _this.db.on('close',function(){
                        //...
                    });
                }

                resolve(err || 'success');
            });
        })
    }
    insertOne(collection,document){
        return new Promise(resolve=>{
            let dbo = this.db.db(dbName);
            dbo.collection(collection).insertOne(document, function(err, res) {
                if (err){
                    console.log('connect error:', err); 
                }
                else { 
                    console.log('success insert document');
                }
            
                resolve(err || 'success');
            });
        })
    }
}