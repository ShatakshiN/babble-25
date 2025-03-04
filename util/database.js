const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (callBack) =>{
    MongoClient.connect(
        'mongodb+srv://Tuktuk:Tuktuk@chatappbabble25.qud7t.mongodb.net/?retryWrites=true&w=majority&appName=chatappBabble25'
    )
        .then(client =>{
            _db=client.db();
            callBack();
            console.log('connected');
        })
        .catch(err =>{
            console.log(err);
        })

};

const getDb= function(){
    if(_db){
        return _db;
    }
    throw "No database found";
}

module.exports = mongoConnect;
exports.getDb=getDb;
