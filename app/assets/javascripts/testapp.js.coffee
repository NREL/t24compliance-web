testapp = angular.module('testapp',[
  'templates',
  'ngRoute',
  'ngResource',
  'controllers',
  'angular-flash.service',
  'angular-flash.flash-alert-directive',
  'common.errorHandling'
])

testapp.config([ '$routeProvider', 'flashProvider'
  ($routeProvider, flashProvider)->

    flashProvider.errorClassnames.push("alert-danger")
    flashProvider.warnClassnames.push("alert-warning")
    flashProvider.infoClassnames.push("alert-info")
    flashProvider.successClassnames.push("alert-success")

    $routeProvider
      .when('/',
        templateUrl: "tests.html"
        controller: 'TestsCtrl'
      )
      .when('/tests/new',
        templateUrl: "form.html"
        controller: 'TestCtrl'
       ).when('/tests/:testId',
         templateUrl: "show.html"
         controller: 'TestCtrl'
      ).when('/tests/:testId/edit',
        templateUrl: "form.html"
        controller: 'TestCtrl'
      )
])

controllers = angular.module('controllers',[])

