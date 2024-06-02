const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    description: {
        type: String,
        min: 5,
        max: 100
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const Task = new mongoose.model("Task",taskSchema);
module.exports = Task