var express = require('express');
var bodyparser = require('body-parser');

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
   var matched;
   
   todos.forEach(function(todo){
      if(todo.id.toString() === req.params.id)
      {
          matched = todo;
      } 
   });
   
   if(typeof matched === 'undefined')
   {
       res.status(404).send();
   }else{
    res.json(matched);
   }    
});

app.post('/todos',function(req,res){
    var body = req.body;
    
    body.id = todoNextId;
    
    todos.push(body);
    
    todoNextId++;
    
    res.json(todos);
});

app.listen(port,function(){
   console.log('Express listening on port: ' + port); 
});



