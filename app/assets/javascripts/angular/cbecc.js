
var cbecc = angular.module('cbecc', ['templates', 'ngAnimate', 'ngRoute', 'ngResource', 'angular-flash.service', 'angular-flash.flash-alert-directive', 'ui.grid', 'ui.grid.selection', 'ui.router', 'ui.router.stateHelper', 'mgcrea.ngStrap', 'frapontillo.bootstrap-switch']);

cbecc.config([
  '$stateProvider', '$urlRouterProvider', 'flashProvider', function ($stateProvider, $urlRouterProvider,  flashProvider) {
    flashProvider.errorClassnames.push("alert-danger");
    flashProvider.warnClassnames.push("alert-warning");
    flashProvider.infoClassnames.push("alert-info");
    flashProvider.successClassnames.push("alert-success");

    $urlRouterProvider.otherwise('/404');

    $stateProvider 
      .state('introduction', {
        url: '/',
        templateUrl: 'introduction/introduction.html'
      })
      .state('project', {
        url: '/project',
        controller: 'ProjectCtrl',
        templateUrl: 'project/project.html'
      })
      .state('project.show', {
        url: '/{id:[0-9]}',
        controller: 'ProjectCtrl',
        templateUrl: 'project/project.html' //use same template as project for now.
      })
      .state('building', {
        url: '/building',
        controller: 'BuildingCtrl',
        templateUrl: 'building/building.html'
      })
      .state('constructions', {
        url: '/constructions',
        controller: 'ConstructionsCtrl',
        templateUrl: 'constructions/constructions.html'
      })
      .state('spaces', {
        url: '/spaces',
        controller: 'SpacesCtrl',
        templateUrl: 'spaces/spaces.html'
      })
      .state('spaces.main', {
        url: '',
        templateUrl: 'spaces/main.html'
      })
      .state('spaces.settings', {
        url: '/settings',
        templateUrl: 'spaces/settings.html'
      })
      .state('spaces.surfaces', {
        url: '/surfaces',
        templateUrl: 'spaces/surfaces.html'
      })
      .state('spaces.subsurfaces', {
        url: '/subsurfaces',
        templateUrl: 'spaces/subsurfaces.html'
      })
      .state('spaces.ventilation', {
        url: '/ventilation',
        templateUrl: 'spaces/ventilation.html'
      })
      .state('spaces.loads', {
        url: '/loads',
        templateUrl: 'spaces/loads.html'
      })
      .state('spaces.lighting', {
        url: '/lighting',
        templateUrl: 'spaces/lighting.html'
      })
      .state('systems', {
        url: '/systems',
        controller: 'SystemsCtrl',
        templateUrl: 'systems/systems.html'
      })
      .state('zones', {
        url: '/zones',
        controller: 'ZonesCtrl',
        templateUrl: 'zones/zones.html'
      })
      .state('review', {
        url: '/review',
        controller: 'ReviewCtrl',
        templateUrl: 'review/review.html'
      })
      .state('compliance', {
        url: '/compliance',
        controller: 'ComplianceCtrl',
        templateUrl: 'compliance/compliance.html'
      })
      .state('404', {
        url: '/404',
        templateUrl: '404/404.html'
      })
  }
]);
