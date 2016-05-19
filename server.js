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
    var qParam = req.query;
    
    if(qParam.hasOwnProperty('completed') && qParam.completed === 'true')
    {
        return res.json(_.where(todos,{completed:true}));
    }
    else if(qParam.hasOwnProperty('completed') && qParam.completed === 'false') 
    {    
        return res.json(_.where(todos,{completed:false}));
    }
    
    res.json(todos);
});

app.get('/todos/completed',function(req,res){
   res.json(_.where(todos,{completed:true}));
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

app.delete('/todos/:id',function (req,res) {
    var matched;
    
    try
    {
        matched = _.findWhere(todos,{id: parseInt(req.params.id)});
        
        if(!matched)
        {
            res.status(404).json({"error":"No todo at that id"});
        }
        
        todos = _.without(todos,matched);
    }
    catch(e)
    {
        res.status(400).send();   
    }
    
    res.status(200);
    res.json(matched);
});

app.put('/todos/:id',function (req,res){
   var body = _.pick(req.body,'description','completed');
   
   body.description = body.description.trim();
   
   var valid = {};
   
   var matched = _.findWhere(todos,{id: parseInt(req.params.id)});
   
   if(!matched)
   {
       return res.status(404).json({"error":"No todo at that id"});
   }
   
   if(body.hasOwnProperty('completed') && _.isBoolean(body.completed))
   {
       valid.completed = body.completed;
   }
   else if(body.hasOwnProperty('completed'))
   {
       return res.status(400).json({"error":"Completed must be boolean"});
   }
   
   
   if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.length > 0)
   {
       valid.description = body.description
   }
   else if(body.hasOwnProperty('description'))
   {
       return res.status(400).json({"error":"Description must be string"});
   }
   
   
   _.extend(matched,valid);   
   
   res.status(200).send(matched);
   
});

app.listen(port,function(){
   console.log('Express listening on port: ' + port); 
});



