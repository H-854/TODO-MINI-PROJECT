module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("failure","Please login in");
        return res.redirect("/login")
    }
    next();
}