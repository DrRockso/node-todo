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
   var todoId = parseInt(req.params.id);
   
   var attributes = {};
   
   
   if(body.hasOwnProperty('completed'))
   {
       attributes.completed = body.completed;
   }
   
   if(body.hasOwnProperty('description'))
   {
       attributes.description = body.description
   }
   
   db.todo.findById(todoId).then(function(todo){
       if(todo){
           todo.update(attributes).then(function(todo){
                res.json(todo.toJSON());
            },function(e){
                res.status(400).json(e);
            });
       }else{
           res.status(404).json({"error":"No todo at that id"});
       }
   },function(){
       res.status(500).send();
   });
   
});

app.post('/users',function(req,res){
    
   var body = _.pick(req.body,'email','password');
   
   db.user.create(body).then(function(user){
       res.json(user.toJSON());
   },function(e){
       res.status(400).json(e);
   });    
});

db.sequelize.sync().then(function(){
    app.listen(port,function(){
        console.log('Express listening on port: ' + port); 
    });
    
});





