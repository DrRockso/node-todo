var express = require('express');
var bodyparser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
const port = process.env.PORT || 5000;

var todos = [];
var todoNextId = 1;

app.use(bodyparser.json());

app.get('/',function (req,res) {
    res.send('ToDo API Root');
});

app.get('/todos',function(req,res){
    var query = req.query;
    
    var where = {};
    
    if(query.hasOwnProperty('completed') && query.completed === 'true'){
        where.completed = true;
    }else if(query.hasOwnProperty('completed') && query.completed === 'false'){
        where.completed = false;
    }
    
    if(query.hasOwnProperty('q') && query.q.length > 0){
        where.description = {
            $like: '%' + query.q + '%'
        };
    }
    
    db.todo.findAll({where:where}).then(function(todos){
        res.json(todos);
    }).catch(function(e){
       res.status(500).send();
    });
});

app.get('/todos/completed',function(req,res){
   res.json(_.where(todos,{completed:true}));
});


app.get('/todos/:id',function(req,res){
   var todoId = parseInt(req.params.id,10);
   
   var todo = db.todo.findById(todoId).then(function(todo){
       if(todo){
           res.json(todo.toJSON());
       }else{
           res.status(404).send();
       }
   }).catch(function(e){
       res.status(500).send();
   });   
});

app.post('/todos',function(req,res){
    
    var body = _.pick(req.body,'description','completed');
    
    
    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    }).catch(function(e){
        res.status(400).send(e);
    });
});

app.delete('/todos/:id',function (req,res) {
    var todoId = parseInt(req.params.id);
           
        db.todo.destroy({
            where:{
                id:todoId
            }
        }).then(function(rowsDeleted){
            if(rowsDeleted === 0)
            {
                res.status(404).json({"error":"No todo at that id"});
            }
            else{
                res.send(204).send();
            }
        },function(e){
          res.status(500).send();  
        })
    
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

db.sequelize.sync().then(function(){
    app.listen(port,function(){
        console.log('Express listening on port: ' + port); 
    });
    
});





