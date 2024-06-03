module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.flash("failure","Please login in");
        return res.redirect("/login")
    }
    next();
}