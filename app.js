const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Mongoose connection
mongoose.connect('mongodb://localhost/todo');

//Mongoose schema
var todoSchema = new mongoose.Schema({
    name: String
});

var Todo = mongoose.model("Todo", todoSchema);


const app = express();
app.use(bodyParser.urlencoded({ extended : true}));

//Todo array
// var todolist = [
//     "Finish the todo app",
//     "Go to Gym"
// ];

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

//Main route
app.get('/', (req, res) => {
    Todo.find({}, (err, todolist) => {
        if(err)
            console.log(err);
        else
        res.render('index.ejs',{ todolist : todolist});
    });
});


//New entry route
app.post('/newtodo', (req, res) => {
    var data = new Todo({
        name: req.body.value
    });
    Todo.create(data, (err, Todo) => {
        if(err)
            console.log(err);
    });
    res.redirect('/');
});

app.listen('3000', () => {
    console.log('Listening on port 3000');
});