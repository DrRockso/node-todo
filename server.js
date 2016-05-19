var express = require('express');
var bodyparser = require('body-parser');
var _ = require('underscore');

var app = express();
const port = process.env.PORT || 5000;

var todos = [];
var todoNextId = 1;

app.use(bodyparser.json());

app.get('/',function (req,res) {
    res.send('ToDo API Root');
});

app.get('/todos',function(req,res){
    res.json(todos);
});

app.get('/todos/:id',function(req,res){
    
   var matched = _.findWhere(todos,{id: parseInt(req.params.id)});
   
//    todos.forEach(function(todo){
//       if(todo.id.toString() === req.params.id)
//       {
//           matched = todo;
//       } 
//    });

   
   if(typeof matched === 'undefined')
   {
       res.status(404).send();
   }else{
    res.json(matched);
   }    
});

app.post('/todos',function(req,res){
    
    var body = _.pick(req.body,'description','completed');
    
    body.description = body.description.trim();
    
    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.length === 0)
    {
        return res.status(400).send();
    }
    
    body.id = todoNextId;
    
    todos.push(body);
    
    todoNextId++;
    
    res.json(todos);
});

app.listen(port,function(){
   console.log('Express listening on port: ' + port); 
});



