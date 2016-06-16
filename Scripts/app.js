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

   this.getAuth = function(){
       return this.isAuth;
   };
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

    $scope.logout = function(){
        $http.delete('/users/login',{headers : {Auth:authService.authToken}})
            .success(function(result){
                authService.isAuth = false;
                $scope.isAuth = false;
                authService.authToken = '';

            })
            .error(function(result,status,headers){

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
        currentTodos: [],
        errors: []
    }

    $scope.service = authService;

    $scope.$watch('service.getAuth()',function(){
            $scope.isAuth = $scope.service.getAuth();
    });   

    $scope.isAuth = $scope.service.getAuth(); 
    
      
    if(!$scope.isAuth){
        $scope.model.errors.push('Please login to access this page')
    }
    else{
        $http.get('/todos',{headers:{'Auth': authService.authToken}})
            .success(function (result,status,headers) {
                $scope.model.currentTodos = result;
            })
            .error(function (result,status) {
                $scope.model.errors.push('Unable to get todos');
            })
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
                $scope.model.currentTodos = result;
                $scope.model.description = '';
                $scope.model.submitTodo = null;
            })
            .error(function(result,status,headers){
                alert("Error: " + status + " " + result.toString());
            });
        }             
    }    
    
}]);

myApp.directive("todoResult",function(){
    return {
        templateUrl: 'directives/todoresult.html',
        replace: true,
        restrict: 'E'
    }
})

