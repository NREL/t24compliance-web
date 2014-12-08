var cbecc = angular.module('cbecc', ['templates', 'ngAnimate', 'ngRoute', 'ngResource', 'angular-flash.service', 'angular-flash.flash-alert-directive', 'ui.grid', 'ui.grid.selection']);

cbecc.config([
  '$routeProvider', 'flashProvider', function ($routeProvider, flashProvider) {
    flashProvider.errorClassnames.push("alert-danger");
    flashProvider.warnClassnames.push("alert-warning");
    flashProvider.infoClassnames.push("alert-info");
    flashProvider.successClassnames.push("alert-success");
    return $routeProvider.when('/', {
      templateUrl: 'introduction/introduction.html'
    }).when('/project', {
      templateUrl: 'project/project.html',
      controller: 'ProjectCtrl'
    }).when('/project/:id', {
      templateUrl: 'project/project.html',
      controller: 'ProjectCtrl'
    }).when('/building', {
      templateUrl: 'building/building.html',
      controller: 'BuildingCtrl'
    }).when('/constructions', {
      templateUrl: 'constructions/constructions.html',
      controller: 'ConstructionsCtrl'
    }).when('/spaces', {
      templateUrl: 'spaces/spaces.html',
      controller: 'SpacesCtrl'
    }).when('/systems', {
      templateUrl: 'systems/systems.html',
      controller: 'SystemsCtrl'
    }).when('/zones', {
      templateUrl: 'zones/zones.html',
      controller: 'ZonesCtrl'
    }).when('/review', {
      templateUrl: 'review/review.html',
      controller: 'ReviewCtrl'
    }).when('/compliance', {
      templateUrl: 'compliance/compliance.html',
      controller: 'ComplianceCtrl'
    }).otherwise({
      templateUrl: '404/404.html'
    });
  }
]);
