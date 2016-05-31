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


myApp.controller('mainController',['$scope',function($scope){
    
}]);


myApp.controller('loginController',['$scope','$http',function($scope,$http){
    $scope.model = {
        email : '',
        password : '',
        authToken: '',
    };
    
    $scope.login = function(){
        $http.post('http://localhost:5000/users/login', {email: $scope.model.email,password: $scope.model.password})
        .success(function(result,status,headers){
            if(status === 200){
                alert("AUth Token: " + headers().auth);
            }else{
                alert(status + ": " + result);
            }
        })
        .error(function(data,status,headers,config){
            alert(status + ": " + data);
        });
    }
}]);


myApp.controller('todoController',['$scope',function($scope){
    
}]);

