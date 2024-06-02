const express = require("express");
const app = express()
const path = require("path");
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");

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

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"))


app.listen(3000,()=>{
    console.log("Server is listening to port ", 3000);
})