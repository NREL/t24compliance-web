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
  '$stateProvider', '$urlRouterProvider', 'stateHelperProvider', '$httpProvider', 'usSpinnerConfigProvider', function ($stateProvider, $urlRouterProvider, stateHelperProvider, $httpProvider, usSpinnerConfigProvider) {

    usSpinnerConfigProvider.setDefaults({
      lines: 13,
      length: 0,
      width: 22,
      radius: 60,
      speed: 2.2,
      trail: 60,
      shadow: false
    });

    var getBuilding = function ($q, Shared, Building) {
      if (!Shared.getProjectId()) {
        return $q.reject('No project ID');
      }
      if (!Shared.getBuildingId()) {
        return Building.index({project_id: Shared.getProjectId()}).$promise.then(function (response) {
          if (response.hasOwnProperty('id')) {
            Shared.setBuildingId(response.id);
          } else {
            // Project with no building
            return $q.reject('No building ID');
          }
        }, function (response) {
          if (response.status == 404) {
            Shared.setProjectId(null);
            return $q.reject('Invalid project ID');
          }
          return $q.reject('Unknown error while retrieving building ID');
        });
      }
    };

    var getStoriesForBuildingTab = function ($q, $stateParams, Story, Shared, Building) {
      var mainPromise = function () {
        return Story.index({
          building_id: Shared.getBuildingId()
        }).$promise;
      };

      Shared.setIds($stateParams);
      if (!Shared.getBuildingId()) {
        return getBuilding($q, Shared, Building).then(function () {
          return mainPromise();
        }, function (error) {
          if (error == 'No building ID') {
            // Ignore lack of buildingId on the building tab with a valid projectId
            return $q.when([]);
          }
          return $q.reject(error);
        });
      }
      return mainPromise();
    };

    var getStories = function ($q, $stateParams, Story, Shared, Building) {
      var mainPromise = function () {
        return Story.index({
          building_id: Shared.getBuildingId()
        }).$promise;
      };

      Shared.setIds($stateParams);
      if (!Shared.getBuildingId()) {
        return getBuilding($q, Shared, Building).then(function () {
          console.log('getBuilding returned success');
          return mainPromise();
        });
      }
      return mainPromise();
    };

    var getConstructions = function ($q, $stateParams, Construction, Shared, Building) {
      var mainPromise = function () {
        var exteriorWallData = Shared.loadFromCache('exterior_walls');
        if (exteriorWallData !== null) {
          return $q.when(exteriorWallData);
        }
        // Not in cache yet
        return Construction.index().$promise;
      };

      Shared.setIds($stateParams);
      // Construction data have no dependencies, but just to reduce latency:
      if (!Shared.getBuildingId()) {
        return getBuilding($q, Shared, Building).then(function () {
          return mainPromise();
        });
      }
      return mainPromise();
    };

    var getConstructionDefaults = function ($q, $stateParams, ConstructionDefaults, Shared, Building) {
      var mainPromise = function () {
        return ConstructionDefaults.index({
          project_id: Shared.getProjectId()
        }).$promise.then(function (response) {
            return $q.when(response);
          }, function (response) {
            if (response.status == 404) {
              Shared.setProjectId(null);
              return $q.reject('Invalid project ID');
            }
            return $q.reject('Unknown error while retrieving construction defaults');
          });
      };

      Shared.setIds($stateParams);
      if (!Shared.getBuildingId()) {
        return getBuilding($q, Shared, Building).then(function () {
          return mainPromise();
        });
      }
      return mainPromise();
    };

    var getFenestrations = function ($q, $stateParams, Fenestration, Shared, Building) {
      var mainPromise = function () {
        var fenestrationData = Shared.loadFromCache('fenestration');
        if (fenestrationData !== null) {
          return $q.when(fenestrationData);
        }
        // Not in cache yet
        return Fenestration.index().$promise;
      };

      Shared.setIds($stateParams);
      // Fenestration data have no dependencies, but just to reduce latency:
      if (!Shared.getBuildingId()) {
        return getBuilding($q, Shared, Building).then(function () {
          return mainPromise();
        });
      }
      return mainPromise();
    };

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
        url: '/projects',
        controller: 'ProjectCtrl',
        templateUrl: 'project/project.html'
      })
      .state({
        name: 'projectDetails',
        url: '/projects/{project_id:[0-9a-f]{24}}',
        controller: 'ProjectCtrl',
        templateUrl: 'project/project.html'
      })
      .state({
        name: 'building',
        url: '/projects/{project_id:[0-9a-f]{24}}/buildings',
        controller: 'BuildingCtrl',
        templateUrl: 'building/building.html',
        resolve: {
          data: getStoriesForBuildingTab
        }
      })
      .state({ //shouldn't be clickable without projectid
        name: 'buildingPlaceholder',
        url: '/buildings',
        controller: 'BuildingCtrl',
        templateUrl: 'building/building.html',
        resolve: {
          data: getStoriesForBuildingTab
        }
      })
      .state({
        name: 'buildingDetails',
        url: '/projects/{project_id:[0-9a-f]{24}}/buildings/{building_id:[0-9a-f]{24}}',
        controller: 'BuildingCtrl',
        templateUrl: 'building/building.html',
        resolve: {
          data: getStoriesForBuildingTab
        }
      })
      .state({
        name: 'constructions',
        url: '/projects/{project_id:[0-9a-f]{24}}/buildings/{building_id:[0-9a-f]{24}}/constructions',
        controller: 'ConstructionsCtrl',
        templateUrl: 'constructions/constructions.html',
        resolve: {
          data: getConstructions,
          fenData: getFenestrations,
          defaults: getConstructionDefaults
        }
      })
      .state({
        name: 'constructions_placeholder',
        url: '/constructions',
        controller: 'ConstructionsCtrl',
        templateUrl: 'constructions/constructions.html',
        resolve: {
          data: getConstructions,
          fenData: getFenestrations,
          defaults: getConstructionDefaults //this will redirect if project or building not set
        }
      })
      .state({
        name: 'spaces',
        url: '/projects/{project_id:[0-9a-f]{24}}/buildings/{building_id:[0-9a-f]{24}}/spaces',
        controller: 'SpacesCtrl',
        templateUrl: 'spaces/spaces.html',
        resolve: {
          storyData: getStories
        },
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
        name: 'spaces_placeholder',
        url: '/spaces',
        controller: 'SpacesCtrl',
        templateUrl: 'spaces/spaces.html',
        resolve: {
          storyData: getStories
        }
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

cbecc.run(['$rootScope', '$state', 'toaster', 'Shared', 'Construction', 'Fenestration', function ($rootScope, $state, toaster, Shared, Construction, Fenestration) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
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
      $state.go('building', {project_id: Shared.getProjectId()});
    } else {
      console.error('Unhandled state change error:', error);
      $state.go('project');
    }
  });
  $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
    console.error('State not found:', unfoundState.to);
  });

  // Initialize cache with static data
  Construction.index().$promise.then(function (response) {
    Shared.saveToCache('exterior_walls', response);
  });
  Fenestration.index().$promise.then(function (response) {
    Shared.saveToCache('fenestration', response);
  });
}]);
