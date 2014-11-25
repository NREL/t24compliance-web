testapp = angular.module('testapp',[
  'templates',
  'ngRoute',
  'ngResource',
  'controllers',
])

testapp.config([ '$routeProvider',
  ($routeProvider)->
    $routeProvider
      .when('/',
        templateUrl: "test.html"
        controller: 'TestCtrl'
      )
])

controllers = angular.module('controllers',[])

