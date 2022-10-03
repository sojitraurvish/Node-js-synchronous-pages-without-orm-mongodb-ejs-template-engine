const express=require("express");
const bodyParser=require("body-parser");//for extracting data of form
const session=require("express-session");//for session
const flash=require("connect-flash");//for flash variable or one time variable
const MongoDBStore=require("connect-mongodb-session")(session);//to store session data into database
const csrf=require("csurf");//for form csrf token
const multer=require("multer");//to extracting image data from form

const path=require("path");
require("dotenv").config();//config({path:path/filename})//to import .env file
//process.env.variable_name

const adminRoutes=require("./routes/admin");
const error=require("./controllers/error");
const { Collection } = require("mongodb");
const { rootDir } = require("./util/path");
const  ASSETS  = require("./util/path").ASSETS;
const mongoConnect=require("./util/database").mongoConnect;

const app=express();

const DB_DATABASE=process.env.DB_DATABASE;
const DB_USERNAME=process.env.DB_USERNAME;
const DB_PASSWORD=process.env.DB_PASSWORD;

const store=new MongoDBStore({//to store session data into database
    uri:"mongodb+srv://"+DB_USERNAME+":"+DB_PASSWORD+"@ecom.mehbxhu.mongodb.net/"+DB_DATABASE+"?retryWrites=true&w=majority",
    collection:"session"
});

app.use(session({//for session
    secret:'my secret',
    resave:false,
    saveUninitialized:false,
    store:store//to store data into session
//     ,cookie  : {
//     httpOnly: true,
//     //secure: true,
//     maxAge  : 60 * 60 * 1000 
// }
}));

app.use(flash());//for flash variable or one time variable

app.set("view engine","ejs");//for template engine
app.set("views","views");//for where our views is located

app.use(bodyParser.urlencoded({extended:false}));//for extracting data of form

//app.use(multer({dest:"images"}).single("image"));//for image singe function is used to work with only single file and init we have to file name of control which we have given to our image control in form
//{dest:"images"}//without this option multer store bainury of file in buffer with this option rather than storing file into buffer it store inside images folder 
//{dest:"images"}and here images is folder at where we want to store file 
//instead of above we can use disk engine

const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images");//why null? to tal that there is no any error so store it
    },
    filename:(req,file,cb)=>{
        var timestamp = new Date().toISOString().replace(/[-:.]/g,"");  
        cb(null,timestamp+"_"+file.originalname);
    }
});

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==="image/png" || file.mimetype==="image/jpg" || file.mimetype==="image/jpeg")
    {
        cb(null,true);//here null for not error and true for accept this file
    }
    else
    {
        cb(null,false);//here null for not error and false for don't accept this file
    }
}

app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single("image")); 

app.use(express.static(path.join(ASSETS)));//for css path request
// app.use("/css",express.static(path.join(rootDir,"public"))); to serve particular request

//here we should use /images otherwise css file request also reaches this middleware 
app.use("/images",express.static(path.join(rootDir,"images")));//for css path request

// url -> /images/image1.jpg
//->/images if this kind of request is there so serve this file /image1.jpg
//here /images is represent you are inside /images folder

app.use(csrf());//for form csrf token

app.use((req,res,next)=>{//this function serve csrf token on every page res.locals is available on every page 
    // res.locals.csrfToken=req.csrfToken();
    // console.log("*__________*_*__________*");
    // console.log(res.locals.csrfToken);
    console.log(req.method+" : "+req.headers.host+req.url);
    // console.log("req.headers: "+req.headers.host);
    // console.log("*__________*[End]*__________*");
    res.locals.ADMIN_LOGIN=req.session.ADMIN_LOGIN;
    next();
});//for form csrf token

app.use("/admin",adminRoutes.routes);

// app.get("/500",error.get500);
app.use("/",error.get404);

app.use((error,req,res,next)=>{//this is error heandling middleware login at file controller/category.js manage_category_process
    // res.status(error.httpStatusCode).render(...);
    //res.redirect("/500");//500 for heandling database,technical,throw error
    res.status(500).render("500",{error:error});
});//to handle exception

// // error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get("env") === "development" ? err : {};
  
//     // render the error page
//     res.status(err.status || 500);
//     res.render("error");
//   });

const DB_HOST=process.env.DB_HOST || 3000;
const DB_PORT=process.env.DB_PORT || 3000;

mongoConnect(()=>{
    app.listen(DB_PORT,DB_HOST,()=>{
        console.log("Server is created at port 3000...");
    });
});