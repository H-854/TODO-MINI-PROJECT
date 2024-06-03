const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/user")
const { wrapAsync } = require("../wrapAsync");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        let {username,password,email} = req.body;
        let newUser = new User({
            username,email
        })
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","You have been successfully registered");
            res.redirect("/tasks");
        })
    }
    catch(e){
        req.flash("failure",e.message);
        res.redirect("/signup");
    }
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})
router.post("/login",passport.authenticate('local',{failureRedirect: "/login",failureFlash: { type: 'failure', message: "Seems like You don't have an account" }}),wrapAsync(async (req,res)=>{
    req.flash("success","You are logged in successfully");
    res.redirect("/tasks");
}))

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are successfully logged out");
        res.render("users/logout.ejs");
    });
});

module.exports = router;