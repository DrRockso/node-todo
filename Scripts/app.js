var myApp = angular.module('myApp',['ngRoute','ngCookies']);

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

myApp.service('authService',function($cookies){

   this.authToken = $cookies.get('authToken');
   this.isAuth = false;
   if($cookies.get('isAuth') === "true"){
       this.isAuth = true;
    }
   this.email = $cookies.get('email');
   this.getAuth = function(){
       return this.isAuth;
   };
});

myApp.controller('mainController',['$scope','$http','$cookies','authService',function($scope,$http,$cookies,authService){
    
    $scope.model = {
        email : authService.email,
        password : '',
    };
    
    $scope.service = authService;

    $scope.$watch('service.getAuth()',function(){
            $scope.isAuth = $scope.service.getAuth();
    });   

    $scope.isAuth = $scope.service.getAuth(); 

    $scope.login = function(){
        $http.post('/users/login', {email: $scope.model.email,password: $scope.model.password})
        .success(function(result,status,headers){
            if(status === 200){
                $cookies.put('authToken',headers().auth);
                $cookies.put('isAuth',true);
                $cookies.put('email',$scope.model.email);
                authService.authToken = headers().auth;
                authService.isAuth = true;
                $scope.isAuth = true;
            }else if(status === 401){
                alert("Unauthorized");
                $cookies.put('authToken','');
                $cookies.put('isAuth',false);
                $cookies.put('email','');
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
                $cookies.put('authToken','');
                $cookies.put('isAuth',false);
                $cookies.put('email','');
                authService.isAuth = false;
                $scope.isAuth = false;
                authService.authToken = '';

            })
            .error(function(result,status,headers){
                $cookies.put('authToken','');
                $cookies.put('isAuth',false);
                $cookies.put('email','');
            });
    }
    
}]);


myApp.controller('loginController',['$scope','$http',function($scope,$http){
    
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


myApp.controller('todoController',['$scope','$http','$routeParams','authService',function($scope,$http,$routeParams,authService){
    
    $scope.model = {
        description: "",
        submitTodo: false,
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

    $scope.updateTodo = function(todo){
        var submit = todo
        if(todo.completed == true){
            submit.completed = false;
        }
        else{
            submit.completed = true;
        }

        $http.put('/todos/' + todo.id,{completed: submit.completed},{headers: {'Auth' : authService.authToken}})
        .success(function(result,status,headers){
            todo = result;
        })
        .error(function(result,status,headers){
            alert("Update not successful")
        })
    }    
    
}]);

myApp.directive("todoResult",function(){
    return {
        templateUrl: 'directives/todoresult.html',
        replace: true,
        restrict: 'E'
    }
})

