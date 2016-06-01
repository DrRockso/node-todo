module.exports = function(db){
    return {
        requireAuth: function(req,res,next){
            var token = req.get('Auth');
            console.log('Token: ' + token);
            db.user.findByToken(token).then(function(user){
                req.user = user;
                next();
            },function(e){
               console.log(e);
               res.status(401).send(); 
            });
        }
    };
}