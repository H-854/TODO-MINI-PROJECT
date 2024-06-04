const express = require("express");
const router = express.Router({mergeParams: true});
const { wrapAsync } = require("../wrapAsync");
const Task = require("../models/task");
const { isLoggedIn } = require("../middleware");

router.get("/",isLoggedIn,wrapAsync(async (req,res)=>{
    await Task.find({}).populate("user").then((tasks)=>{
      res.render("pages/index.ejs",{tasks})
    })
}))
  
  //add new task
router.post("/new",isLoggedIn,wrapAsync(async (req,res,next)=>{
    const task = new Task(req.body.task)
    task.user = req.user._id
    await task.save().then(()=>{
      req.flash("success","Task added");
      res.redirect("/tasks")
    })
    .catch((e)=>{
      next(e)
    })
}))
  
  //delete task
router.delete("/delete/:id",isLoggedIn,wrapAsync(async (req,res,next)=>{
    let { id } = req.params;
    await Task.findByIdAndDelete(id).then(()=>{
      req.flash("success","Task Deleted");
      res.redirect("/tasks")
    })
    .catch((e)=>{
      next(e)
    }) 
}))

module.exports = router