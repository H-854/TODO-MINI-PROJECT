const mongoose = require('mongoose');
const Task = require("../models/task");
let taskData = require("./data");

main()
.then(()=>{
    console.log("connection established");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userLogin');
}

const insertData = async ()=>{
    await Task.deleteMany();
    taskData = taskData.map((el)=>({...el,user: '665d95b32f69144060f71329'}))
    await Task.insertMany(taskData);
    console.log("Data added");
}

insertData();