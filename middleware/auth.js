module.exports.admin_auth=(req,res,next)=>{
    if(req.session.ADMIN_LOGIN)
    {
        return next();
    }
    return res.redirect("/admin/");
}
module.exports.getCsrfToken=(req,res,next)=>{
    res.locals.csrfToken=req.csrfToken();
    if(res.locals.csrfToken){
        console.log("CSRF TOKEN NO : "+res.locals.csrfToken)
        return next();
    }
    this.getCsrfToken();
}