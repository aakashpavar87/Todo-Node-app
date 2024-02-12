const mongoose = require("mongoose")

const todoSchema = mongoose.Schema({
    _id: Number,
    task: String,
})

const readTodos = async (condition={}) => {
    try {
        return await TodoSchema.find(condition);
    } catch (error) {
        console.error('Error reading todos : ', error);
    }
}

const listSchema = mongoose.Schema({
    name: String,
    lists: [todoSchema]
})

const ListSchema = mongoose.model('List', listSchema)
let TodoSchema = mongoose.model('Todo', todoSchema)
module.exports = { TodoSchema , readTodos , ListSchema}