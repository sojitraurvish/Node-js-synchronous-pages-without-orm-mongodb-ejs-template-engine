const ObjectId=require("mongodb").ObjectId;

const getDB=require("../util/database").getDb;

module.exports=class Admin{

    constructor(){

    }

    static login(email)
    {
        const db=getDB();
        return db
            .collection("admins")
            .find({email:email})
            .next()
    }
}