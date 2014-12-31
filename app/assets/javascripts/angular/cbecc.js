var cbecc = angular.module('cbecc', [
  'templates',
  'ngAnimate', 'ngResource', 'ngRoute',
  'toaster',
  'ui.grid', 'ui.grid.autoResize', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.selection',
  'ui.router', 'ui.router.stateHelper',
  'ui.bootstrap',
  'frapontillo.bootstrap-switch',
  'angularSpinner']);

cbecc.config([
  '$stateProvider', '$urlRouterProvider', 'stateHelperProvider', '$httpProvider', 'usSpinnerConfigProvider', 'dataProvider', function ($stateProvider, $urlRouterProvider, stateHelperProvider, $httpProvider, usSpinnerConfigProvider, dataProvider) {

    usSpinnerConfigProvider.setDefaults({
      lines: 13,
      length: 0,
      width: 22,
      radius: 60,
      speed: 2.2,
      trail: 60,
      shadow: false
    });

    var getConstructions = ['$q', '$stateParams', 'data', 'Shared', function ($q, $stateParams, data, Shared) {
      var mainPromise = function () {
        var exteriorWallData = Shared.loadFromCache('exterior_walls');
        if (exteriorWallData !== null) {
          return $q.when(exteriorWallData);
        }
        // Not in cache yet
        return data.list('constructions');
      };
      return mainPromise();
    }];

    var getFenestrations = ['$q', '$stateParams', 'data', 'Shared', function ($q, $stateParams, data, Shared) {
      var mainPromise = function () {
        var fenestrationData = Shared.loadFromCache('fenestration');
        if (fenestrationData !== null) {
          return $q.when(fenestrationData);
        }
        // Not in cache yet
        return data.list('fenestrations');
      };
      return mainPromise();
    }];

    $urlRouterProvider.when('', '/').otherwise('404');

    $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = $("meta[name=\"csrf-token\"]").attr("content");

    stateHelperProvider
      //states that require building should have requirebuilding as parent.
      .state({
        abstract: true,
        name: 'requirebuilding',
        template: '<ui-view>',
        resolve: {
          lookupbuilding: ['$q', 'Shared', 'data', function ($q, Shared, data) {
            var require = true;
            return Shared.lookupBuilding($q, data, require);
          }]
        }
      })
      // states that have lookupbuilding as parent will throw error if there is no project id
      // and will try to set building id but not error out if it is unavailable.
      .state({
        abstract: true,
        name: 'lookupbuilding',
        template: '<ui-view>',
        resolve: {
          lookupbuilding: ['$q', 'Shared', 'data', function ($q, Shared, data) {
            console.log("starting building look up");
            var require = false;
            return Shared.lookupBuilding($q, data, require);
            // Unreachable
            //console.log("finish building lookup");
          }]
        }
      })
      .state({
        name: 'introduction',
        url: '/',
        templateUrl: 'introduction/introduction.html'
      })
      .state({
        name: 'project',
        url: '/projects',
        controller: 'ProjectCtrl',
        templateUrl: 'project/project.html'
      })
      .state({
        name: 'projectDetails',
        url: '/projects/{project_id:[0-9a-f]{24}}',
        controller: 'ProjectCtrl',
        templateUrl: 'project/project.html',
        parent: 'lookupbuilding'
      })
      .state({
        name: 'building',
        url: '/projects/{project_id:[0-9a-f]{24}}/buildings',
        controller: 'BuildingCtrl',
        templateUrl: 'building/building.html',
        resolve: {
          stories: ['$q', 'Shared', 'data', 'lookupbuilding', function ($q, Shared, data, lookupbuilding) {
            //does this set stories correctly for new building?
            return data.list('building_stories', Shared.defaultParams());
          }]
        },
        parent: "lookupbuilding"
      })
      .state({ //shouldn't be clickable without projectid
        name: 'buildingPlaceholder',
        url: '/buildings',
        controller: 'BuildingCtrl',
        templateUrl: 'building/building.html',
        resolve: {
          stories: ['$q', 'Shared', 'data', 'lookupbuilding', function ($q, Shared, data, lookupbuilding) {
            console.log("in child");
            return data.list('building_stories', Shared.defaultParams());
          }]
        },
        parent: "lookupbuilding"
      })
      .state({
        name: 'buildingDetails',
        url: '/projects/{project_id:[0-9a-f]{24}}/buildings/{building_id:[0-9a-f]{24}}',
        controller: 'BuildingCtrl',
        templateUrl: 'building/building.html',
        resolve: {
          stories: ['$q', 'Shared', 'data', 'lookupbuilding', function ($q, Shared, data, lookupbuilding) {
            return data.list('building_stories', Shared.defaultParams());
          }]
        },
        parent: "requirebuilding"
      })
      .state({
        name: 'constructions',
        url: '/projects/{project_id:[0-9a-f]{24}}/buildings/{building_id:[0-9a-f]{24}}/constructions',
        controller: 'ConstructionsCtrl',
        templateUrl: 'constructions/constructions.html',
        resolve: {
          constData: getConstructions,
          fenData: getFenestrations,
          defaults: ['$q', 'data', 'Shared', 'lookupbuilding', function ($q, data, Shared, lookupbuilding) {
            return data.list('construction_defaults', Shared.defaultParams());
          }]
        },
        parent: 'requirebuilding'
      })
      .state({
        name: 'constructions_placeholder',
        url: '/constructions',
        controller: 'ConstructionsCtrl',
        templateUrl: 'constructions/constructions.html',
        parent: 'requirebuilding'
      })
      .state({
        name: 'spaces',
        url: '/projects/{project_id:[0-9a-f]{24}}/buildings/{building_id:[0-9a-f]{24}}/spaces',
        controller: 'SpacesCtrl',
        templateUrl: 'spaces/spaces.html',
        resolve: {
          stories: ['$q', 'data', 'Shared', 'lookupbuilding', function ($q, data, Shared, lookupbuilding) {
            return data.list('building_stories', Shared.defaultParams());
          }],
          spaces: ['$q', 'data', 'Shared', 'lookupbuilding', function ($q, data, Shared, lookupbuilding) {
            return data.list('spaces', Shared.defaultParams());
          }]
        },
        parent: 'requirebuilding',
        children: [{
          name: 'main',
          url: '',
          templateUrl: 'spaces/main.html'
        }, {
          name: 'settings',
          url: '/settings',
          templateUrl: 'spaces/settings.html'
        }, {
          name: 'surfaces',
          url: '/surfaces',
          templateUrl: 'spaces/surfaces.html'
        }, {
          name: 'subsurfaces',
          url: '/subsurfaces',
          templateUrl: 'spaces/subsurfaces.html'
        }, {
          name: 'ventilation',
          url: '/ventilation',
          templateUrl: 'spaces/ventilation.html'
        }, {
          name: 'loads',
          url: '/loads',
          templateUrl: 'spaces/loads.html'
        }, {
          name: 'lighting',
          url: '/lighting',
          templateUrl: 'spaces/lighting.html'
        }]
      })
      .state({
        name: 'spaces_placeholder',
        url: '/spaces',
        controller: 'SpacesCtrl',
        templateUrl: 'spaces/spaces.html',
        parent: 'requirebuilding'
      })
      .state({
        name: 'systems',
        url: '/projects/{project_id:[0-9a-f]{24}}/buildings/{building_id:[0-9a-f]{24}}/systems',
        controller: 'SystemsCtrl',
        templateUrl: 'systems/systems.html',
        parent: 'requirebuilding'
      })
      .state({
        name: 'systems_placeholder',
        url: '/systems',
        controller: 'SystemsCtrl',
        templateUrl: 'systems/systems.html',
        parent: 'requirebuilding'
      })
      .state({
        name: 'zones',
        url: '/projects/{project_id:[0-9a-f]{24}}/buildings/{building_id:[0-9a-f]{24}}/zones',
        controller: 'ZonesCtrl',
        templateUrl: 'zones/zones.html',
        parent: 'requirebuilding',
        children: [{
          name: 'main',
          url: '',
          templateUrl: 'zones/main.html'
        }, {
          name: 'spaces',
          url: '/spaces',
          templateUrl: 'zones/spaces.html'
        }, {
          name: 'systems',
          url: '/systems',
          templateUrl: 'zones/systems.html'
        }, {
          name: 'terminals',
          url: '/terminals',
          templateUrl: 'zones/terminals.html'
        }]
      })
      .state({
        name: 'zones_placeholder',
        url: '/zones',
        controller: 'ZonesCtrl',
        templateUrl: 'zones/zones.html',
        parent: 'requirebuilding'
      })
      .state({
        name: 'review',
        url: '/projects/{project_id:[0-9a-f]{24}}/buildings/{building_id:[0-9a-f]{24}}/review',
        controller: 'ReviewCtrl',
        templateUrl: 'review/review.html',
        parent: 'requirebuilding'
      })
      .state({
        name: 'review_placeholder',
        url: '/review',
        controller: 'ReviewCtrl',
        templateUrl: 'review/review.html',
        parent: 'requirebuilding'
      })
      .state({
        name: 'compliance',
        url: '/projects/{project_id:[0-9a-f]{24}}/buildings/{building_id:[0-9a-f]{24}}/compliance',
        controller: 'ComplianceCtrl',
        templateUrl: 'compliance/compliance.html',
        parent: 'requirebuilding'
      })
      .state({
        name: 'compliance_placeholder',
        url: '/compliance',
        controller: 'ComplianceCtrl',
        templateUrl: 'compliance/compliance.html',
        parent: 'requirebuilding'
      })
      .state({
        name: '404',
        url: '/404',
        templateUrl: '404/404.html'
      });
  }]);


cbecc.run(['$rootScope', '$state', '$q', 'toaster', 'Shared', 'api', 'data', function ($rootScope, $state, $q, toaster, Shared, api, data) {
  api.add('spaces');
  api.add('buildings');
  api.add('building_stories');
  api.add('constructions');
  api.add('fenestrations');
  api.add('construction_defaults');
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    Shared.setIds(toParams); //getBuilding should go into this - index request to determine building id
    Shared.startSpinner();
  });
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    Shared.stopSpinner();
  });
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    Shared.stopSpinner();
    if (error == 'No project ID' || error == 'Invalid project ID') {
      toaster.pop('error', error, "Please create or open a project.");
      $state.go('project');
    } else if (error == 'No building ID' || error == 'Invalid building ID') {
      toaster.pop('error', error, 'Please create a building.');
      $state.go('lookupbuilding.building', {
        project_id: Shared.getProjectId()
      });
    } else {
      console.error('Unhandled state change error:', error);
      $state.go('project');
    }
  });
  $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
    console.error('State not found:', unfoundState.to);
  });

  // Initialize cache with static data
  data.list('constructions').then(function (response) {
    Shared.saveToCache('exterior_walls', response);
  });
  data.list('fenestrations').then(function (response) {
    Shared.saveToCache('fenestration', response);
  });
}]);
