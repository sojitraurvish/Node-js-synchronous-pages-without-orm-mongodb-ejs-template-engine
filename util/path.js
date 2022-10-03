const path=require("path");

module.exports.rootDir=path.dirname(process.mainModule.filename);

// module.exports.ROOT=path.join("http" +"://"+"localhost"+"/ecom/public/");
module.exports.ROOT=path.join(this.rootDir,"public");
module.exports.ASSETS=path.join(this.rootDir,"public","assets");
// module.exports.ASSETS="http" +"://"+"localhost"+"/ecom/public/";

module.exports.ADMIN_DIR=path.join("admin");
module.exports.CUSTOMER_DIR=path.join("customer");

// module.exports.pathConstructor=(req,res,next)=>{
//     // console.log(req.hostname);
    // PATH=req.protocol +"://"+ req.headers.host+"/ecom/public/";
    // console.log(PATH);
    // next();
// }