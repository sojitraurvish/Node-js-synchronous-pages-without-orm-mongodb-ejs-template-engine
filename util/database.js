const mongodb=require("mongodb");

const MongoClient=mongodb.MongoClient;

require("dotenv").config();

const DB_DATABASE=process.env.DB_DATABASE;
const DB_USERNAME=process.env.DB_USERNAME;
const DB_PASSWORD=process.env.DB_PASSWORD;

let _db;

const mongoConnect=(callback)=>{
    MongoClient.connect("mongodb+srv://"+DB_USERNAME+":"+DB_PASSWORD+"@ecom.mehbxhu.mongodb.net/"+DB_DATABASE+"?retryWrites=true&w=majority")
    .then((client)=>{
        console.log("DB Connected!");
        _db=client.db();
        callback();
    })
    .catch((error)=>{
        console.log(error);
    });
}

const getDb=()=>{
    if(_db)
    {
        return _db;
    }
    throw "No Database Found!";
}

module.exports.mongoConnect=mongoConnect;
module.exports.getDb=getDb;