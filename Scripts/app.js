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
        $http.post('/users/login', {email: $scope.model.email,password: $scope.model.password})
        .success(function(result,status,headers){
            if(status === 200){
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
        successSignUp :false,
        errors : []
    };
    
    $scope.signUp = function(){
        $scope.model.errors = [];
        
        $http.post('/users',{email: $scope.model.email,password: $scope.model.password})
            .success(function (result,status,headers) {
                $scope.model.successSignUp = true;
            })
            .error(function (result,status,headers) {
                $scope.model.errors.push('Error trying to create account')
            })
    }
    
}]);


myApp.controller('todoController',['$scope','$http','authService',function($scope,$http,authService){
    
    $scope.model = {
        description: "",
        submitTodo: null,
        options:[{
            name: 'Yes',
            value: true
        },{
            name: 'No',
            value: false
        }],
        errors: []
    }
    
    // $scope.isAuth = false;
    
    // $scope.$watch('isAuth',function(){
        $scope.isAuth = authService.isAuth;
    // });    
    
    if(!$scope.isAuth){
        $scope.model.errors.push('Please login to access this page')
    }
    
    
    $scope.addTodo = function(){
        if(!$scope.isAuth){
            $scope.model.errors.push('Please login to access this page')
        }
        else{
            console.log($scope.model);
            $http.post('/todos',{description: $scope.model.description, completed: $scope.model.submitTodo},
                                                                   {headers: {'Auth': authService.authToken}})
            .success(function (result,status,headers) {
                alert(result.toString()); 
            })
            .error(function(result,status,headers){
                alert("Error: " + status + " " + result.toString());
            });
        }             
    }    
    
}]);

