const fs=require("fs");//this package is used to work with files like read,write

const PDFDocument=require("pdfkit");//this package is used generate pdf 
const path=require("path");
const bcrypt=require("bcryptjs");
const {validationResult}=require("express-validator/check");

require("dotenv").config();

const ADMIN_DIR=require("../util/path").ADMIN_DIR;
const Admin=require("../models/admin");
const { OrderedBulkOperation } = require("mongodb");


const SITE_NAME=process.env.SITE_NAME;

module.exports.getInvoice=(req,res,next)=>{
   const id=req.params.id;

    const invoiceName='invoice_'+id+".pdf";
    const invoicePath=path.join("data","invoices",invoiceName);
    const PDFDoc=new PDFDocument();
    res.setHeader("Content-Type","application/pdf");
    res.setHeader('Content-Disposition','inline;filename="'+invoiceName+'"');

    PDFDoc.pipe(fs.createWriteStream(invoicePath));
    PDFDoc.pipe(res);

    PDFDoc.fontSize(26).text("Invoice",{underline:true});
    PDFDoc.text("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
    PDFDoc.text("here add all data using loop");

    PDFDoc.end();
    // //strumming the file => this method is for specially use for bigger file
    // const file=fs.createReadStream(invoicePath);
    // res.setHeader("Content-Type","application/pdf");
    // res.setHeader('Content-Disposition','inline;filename="'+invoiceName+'"');
    // // res.setHeader('Content-Disposition','attachment;filename="'+invoiceName+'"');
    // file.pipe(res);

};

//this middle ware only read file
// module.exports.getInvoice=(req,res,next)=>{
//    const id=req.params.id;
// //    Order.findById(id).then((oreder)=>{//if order is found then allow to download pdf
// //     if(!order)
// //     {
// //         return next(new Error("no Order Found"));
// //     }
//         // if(order)
//         // {
//         //     //all access acccess code
//         // }
// //    }).catch((err)=>{return next(err);});
//    const invoiceName='invoice_'+id+".pdf";
//    const invoicePath=path.join("data","invoices",invoiceName);
// //by this way bellow here node will read entire file and once that read then it send hole content together. so it is okay with tiny file but if file size is too long so at that time we have to strumming the file 
// //    fs.readFile(invoicePath,(err,data)=>{
// //     if(err)
// //     {
// //         return next(err);
// //     }
// //     res.setHeader("Content-Type","application/pdf");
// //     // res.setHeader('Content-Disposition','inline;filename="'+invoiceName+'"');
// //     res.setHeader('Content-Disposition','attachment;filename="'+invoiceName+'"');
// //     res.send(data);
// //    });

//     //strumming the file => this method is for specially use for bigger file
//     const file=fs.createReadStream(invoicePath);
//     res.setHeader("Content-Type","application/pdf");
//     res.setHeader('Content-Disposition','inline;filename="'+invoiceName+'"');
//     // res.setHeader('Content-Disposition','attachment;filename="'+invoiceName+'"');
//     file.pipe(res);

// };

module.exports.login=(req,res,next)=>{
    if(req.session.ADMIN_LOGIN)
    {
       return res.redirect("/admin/dashboard");
    }
    res.render(
        path.join(ADMIN_DIR,"login"),{
        
            siteName:SITE_NAME,
            pageTitle:"Login",
            error:{
                email:req.flash("emailError"),
                password:req.flash("passwordError")
            },
            oldInput:{
                email:req.flash("email"),
                password:req.flash("password")
            }
            
        });
};

module.exports.auth=(req,res,next)=>{
    
    const email=req.body.email;
    const password=req.body.password;

    //old input
    req.flash("email",req.body.email);
    req.flash("password",req.body.password);
    
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        for(let key in errors.errors)
        {
            if(errors.errors[key].param==="email")
            {
                req.flash("emailError",errors.errors[key].msg);
            }
            else if(errors.errors[key].param==="password")
            {
                req.flash("passwordError",errors.errors[key].msg);
            }
        }
        //422 -> status code for validation fail
        return res.status(422).redirect("/admin/");
    }
    else
    {

        Admin.login(email)
        .then((rows)=>{
            if(!rows)
            {
                req.flash("emailError","Invalid UserId!...");
                return res.redirect("/admin/");
            }
            //bcrypt.hash("urvish",12)
            bcrypt.compare(password,rows.password)
            .then((doMatch)=>{
                if(!doMatch)
                {
                    console.log("hello");
                    req.flash("passwordError","Invalid Password!...");
                    return res.redirect("/admin/");
                }
                
                req.session.ADMIN_LOGIN=true;
                req.session.ADMIN_ID=rows._id;
                 
                //old input flash
                req.flash("email","");
                req.flash("password","");
    
                return res.redirect("/admin/dashboard");
            })  
            .catch((err)=>{
                const error=new Error(err);
                error.httpStatusCode=500;
                return next(error);
            });
            // res.redirect("/admin/dashboard");
            
        })
        .catch((err)=>{
            const error=new Error(err);
            error.httpStatusCode=500;
            return next(error);
        });
    }
};

module.exports.dashboard=(req,res,next)=>{
    res.render(
        path.join(ADMIN_DIR,"dashboard"),{

            siteName:SITE_NAME,
            pageTitle:"Dashboard"
            
        });
};
module.exports.logout=(req,res,next)=>{
    req.session.destroy((err)=>{
        console.log(err);
        return res.redirect("/admin/");
    });

    // delete req.session.ADMIN_LOGIN;
    // delete req.session.ADMIN_ID;

    // return res.redirect("/admin/");
};