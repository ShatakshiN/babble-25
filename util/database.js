const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callBack) =>{
    MongoClient.connect(
        'mongodb+srv://Tuktuk:Tuktuk@chatappbabble25.qud7t.mongodb.net/?retryWrites=true&w=majority&appName=chatappBabble25'
    )
        .then(client =>{
            console.log('connected');
            callBack(client);
        })
        .catch(err =>{
            console.log(err);
        })

};

module.exports = mongoConnect;
