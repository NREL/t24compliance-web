var ctrls, app;

app = angular.module('app', ['templates', 'ngRoute', 'ngResource', 'controllers', 'angular-flash.service', 'angular-flash.flash-alert-directive', 'common.errorHandling']);

app.config([
  '$routeProvider', 'flashProvider', function($routeProvider, flashProvider) {
    flashProvider.errorClassnames.push("alert-danger");
    flashProvider.warnClassnames.push("alert-warning");
    flashProvider.infoClassnames.push("alert-info");
    flashProvider.successClassnames.push("alert-success");
    return $routeProvider.when('/', {
      templateUrl: "projects/intro.html",
    }).when('/project', {
      templateUrl: "projects/form.html",
      controller: 'ProjectCtrl'
    });
  }
]);

ctrls = angular.module('controllers', []);

