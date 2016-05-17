var express = require('express');

var app = express();

const port = process.env.PORT || 5000;

var todos = [{
    id: 1,
    description: 'Surf',
    completed: false
}, {
    id: 2,
    description: 'Eat dinner',
    completed: false
},{
    id:3,
    description: 'Get angry at Mark',
    completed: true 
}];


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
   
   res.json(matched);
    
});

app.get('/',function (req,res) {
    res.send('ToDo API Root');
});

app.post('/todos',function(req,res){
   res.json(req.body);
});

app.listen(port,function(){
   console.log('Express listening on port: ' + port); 
});