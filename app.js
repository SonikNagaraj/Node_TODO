const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Mongoose connection
mongoose.connect('mongodb://mongo:27017/todo');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));
 
db.once('open', function() {
  console.log("Successfully connected to MongoDB!");
});

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

//Delete
app.post('/delete', (req, res) => {
    
    Todo.find({}, (err, todolist) => {
        if(err)
            console.log(err);
        else
        {
            for(let i = 0; i < todolist.length; i++){
                var value = req.body['box_' + i];
                if(value){
                    Todo.deleteOne({ name: todolist[i].name }, (err) => {
                        if (err)
                            console.log(err);
                      });
                }
            }
        }
    });
    res.redirect('/');
});


app.listen('3000', () => {
    console.log('Listening on port 3000');
});