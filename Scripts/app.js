var myApp = angular.module('myApp',['ngRoute']);



myApp.config(function ($routeProvider) {
    
    $routeProvider
    .when('/',{
        templateUrl: '/home.html',
        controller: 'mainController'
    })
    .when('/login',{
        templateUrl: '/login.html',
        controller: 'loginController'
    })
    .when('/todo',{
        templateUrl: 'todo.html',
        controller: 'todoController'
    });
    
});

myApp.service('authService',function(){
   
   this.authToken = '';
   this.isAuth = false;
    
});


myApp.controller('mainController',['$scope','$http','authService',function($scope,$http,authService){
    
    $scope.model = {
        email : '',
        password : '',
    };
    
    $scope.isAuth = false;
    
    $scope.login = function(){
        $http.post('http://localhost:5000/users/login', {email: $scope.model.email,password: $scope.model.password})
        .success(function(result,status,headers){
            if(status === 200){
                alert("AUth Token: " + headers().auth);
                authService.authToken = headers().auth;
                authService.isAuth = true;
                $scope.isAuth = true;
            }else if(status === 401){
                alert("Unauthorized");
            }
            else{
                alert(status + ": " + result);
            }
        })
        .error(function(data,status,headers,config){
            if(status === 401){
                alert("Unauthorized");
            }else{
                alert("Problem signing in. Please try again");
            }
            
        });
    }
    
}]);


myApp.controller('loginController',['$scope','$http','authService',function($scope,$http,authService){
    
    $scope.model = {
        email : '',
        password : '',
    };
}]);


myApp.controller('todoController',['$scope','$http','authService',function($scope,$http,authService){
    
    if(!authService.isAuth){
        alert("Not Authenticated");
    }else{
        
    }
    
    
}]);

