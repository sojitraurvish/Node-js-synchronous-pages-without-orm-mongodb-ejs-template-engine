const express=require("express");
const {check,body,param,query,cookie,header}=require("express-validator");

const adminControllers=require("../controllers/admin");
const categoryControllers=require("../controllers/category");
const auth=require("../middleware/auth");



const routes=express.Router();

// GET : /admin/ -> to open login page 
routes.get("/",auth.getCsrfToken,adminControllers.login);

// POST : /admin/ -> for login authentication page 
routes.post("/auth",

    check("email")
        .isEmail()
        .withMessage("Please enter a valid email!...")
        // .isAlphanumeric()
        .custom((valueOfEmail,{req})=>{//this check function return three thing 1)true false 2)throw new Error 3)Promise
            if(valueOfEmail=="test@gmail.com")
            {
                throw new Error("This email address is forbidden...");
            }
            return true;

            // User.findOne({emial.valueOfEmail})
            // .then((rows)=>{
            //     if(userDoc){
            //         req.flash("error","E-mail already exists, Please pick a different one!...");
            //         return resizeBy.redirect("/signup");
            //     }
            // })insted of this bellow

            // return User.findOne({email:valueOfEmail})
            // .then((userDoc)=>{
            //     if(userDoc)
            //     {
            //         return Promise.reject("E-mail already exists, Please pick a different one!...");
            //     }
            // })
            // .catch()//here i can catch Premise.reject but rather than catch i simply return it
        })
        .normalizeEmail(),
    // .check()
    body("password",
                "password should be at list 5 character long and alphanumeric"//so, here you can add general message rather than writing multiple .withMessage block 
                )
                .isLength({min:5/*,max:10*/})
                //.withMessage("please enter password with at least 5 character.")
                .isAlphanumeric()
                //.withMessage("password should alphanumeric")//if don't want to add message every time when you validate to you can add general message too
            // ,
            // body("confirmPassword")
            //     .custom((confirmPassword,{req})=>{
            //         if(confirmPassword!==req.body.password)
            //         {
            //             throw new Error("password hava to match");
            //         }
            //         return true;
            //     })
            .trim()

    ,adminControllers.auth);

// GET : /admin//invoice/:id -> to download pdf
routes.get("/orders/:id",auth.admin_auth,adminControllers.getInvoice);


// GET : /admin/dashboard -> to open dashboard
routes.get("/dashboard",auth.admin_auth,adminControllers.dashboard);

// GET : /admin/category -> to open category page
routes.get("/category",auth.admin_auth,categoryControllers.category);

// GET : /admin/category/delete -> to delete particular category 
routes.get("/category/:id/delete",auth.admin_auth,categoryControllers.delete);

// GET : /admin/category/manage_category -> to open category page
routes.get("/category/manage_category",auth.admin_auth,auth.getCsrfToken,categoryControllers.open_manage_category_process);

// GET : /admin/category/manage_category -> to open category page
routes.get("/category/:id/manage_category",auth.admin_auth,auth.getCsrfToken,categoryControllers.open_manage_category_process);

// POST : /admin/category/manage_category -> to open category page
routes.post("/category/manage_category",[
    body("category_name")
    .isString().withMessage("Category name should be string!...")
    .isLength({min:1,max:15}).withMessage("Category required minimum 1 and miuximum 15 character!...")
    .trim(),
    body("category_slug").isString().withMessage("Category name should be string!...")
    .isLength({min:3,max:15}).withMessage("Category required minimum 1 and miuximum 15 character!...")
    .trim()
    // body("title").isAlphanumeric().isLength({min:3}).trim(),
    // body("imageUrl").isURL(),
    // body("price").isFloat(),
    // body("description").isLength({min:5,max:400}).trim()
],auth.admin_auth,categoryControllers.manage_category_process);

// GET : /admin/logout -> to logout form system
routes.get("/logout",auth.admin_auth,adminControllers.logout);


module.exports.routes=routes;


/*

{
    id:
    
    email:
}


"Users"
getAll
    route.get('/users',User.getAll)   ?gender=male&age=25&limit=10  // User Query for data filter.
get by id
    route.get('/users/:id',User.getAll)
insert
    route.post('/user',User.getAll)
update By Id
    route.patch('/users',User.updateMultipleUsers)   // patch //put // post {ids:['']}
    route.patch('/user/:id',User.getAll)   // patch //put // post

    route.put('/user/:id',User.insertrecordWithId) 
Delete by id
    route.delete('/user/:id',User.delete)

route.get(`user/:userId/post/:postId/likes`,getAllAddressOfUser)
route.get(`addresses/:id`,getAllAddressOfUser)

*/

// routes.get("/admin/category",adminControllers.index);//to open category page
// routes.post("/admin/category",adminControllers.insert);//to insert category 
// routes.delete("/admin/category/:id",adminControllers.delete);//to delete category 
// routes.patch("/admin/category/:status/:id",adminControllers.status);//to change status of category 

// routes.get("/admin/manage_category/:id",adminControllers.manage_category);//to open manage_category page 
// routes.patch("/admin/manage_category",adminControllers.manage_category);//to update inserted category 



    // Route::get('admin/category',[CategoryController::class,'index']);
    // Route::post('admin/category',[CategoryController::class,'insert'])->name('category.manage_category_process');
    // Route::get('admin/category/delete/{id}',[CategoryController::class,'delete']);
    // Route::get('admin/category/status/{status}/{id}',[CategoryController::class,'status']);

    // Route::get('admin/category/manage_category',[CategoryController::class,'manage_category']);
    // Route::get('admin/category/manage_category/{id}',[CategoryController::class,'manage_category']);



// <?php
// use App\Http\Controllers\Admin\AdminController;
// use App\Http\Controllers\Admin\CategoryController;
// use App\Http\Controllers\Admin\CouponController;
// use App\Http\Controllers\Admin\SizeController;
// use App\Http\Controllers\Admin\ColorController;
// use App\Http\Controllers\Admin\ProductController;
// use App\Http\Controllers\Admin\BrandController;
// use App\Http\Controllers\Admin\TaxController;
// use App\Http\Controllers\Admin\CustomerController;
// use App\Http\Controllers\Admin\HomeBannerController;
// use App\Http\Controllers\Admin\OrderController;
// use App\Http\Controllers\Admin\ProductReviewController;

// use App\Http\Controllers\Front\FrontController;
// use Illuminate\Support\Facades\Route;

// /*
// |--------------------------------------------------------------------------
// | Web Routes
// |--------------------------------------------------------------------------
// |
// | Here is where you can register web routes for your application. These
// | routes are loaded by the RouteServiceProvider within a group which
// | contains the "web" middleware group. Now create something great!
// |
// */

// Route::get('/',[FrontController::class,'index']);
// Route::get('category/{id}',[FrontController::class,'category']);
// Route::get('product/{id}',[FrontController::class,'product']);
// Route::post('add_to_cart',[FrontController::class,'add_to_cart']);
// Route::get('cart',[FrontController::class,'cart']);
// Route::get('search/{str}',[FrontController::class,'search']);
// Route::get('registration',[FrontController::class,'registration']);
// Route::post('registration_process',[FrontController::class,'registration_process'])->name('registration.registration_process');
// Route::post('login_process',[FrontController::class,'login_process'])->name('login.login_process');
// Route::get('logout', function () {
//     session()->forget('FRONT_USER_LOGIN');
//     session()->forget('FRONT_USER_ID');
//     session()->forget('FRONT_USER_NAME');
//     session()->forget('USER_TEMP_ID');
//     return redirect('/');
// });
// Route::get('/verification/{id}',[FrontController::class,'email_verification']);
// Route::post('forgot_password',[FrontController::class,'forgot_password']);
// Route::get('/forgot_password_change/{id}',[FrontController::class,'forgot_password_change']);
// Route::post('forgot_password_change_process',[FrontController::class,'forgot_password_change_process']);
// Route::get('/checkout',[FrontController::class,'checkout']);
// Route::post('apply_coupon_code',[FrontController::class,'apply_coupon_code']);
// Route::post('remove_coupon_code',[FrontController::class,'remove_coupon_code']);
// Route::post('place_order',[FrontController::class,'place_order']);
// Route::get('/order_placed',[FrontController::class,'order_placed']);
// Route::get('/order_fail',[FrontController::class,'order_fail']);
// Route::get('/instamojo_payment_redirect',[FrontController::class,'instamojo_payment_redirect']);

// Route::post('product_review_process',[FrontController::class,'product_review_process']);

// Route::group(['middleware'=>'disable_back_btn'],function(){
//     Route::group(['middleware'=>'user_auth'],function(){
//         Route::get('/order',[FrontController::class,'order']);
//         Route::get('/order_detail/{id}',[FrontController::class,'order_detail']);
//     });
// });


// Route::get('admin',[AdminController::class,'index']);
// Route::post('admin/auth',[AdminController::class,'auth'])->name('admin.auth');

// Route::group(['middleware'=>'admin_auth'],function(){
//     Route::get('admin/dashboard',[AdminController::class,'dashboard']);

//     Route::get('admin/category',[CategoryController::class,'index']);
//     Route::post('admin/category/manage_category_process',[CategoryController::class,'manage_category_process'])->name('category.manage_category_process');
//     Route::get('admin/category/delete/{id}',[CategoryController::class,'delete']);
//     Route::get('admin/category/status/{status}/{id}',[CategoryController::class,'status']);

//     Route::get('admin/category/manage_category',[CategoryController::class,'manage_category']);
//     Route::get('admin/category/manage_category/{id}',[CategoryController::class,'manage_category']);

//     Route::get('admin/coupon',[CouponController::class,'index']);
//     Route::get('admin/coupon/manage_coupon',[CouponController::class,'manage_coupon']);
//     Route::get('admin/coupon/manage_coupon/{id}',[CouponController::class,'manage_coupon']);
//     Route::post('admin/coupon/manage_coupon_process',[CouponController::class,'manage_coupon_process'])->name('coupon.manage_coupon_process');
//     Route::get('admin/coupon/delete/{id}',[CouponController::class,'delete']);
//     Route::get('admin/coupon/status/{status}/{id}',[CouponController::class,'status']);

//     Route::get('admin/size',[SizeController::class,'index']);
//     Route::get('admin/size/manage_size',[SizeController::class,'manage_size']);
//     Route::get('admin/size/manage_size/{id}',[SizeController::class,'manage_size']);
//     Route::post('admin/size/manage_size_process',[SizeController::class,'manage_size_process'])->name('size.manage_size_process');
//     Route::get('admin/cousizepon/delete/{id}',[SizeController::class,'delete']);
//     Route::get('admin/size/status/{status}/{id}',[SizeController::class,'status']);

//     Route::get('admin/color',[ColorController::class,'index']);
//     Route::get('admin/color/manage_color',[ColorController::class,'manage_color']);
//     Route::get('admin/color/manage_color/{id}',[ColorController::class,'manage_color']);
//     Route::post('admin/color/manage_color_process',[ColorController::class,'manage_color_process'])->name('color.manage_color_process');
//     Route::get('admin/color/delete/{id}',[ColorController::class,'delete']);
//     Route::get('admin/color/status/{status}/{id}',[ColorController::class,'status']);


//     Route::get('admin/product',[ProductController::class,'index']);
//     Route::get('admin/product/manage_product',[ProductController::class,'manage_product']);
//     Route::get('admin/product/manage_product/{id}',[ProductController::class,'manage_product']);
//     Route::post('admin/product/manage_producty_process',[ProductController::class,'manage_product_process'])->name('product.manage_product_process');
//     Route::get('admin/product/delete/{id}',[ProductController::class,'delete']);
//     Route::get('admin/product/status/{status}/{id}',[ProductController::class,'status']);
//     Route::get('admin/product/product_attr_delete/{paid}/{pid}',[ProductController::class,'product_attr_delete']);
//     Route::get('admin/product/product_images_delete/{paid}/{pid}',[ProductController::class,'product_images_delete']);

//     Route::get('admin/brand',[BrandController::class,'index']);
//     Route::get('admin/brand/manage_brand',[BrandController::class,'manage_brand']);
//     Route::get('admin/brand/manage_brand/{id}',[BrandController::class,'manage_brand']);
//     Route::post('admin/brand/manage_brand_process',[BrandController::class,'manage_brand_process'])->name('brand.manage_brand_process');
//     Route::get('admin/brand/delete/{id}',[BrandController::class,'delete']);
//     Route::get('admin/brand/status/{status}/{id}',[BrandController::class,'status']);

//     Route::get('admin/tax',[TaxController::class,'index']);
//     Route::get('admin/tax/manage_tax',[TaxController::class,'manage_tax']);
//     Route::get('admin/tax/manage_tax/{id}',[TaxController::class,'manage_tax']);
//     Route::post('admin/tax/manage_tax_process',[TaxController::class,'manage_tax_process'])->name('tax.manage_tax_process');
//     Route::get('admin/tax/delete/{id}',[TaxController::class,'delete']);
//     Route::get('admin/tax/status/{status}/{id}',[TaxController::class,'status']);

//     Route::get('admin/tax',[TaxController::class,'index']);
//     Route::get('admin/tax/manage_tax',[TaxController::class,'manage_tax']);
//     Route::get('admin/tax/manage_tax/{id}',[TaxController::class,'manage_tax']);
//     Route::post('admin/tax/manage_tax_process',[TaxController::class,'manage_tax_process'])->name('tax.manage_tax_process');
//     Route::get('admin/tax/delete/{id}',[TaxController::class,'delete']);
//     Route::get('admin/tax/status/{status}/{id}',[TaxController::class,'status']);

//     Route::get('admin/customer',[CustomerController::class,'index']);
//     Route::get('admin/customer/show/{id}',[CustomerController::class,'show']);
//     Route::get('admin/customer/status/{status}/{id}',[CustomerController::class,'status']);


//     Route::get('admin/home_banner',[HomeBannerController::class,'index']);
//     Route::get('admin/home_banner/manage_home_banner',[HomeBannerController::class,'manage_home_banner']);
//     Route::get('admin/home_banner/manage_home_banner/{id}',[HomeBannerController::class,'manage_home_banner']);
//     Route::post('admin/home_banner/manage_home_banner_process',[HomeBannerController::class,'manage_home_banner_process'])->name('home_banner.manage_home_banner_process');
//     Route::get('admin/home_banner/delete/{id}',[HomeBannerController::class,'delete']);
//     Route::get('admin/home_banner/status/{status}/{id}',[HomeBannerController::class,'status']);

//     Route::get('admin/order',[OrderController::class,'index']);
//     Route::get('admin/order_detail/{id}',[OrderController::class,'order_detail']);
//     Route::post('admin/order_detail/{id}',[OrderController::class,'update_track_detail']);
//     Route::get('admin/update_payemnt_status/{status}/{id}',[OrderController::class,'update_payemnt_status']);
//     Route::get('admin/update_order_status/{status}/{id}',[OrderController::class,'update_order_status']);

//     Route::get('admin/product_review',[ProductReviewController::class,'index']);
//     Route::get('admin/update_product_review_status/{status}/{id}',[ProductReviewController::class,'update_product_review_status']);

//     Route::get('admin/logout', function () {
//         session()->forget('ADMIN_LOGIN');
//         session()->forget('ADMIN_ID');
//         session()->flash('error','Logout sucessfully');
//         return redirect('admin');
//     });
// });
