const express = require("express");
const app = express()
const path = require("path");
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const taskRouter = require("./routes/task");
const methodOverride = require('method-override');
const { assert } = require("console");
const ExpressError = require("./ExpressError");

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


app.use("/tasks",taskRouter)

app.get("*",(req,res)=>{
  throw new ExpressError(404,"PAGE NOT FOUND");
})
app.listen(3000,()=>{
    console.log("Server is listening to port ", 3000);
})

app.use((err,req,res,next)=>{
  let { status=500,message="SOME ERROR OCCURED" } = err;
  res.status(status).send(message);
})