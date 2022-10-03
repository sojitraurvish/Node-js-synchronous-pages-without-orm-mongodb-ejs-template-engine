const ObjectId=require("mongodb").ObjectId;

const getDB=require("../util/database").getDb;


module.exports=class Category{
    constructor(){

    }

    static selectAllCategory(page="",ITEMS_PER_PAGE=""){
        
        const db=getDB();
        if(page==="" && page==="")
        {
        return db
            .collection("categories")
            .find()
            .sort({_id:-1})
            .toArray()
        }
        else{
            return db
            .collection("categories")
            .find()
            .skip((page-1)*ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
            .sort({_id:-1})
            .toArray()
        }
    }

    static countNumberOfCategory(){
        const db=getDB();
        return db
            .collection("categories")
            .count()
    }
    static insert(category_name,category_slug,image){
        const db=getDB();
        return db
            .collection("categories")
            .insertOne({category_name:category_name,category_slug:category_slug,image:image})
    }
    static delete(category_id){
        const db=getDB();
        return db
            .collection("categories")
            .deleteOne({_id:new ObjectId(category_id)})
    }
    static selectCategoryById(category_id){
        const db=getDB();
        return db
            .collection("categories")
            .find({_id:new ObjectId(category_id)})
            .next()
    }
    static update(category_id,category_name,category_slug,image){
        const db=getDB();
        if(image)
        {
            return db
            .collection("categories")
            .updateOne({_id:new ObjectId(category_id)},{$set:{category_name:category_name,category_slug:category_slug,image:image}})
        }
        return db
            .collection("categories")
            .updateOne({_id:new ObjectId(category_id)},{$set:{category_name:category_name,category_slug:category_slug}})
    }
    static checkUniqueCategorySlug(category_slug){
        const db=getDB();
        return db
            .collection("categories")
            .findOne({category_slug:category_slug})
    }
}