const mongoose = require('mongoose');
const Task = require("../models/task");
const taskData = require("./data");

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
    await Task.insertMany(taskData);
    console.log("Data added");
}

insertData();