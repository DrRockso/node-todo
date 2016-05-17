var express = require('express');

var app = express();

const port = process.env.PORT || 5000;


app.get('/',function (req,res) {
    res.send('ToDo API Root');
});

app.listen(port,function(){
   console.log('Express listening on port: ' + port); 
});