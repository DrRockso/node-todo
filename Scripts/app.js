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


myApp.controller('loginController',['$scope',function($scope){
    
}]);


myApp.controller('todoController',['$scope',function($scope){
    
}]);

