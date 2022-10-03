
const { validationResult } = require("express-validator");
const { totalmem } = require("os");
const path=require("path");

require("dotenv").config();
const ADMIN_DIR=require("../util/path").ADMIN_DIR;
const SITE_NAME=process.env.SITE_NAME;
const Category=require("../models/category");
const fileHelper=require("../util/file");


const ITEMS_PER_PAGE=10;//for pagination 
let totalItems;
module.exports.category=(req,res,next)=>{

    const page=+req.query.page || 1;//for pagination 

    Category.countNumberOfCategory()
    .then((numProduct)=>{
        totalItems=numProduct;
        return Category.selectAllCategory(page,ITEMS_PER_PAGE)
    })
    .then((rows)=>{
        res.render(path.join(ADMIN_DIR,"category"),{
            siteName:SITE_NAME,
            pageTitle:"Category",
            rows:rows,
            message:{
                positiveMessage:req.flash("positiveMessage"),
                negativeMessage:req.flash("negativeMessage")
            },
            pagination:{
                currentPage:page,
                totalProducts:totalItems,
                hasNextPage:ITEMS_PER_PAGE*page<totalItems,
                hasPreviousPage:page>1 ,
                nextPage:page+1,
                PreviousPage:page-1,
                lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)
            }
        });
    })
    .catch((err)=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
    });
}


module.exports.delete=(req,res,next)=>{
    const category_id=req.params.id;

    Category.selectCategoryById(category_id)
            .then((rows)=>{

                if(rows)
                {
                    //to delete image file
                    console.log(rows.image);
                    fileHelper.deleteFile(rows.image);//if i want to wait for result so i have to pass callback function ad another argument
                    // fileHelper.deleteFile(rows.image,(result,error)=>{LIKE THIS});

                    Category.delete(category_id)
                    .then((rows)=>{
                        if(rows){
                            
                            req.flash("positiveMessage","Category Deleted Successfully!...");
                            return res.redirect("/admin/category");
                        }
                        else{
                            req.flash("negativeMessage","Category Not Updated Successfully!...");
                            return res.redirect("/admin/category");
                        }
                    })
                    .catch((err)=>{
                        const error=new Error(err);
                        error.httpStatusCode=500;
                        return next(error);
                    });
                }
                else
                {
                    req.flash("negativeMessage","Category Not Found!...");
                    return res.redirect("/admin/category");
                }
            })
            .catch((err)=>{
                const error=new Error(err);
                error.httpStatusCode=500;
                return next(error);
            });
}

module.exports.open_manage_category_process=(req,res,next)=>{

    const category_id=req.params.id;

    if(category_id)
    {
        Category.selectCategoryById(category_id)
        .then((rows)=>{
            return res.render(path.join(ADMIN_DIR,"manage_category"),{
                siteName:SITE_NAME,
                pageTitle:"Manage Category",
                result:{
                    category_id:rows._id,
                    category_name:rows.category_name,
                    category_slug:rows.category_slug
                },
                error:{
                    category_name:req.flash("categoryNameError"),
                    category_slug:req.flash("categorySlugError"),
                    image:req.flash("imageError")
                },
                oldInput:{
                    category_name:req.flash("categoryName"),
                    category_slug:req.flash("categorySlug"),
                }
            });
        })
        .catch((err)=>{
            const error=new Error(err);
            error.httpStatusCode=500;
            return next(error);
        });
    }
    else{

        return res.render(path.join(ADMIN_DIR,"manage_category"),{
            siteName:SITE_NAME,
            pageTitle:"Manage Category",
            result:{
                category_id:"",
                category_name:"",
                category_name:""
            },
            error:{
                category_name:req.flash("categoryNameError"),
                category_slug:req.flash("categorySlugError"),
                image:req.flash("imageError")
            },
            oldInput:{
                category_name:req.flash("categoryName"),
                category_slug:req.flash("categorySlug"),
            }
        });
    }
}

module.exports.manage_category_process=(req,res,next)=>{

    const category_name=req.body.category_name;
    const category_slug=req.body.category_slug;
    var image=req.file;
    const category_id=req.body.id;
    
    //for old input
    req.flash("categoryName",category_name);
    req.flash("categorySlug",category_slug);


    // var slugDuplicateFlag=true;
    // //to check category slug is duplicate or not 
    // Category.checkUniqueCategorySlug(category_slug)
    // .then((rows)=>{
    //     if(rows)
    //     {
    //         if(category_id)
    //         {
    //              //to check edit category is same to textbox category
    //              if(rows._id!=category_id)
    //              {
    //                 slugDuplicateFlag=false;
    //                 req.flash("categorySlugError","uCategory Slug Already Exists!...");
    //                 return res.redirect("/admin/category/"+category_id+"/manage_category");
    //              }
    //         }   
    //         else
    //         {
    //             slugDuplicateFlag=false;
    //             req.flash("categorySlugError","iCategory Slug Already Exists!...");
    //             return res.redirect("/admin/category/manage_category");
    //         }
    //     }
    // })
    // .catch((err)=>{
    //     // req.flash("negativeMessage","Category Not updated Found! Try Again!...");
    //     // res.redirect("/admin/category");
    //     const error=new Error(err);
    //     error.httpStatusCode=500;
    //     return next(error);
    // });

    // console.log(slugDuplicateFlag);
    // if(slugDuplicateFlag)
    // {
        

        
        const errors=validationResult(req);

        if(errors.errors.length>0)
        {
            for(let key in errors.errors)
            {
                if(errors.errors[key].param=="category_name"){
                    req.flash("categoryNameError",errors.errors[key].msg);
                }
                else if(errors.errors[key].param=="category_slug"){
                    req.flash("categorySlugError",errors.errors[key].msg);
                }
                
            }

            if(category_id)
            {
                return res.redirect("/admin/category/"+category_id+"/manage_category");
            }
            return res.redirect("/admin/category/manage_category");
        }
        else{

            if(!image){
                if(!category_id)
                {
                    req.flash("imageError","Attached File Is Not Image!...");
                    return res.status(422).redirect("/admin/category/manage_category");
                }
                // return res.status(422).redirect("/admin/category/"+category_id+"/manage_category");
            }
            
            if(category_id)
            {
                Category.selectCategoryById(category_id)
                .then((rows)=>{

                    if(rows)
                    {
                    Category.update(category_id,category_name,category_slug,image)
                        .then((rows)=>{
                            //to flash old input
                            req.flash("categoryName","");
                            req.flash("categorySlug","");
                            
                            if(rows)
                            {
                                req.flash("positiveMessage","Category Updated Successfully!...");
                                return res.redirect("/admin/category");

                            }
                            else
                            {
                                req.flash("negativeMessage","Category Not updated Successfully Found!...");
                                return res.redirect("/admin/category");
                            }
                        })
                        .catch((err)=>{
                            // req.flash("negativeMessage","Category Not updated Found! Try Again!...");
                            // res.redirect("/admin/category");
                            const error=new Error(err);
                            error.httpStatusCode=500;
                            return next(error);
                        });
                    }
                    else
                    {
                        req.flash("negativeMessage","Category Not Found!...");
                        return res.redirect("/admin/category");
                    }
                })
                .catch((err)=>{
                    
                    const error=new Error(err);
                    error.httpStatusCode=500;
                    return next(error);
                });
            }
            else{

                Category.insert(category_name,category_slug,image.path)
                .then((rows)=>{
        
                    //to flash old input
                    req.flash("categoryName","");
                    req.flash("categorySlug","");
        
                    if(!rows)
                    {
                        
                        req.flash("negativeMessage","Category Not Found!...");
                        return res.redirect("/admin/category");
                    }
                    req.flash("positiveMessage","Category Added Successfully!...");
                    return res.redirect("/admin/category");
                    
                })
                .catch((err)=>{
                    const error=new Error(err);
                    error.httpStatusCode=500;
                    return next(error);
                });
            }
        }
    // }
}


// //throw new Error("this is acync throw"); //this is sync code's throw so it will be able to call error heandling middleware in app.js
// Category.insert(category_name,category_slug)
// .then((result)=>{
//     // console.log(result);
//     // throw new Error("Dummy");this is test error 500 page 
//     req.flash("message","Category Added Successfully!")
//     return res.redirect("/admin/category");
// })
// .catch((err)=>{
    
//     //first solution
//     // console.log("fsfdfsdff hi");
//     // console.log(err);
//     // req.flash("message","Database operation failed, Please try again!")
//     // return res.status(5).redirect("/admin/category");
    
//     //secind solution
//     // res.redirect("/500");

//     //throw new Error("this is acync throw"); this will not work by this way try bellow syntext

//     const error=new Error(err);
//     error.httpStatusCode = 500;
//     return next(error);//this skipe all other middleware and diractly goto error heandling middleware in app.js
// });
