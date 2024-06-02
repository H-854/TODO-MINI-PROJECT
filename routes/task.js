const express = require("express");
const router = express.Router({mergeParams: true});
const { wrapAsync } = require("../wrapAsync");
const Task = require("../models/task");

router.get("/",wrapAsync(async (req,res)=>{
    await Task.find({}).then((tasks)=>{
      res.render("pages/index.ejs",{tasks})
    })
}))
  
  //add new task
router.post("/new",wrapAsync(async (req,res)=>{
    const task = new Task(req.body.task)
    await task.save().then(()=>{
      res.redirect("/tasks")
    })
    .catch((e)=>{
      console.log(e)
    })
}))
  
  //delete task
router.delete("/delete/:id",wrapAsync(async (req,res)=>{
    let { id } = req.params;
    await Task.findByIdAndDelete(id).then(()=>{
      res.redirect("/tasks")
    })
    .catch((e)=>{
      console.log(e)
    }) 
}))
  
  //edit
router.get("/edit/:id",wrapAsync(async (req,res)=>{
    let { id } = req.params;
    let task = await Task.findById(id);
    res.render("pages/edit.ejs",{ task });
}))
  
router.patch("/:id",wrapAsync(async (req,res)=>{
    let { id } = req.params;
    await Task.findByIdAndUpdate(id,{...req.body.task}).then((task)=>{
      res.redirect("/tasks");
    })
}))

module.exports = router