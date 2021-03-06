var express = require('express');
var bodyparser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');
var middleware = require('./middleware.js')(db);


var app = express();
const port = process.env.PORT || 5000;

var todos = [];
var todoNextId = 1;

app.use(bodyparser.json());

app.use(express.static(__dirname + '/Views'));
app.use(express.static(__dirname + '/Scripts'));
app.use(express.static(__dirname + '/Style'));

app.get('/',function (req,res) {
    res.sendFile('index.html');
});

app.get('/todos',middleware.requireAuth,function(req,res){
    var query = req.query;
    
    var where = {
        userId: req.user.get('id')
    };
    
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

app.get('/todos/:id',middleware.requireAuth,function(req,res){
   var todoId = parseInt(req.params.id,10);
   
   var where = {
       userId : req.user.get('id'),
       id: todoId
   }
   
   var todo = db.todo.findOne({where:where}).then(function(todo){
       if(todo){
           res.json(todo.toJSON());
       }else{
           res.status(404).send();
       }
   }).catch(function(e){
       res.status(500).send();
   });   
});

app.post('/todos',middleware.requireAuth,function(req,res){
    
    var body = _.pick(req.body,'description','completed');
    
    db.todo.create(body).then(function(todo){
        req.user.addTodo(todo).then(function () {
            return todo.reload();
        }).then(function () {
            
            var where = {
                userId : req.user.get('id')
            };
            
            db.todo.findAll({where:where}).then(function (todos) {
                res.json(todos);
            });            
        })
        
    }).catch(function(e){
        res.status(400).send(e);
    });
});

app.delete('/todos/:id',middleware.requireAuth,function (req,res) {
    var todoId = parseInt(req.params.id);
           
        db.todo.destroy({
            where:{
                id:todoId,
                userId: req.user.get('id')
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

app.put('/todos/:id',middleware.requireAuth,function (req,res){
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
   
   var where = {
       id: todoId,
       userId: req.user.get('id')
   }
   
   db.todo.findOne({where:where}).then(function(todo){
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
   console.log(body);
   db.user.create(body).then(function(user){
       res.json(user.toPublicJSON());
   },function(e){
       console.log(e);
       res.status(400).json(e);
   });    
});

app.post('/users/login',function(req,res){
    var body = _.pick(req.body,'email','password');

    var userInstance;
    
    db.user.authenticate(body).then(function(user){
        var token = user.generateToken('authentication');
        userInstance = user;

        return db.token.create({
            token: token
        });
    }).then(function(tokenInstance){
        res.header('Auth',tokenInstance.get('token')).json(userInstance.toPublicJSON());
    }).catch(function () {
        res.status(401).send();
    }); 
});

app.delete('/users/login',middleware.requireAuth,function(req,res){
    req.token.destroy().then(function(){
        res.status(204).send();
    }).catch(function(){
        res.status(500).send();
    })
});

db.sequelize.sync({force:true}).then(function(){
    app.listen(port,function(){
        console.log('Express listening on port: ' + port); 
    });
    
});





