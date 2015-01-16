var cbecc = angular.module('cbecc', [
  'templates',
  'ngAnimate', 'ngResource', 'ngRoute',
  'toaster',
  'angular-data.DSCacheFactory',
  'ui.grid', 'ui.grid.autoResize', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.selection',
  'ui.router', 'ui.router.stateHelper',
  'ui.bootstrap',
  'frapontillo.bootstrap-switch',
  'angularSpinner']);

cbecc.config([
  '$stateProvider', '$urlRouterProvider', 'stateHelperProvider', '$httpProvider', 'usSpinnerConfigProvider', 'dataProvider', function ($stateProvider, $urlRouterProvider, stateHelperProvider, $httpProvider, usSpinnerConfigProvider, dataProvider) {

    usSpinnerConfigProvider.setDefaults({
      color: '#70be44',
      lines: 13,
      length: 0,
      width: 22,
      radius: 60,
      speed: 2.2,
      trail: 60,
      shadow: false
    });

    var getConstructions = ['$q', 'data', 'Shared', function ($q, data, Shared) {
      if (Shared.existsInCache('constructions')) {
        return $q.when(Shared.loadFromCache('constructions'));
      }
      // Not in cache yet
      return data.list('constructions');
    }];

    var getDoors = ['$q', 'data', 'Shared', function ($q, data, Shared) {
      if (Shared.existsInCache('doors')) {
        return $q.when(Shared.loadFromCache('doors'));
      }
      // Not in cache yet
      return data.list('door_lookups');
    }];

    var getFenestrations = ['$q', 'data', 'Shared', function ($q, data, Shared) {
      if (Shared.existsInCache('fenestrations')) {
        return $q.when(Shared.loadFromCache('fenestrations'));
      }
      // Not in cache yet
      return data.list('fenestrations');
    }];

    var getSpaceFunctionDefaults = ['$q', 'data', 'Shared', function ($q, data, Shared) {
      if (Shared.existsInCache('spaceFunctionDefaults')) {
        return $q.when(Shared.loadFromCache('spaceFunctionDefaults'));
      }
      // Not in cache yet
      return data.list('space_function_defaults', Shared.defaultParams());
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
            var require = false;
            return Shared.lookupBuilding($q, data, require);
          }]
        }
      })
      // .state({
      //   name: 'introduction',
      //   url: '/',
      //   templateUrl: 'introduction/introduction.html'
      //  })
      .state({
        name: 'project',
        url: '/',
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
          doorData: getDoors,
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
          constData: getConstructions,
          doorData: getDoors,
          fenData: getFenestrations,
          spaceFunctionDefaults: getSpaceFunctionDefaults,
          stories: ['$q', 'data', 'Shared', 'lookupbuilding', function ($q, data, Shared, lookupbuilding) {
            return data.list('building_stories', Shared.defaultParams());
          }],
          spaces: ['$q', 'data', 'Shared', 'lookupbuilding', function ($q, data, Shared, lookupbuilding) {
            return data.list('spaces', Shared.defaultParams());
          }],
          constructions: ['$q', 'data', 'Shared', 'lookupbuilding', function ($q, data, Shared, lookupbuilding) {
            return data.list('construction_defaults', Shared.defaultParams());
          }]
        },
        parent: 'requirebuilding',
        children: [{
          // No controller here because the file is ng-included
          name: 'main',
          url: '',
          templateUrl: 'spaces/main.html'
        }, {
          name: 'settings',
          url: '/settings',
          controller: 'SpacesSettingsCtrl',
          templateUrl: 'spaces/settings.html'
        }, {
          name: 'surfaces',
          url: '/surfaces',
          controller: 'SpacesSurfacesCtrl',
          templateUrl: 'spaces/surfaces.html'
        }, {
          name: 'subsurfaces',
          url: '/subsurfaces',
          controller: 'SpacesSubsurfacesCtrl',
          templateUrl: 'spaces/subsurfaces.html'
        }, {
          name: 'ventilation',
          url: '/ventilation',
          controller: 'SpacesVentilationCtrl',
          templateUrl: 'spaces/ventilation.html'
        }, {
          name: 'loads',
          url: '/loads',
          controller: 'SpacesLoadsCtrl',
          templateUrl: 'spaces/loads.html'
        }, {
          name: 'gas',
          url: '/gas',
          controller: 'SpacesGasCtrl',
          templateUrl: 'spaces/gas.html'
        }, {
          name: 'lighting',
          url: '/lighting',
          controller: 'SpacesLightingCtrl',
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
        resolve: {
          saved_systems: ['$q', 'data', 'Shared', 'lookupbuilding', function ($q, data, Shared, lookupbuilding) {
            return data.list('zone_systems', Shared.defaultParams());
          }],
          saved_plants: ['$q', 'data', 'Shared', 'lookupbuilding', function ($q, data, Shared, lookupbuilding) {
            return data.list('fluid_systems', Shared.defaultParams());
          }]
        },
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
        resolve: {
          stories: ['$q', 'data', 'Shared', 'lookupbuilding', function ($q, data, Shared, lookupbuilding) {
            return data.list('building_stories', Shared.defaultParams());
          }],
          spaces: ['$q', 'data', 'Shared', 'lookupbuilding', function ($q, data, Shared, lookupbuilding) {
            return data.list('spaces', Shared.defaultParams());
          }],
          zones: ['$q', 'data', 'Shared', 'lookupbuilding', function ($q, data, Shared, lookupbuilding) {
            return data.list('thermal_zones', Shared.defaultParams());
          }],
          systems: ['$q', 'data', 'Shared', 'lookupbuilding', function ($q, data, Shared, lookupbuilding) {
            return data.list('zone_systems', Shared.defaultParams());
          }]

        },
        parent: 'requirebuilding',
        children: [{
          // No controller here because the file is ng-included
          name: 'main',
          url: '',
          templateUrl: 'zones/main.html'
        }, {
          name: 'spaces',
          url: '/spaces',
          controller: 'ZonesSpacesCtrl',
          templateUrl: 'zones/spaces.html'
        }, {
          name: 'systems',
          url: '/systems',
          controller: 'ZonesSystemsCtrl',
          templateUrl: 'zones/systems.html'
        }, {
          name: 'exhausts',
          url: '/exhausts',
          controller: 'ZonesExhaustsCtrl',
          templateUrl: 'zones/exhausts.html'
        }, {
          name: 'terminals',
          url: '/terminals',
          controller: 'ZonesTerminalsCtrl',
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
  api.add('door_lookups');
  api.add('construction_defaults');
  api.add('zone_systems');
  api.add('fluid_systems');
  api.add('spaces');
  api.add('simulations');
  api.add('space_function_defaults');
  api.add('thermal_zones');

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
  if (!Shared.existsInCache('constructions')) {
    data.list('constructions').then(function (response) {
      Shared.saveToCache('constructions', response);
    });
  }
  if (!Shared.existsInCache('doors')) {
    data.list('door_lookups').then(function (response) {
      Shared.saveToCache('doors', response);
    });
  }
  if (!Shared.existsInCache('fenestrations')) {
    data.list('fenestrations').then(function (response) {
      Shared.saveToCache('fenestrations', response);
    });
  }
  if (!Shared.existsInCache('spaceFunctionDefaults')) {
    data.list('space_function_defaults').then(function (response) {
      Shared.saveToCache('spaceFunctionDefaults', response);
    });
  }
}]);


cbecc.filter('mapEnums', ['Enums', function (Enums) {
  return function (input, name) {
    return Enums.enumsArr[name][input].value;
  };
}]).filter('mapStories', function () {
  return function (input, $scope) {
    var storiesHash = {};

    // The data property can be found between 7-9 parents deep due to ng-include, ui-view, and modal scope hierarchies
    while (_.isEmpty(storiesHash)) {
      if ($scope.hasOwnProperty('data')) {
        storiesHash = $scope.data.storiesHash;
      } else {
        $scope = $scope.$parent;
      }
    }

    return storiesHash[input];
  };
}).filter('mapZones', function () {
  return function (input, $scope) {
    while (!$scope.hasOwnProperty('zonesHash')) {
      $scope = $scope.$parent;
    }
    return $scope.zonesHash[input];
  }
}).filter('mapSpaces', function () {
  return function (input, $scope) {
    while (!$scope.hasOwnProperty('spacesHash')) {
      $scope = $scope.$parent;
    }
    return $scope.spacesHash[input];
  };
}).filter('mapSurfaces', function () {
  return function (input, $scope) {
    while (!$scope.hasOwnProperty('surfacesHash')) {
      $scope = $scope.$parent;
    }
    return $scope.surfacesHash[input];
  };
}).filter('parseRValue', function () {
  return function (input) {
    return input.replace('_', '.').replace(/[^\d.]/g, '');
  };
});
