const express = require("express");
const app = express()
const path = require("path");
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const Task = require("./models/task");
const methodOverride = require('method-override');
const { assert } = require("console");

main()
.then(()=>{
    console.log("connection established");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userLogin');
}
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"))

//index.route
app.get("/tasks",async (req,res)=>{
  await Task.find({}).then((tasks)=>{
    res.render("pages/index.ejs",{tasks})
  })
})

//add new task
app.post("/tasks/new",async (req,res)=>{
  const task = new Task(req.body.task)
  await task.save().then(()=>{
    res.redirect("/tasks")
  })
  .catch((e)=>{
    console.log(e)
  })
})

//delete task
app.delete("/tasks/delete/:id",async (req,res)=>{
  let { id } = req.params;
  await Task.findByIdAndDelete(id).then(()=>{
    res.redirect("/tasks")
  })
  .catch((e)=>{
    console.log(e)
  }) 
})

//edit
app.get("/tasks/edit/:id",async (req,res)=>{
  let { id } = req.params;
  let task = await Task.findById(id);
  res.render("pages/edit.ejs",{ task });
})

app.patch("/tasks/:id",async (req,res)=>{
  let { id } = req.params;
  await Task.findByIdAndUpdate(id,{...req.body.task}).then((task)=>{
    res.redirect("/tasks");
  })
})

app.listen(3000,()=>{
    console.log("Server is listening to port ", 3000);
})