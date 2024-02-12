const express = require("express")
const bodyParser = require("body-parser")
const _ = require("lodash")
const connectDB = require("./utils/db")
const { TodoSchema, readTodos, ListSchema } = require("./utils/schema")
const app = express()


app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

const todo1 = new TodoSchema({
    _id: 1001,
    task: "Type a Todo"
})
const todo2 = new TodoSchema({
    _id: 1002,
    task: "Click + Button"
})
const todo3 = new TodoSchema({
    _id: 1003,
    task: "<---- Click here to delete todo"
})

const todoItems = [todo1, todo2, todo3]

app.get("/", function (req, res) {
    connectDB().then(async () => {
        const data = await readTodos()
        if (data.length === 0) {
            TodoSchema.insertMany(todoItems)
        }
        res.render("index", { todoTitle: "Today", todos: data })
    })
})

app.post("/", function (req, res) {
    const task = req.body.todo
    const listName = req.body.list

    if(listName === "Today") {
        connectDB().then(async () => {
            let newTodo = new TodoSchema({
                _id: Math.floor(Math.random() * 100) + 1,
                task: task
            })
            newTodo.save()
            res.redirect("/")
        }).catch(err => console.error(err))
    }else{
        connectDB().then(async ()=> {
            let newTodo = new TodoSchema({
                _id: Math.floor(Math.random() * 100) + 1,
                task: task
            })
            const lists = await ListSchema.findOne({name: listName})
            lists.lists.push(newTodo)
            lists.save()
            res.redirect("/" + listName)
        })
    }
})

app.post("/delete", (req, res)=>{
    let checkBoxId = req.body.checkBox;
    let listName = req.body.listname
    if(listName === "Today") {
        connectDB().then(async ()=>{
            const deletedTodo = await TodoSchema.findByIdAndDelete(checkBoxId);
            console.log('Todo deleted:', deletedTodo);
            res.redirect("/")
        })
    }else{
        connectDB().then(async ()=>{
            const deletedTodo = await ListSchema.findOneAndUpdate(
                {
                    name: listName
                }, 
                {
                    $pull: {
                        lists: 
                        {
                            _id: checkBoxId
                        }
                    }
                })
            console.log('Todo Deleted: ', deletedTodo)
            res.redirect("/" + listName)
        })
    }
})

app.get("/:route", function(req, res){
    let route = _.capitalize(req.params.route)
    connectDB().then(async ()=>{
        const list = await ListSchema.findOne({name: route})
        if(!list){
            const newList = new ListSchema({
                name: route,
                lists: todoItems
            })
            newList.save()
            res.redirect("/" + route)
        }else{
            res.render("index", {todoTitle: list.name, todos: list.lists})
        }
    })
})


const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
})