var cbecc = angular.module('cbecc', [
  'templates',
  'ngAnimate', 'ngResource', 'ngRoute',
  'angular-flash.service', 'angular-flash.flash-alert-directive',
  'ui.grid', 'ui.grid.autoResize', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.selection',
  'ui.router', 'ui.router.stateHelper',
  'ui.bootstrap',
  'frapontillo.bootstrap-switch']);

cbecc.config([
  '$stateProvider', '$urlRouterProvider', 'flashProvider', 'stateHelperProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, flashProvider, stateHelperProvider, $httpProvider) {
    flashProvider.errorClassnames.push("alert-danger");
    flashProvider.warnClassnames.push("alert-warning");
    flashProvider.infoClassnames.push("alert-info");
    flashProvider.successClassnames.push("alert-success");

    $urlRouterProvider.when('', '/').otherwise('404');

    $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = $("meta[name=\"csrf-token\"]").attr("content");

    stateHelperProvider
      .state({
        name: 'introduction',
        url: '/',
        templateUrl: 'introduction/introduction.html'
      })
      .state({
        name: 'project',
        url: '/project',
        controller: 'ProjectCtrl',
        templateUrl: 'project/project.html'
      })
      .state({
        name: 'projectDetails',
        url: '/project/{id:[0-9a-f]{24}}',
        controller: 'ProjectCtrl',
        templateUrl: 'project/project.html'
      })
      .state({
        name: 'building',
        url: '/building',
        controller: 'BuildingCtrl',
        templateUrl: 'building/building.html'
      })
      .state({
        name: 'constructions',
        url: '/constructions',
        controller: 'ConstructionsCtrl',
        templateUrl: 'constructions/constructions.html'
      })
      .state({
        name: 'spaces',
        url: '/spaces',
        controller: 'SpacesCtrl',
        templateUrl: 'spaces/spaces.html',
        children: [
          {
            name: 'main',
            url: '',
            templateUrl: 'spaces/main.html'
          },
          {
            name: 'settings',
            url: '/settings',
            templateUrl: 'spaces/settings.html'
          },
          {
            name: 'surfaces',
            url: '/surfaces',
            templateUrl: 'spaces/surfaces.html'
          },
          {
            name: 'subsurfaces',
            url: '/subsurfaces',
            templateUrl: 'spaces/subsurfaces.html'
          },
          {
            name: 'ventilation',
            url: '/ventilation',
            templateUrl: 'spaces/ventilation.html'
          },
          {
            name: 'loads',
            url: '/loads',
            templateUrl: 'spaces/loads.html'
          },
          {
            name: 'lighting',
            url: '/lighting',
            templateUrl: 'spaces/lighting.html'
          }
        ]
      })
      .state({
        name: 'systems',
        url: '/systems',
        controller: 'SystemsCtrl',
        templateUrl: 'systems/systems.html'
      })
      .state({
        name: 'zones',
        url: '/zones',
        controller: 'ZonesCtrl',
        templateUrl: 'zones/zones.html'
      })
      .state({
        name: 'review',
        url: '/review',
        controller: 'ReviewCtrl',
        templateUrl: 'review/review.html'
      })
      .state({
        name: 'compliance',
        url: '/compliance',
        controller: 'ComplianceCtrl',
        templateUrl: 'compliance/compliance.html'
      })
      .state({
        name: '404',
        url: '/404',
        templateUrl: '404/404.html'
      });
  }
]);
