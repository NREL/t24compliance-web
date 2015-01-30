var cbecc = angular.module('cbecc', [
  'templates',
  'ngAnimate', 'ngResource', 'ngRoute',
  'toaster',
  'angular-data.DSCacheFactory',
  'ui.grid', 'ui.grid.autoResize', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.pinning',
  'ui.router', 'ui.router.stateHelper',
  'ui.bootstrap',
  'frapontillo.bootstrap-switch',
  'angularSpinner']);

cbecc.config([
  '$logProvider', '$stateProvider', '$provide', '$urlRouterProvider', 'stateHelperProvider', '$httpProvider', 'usSpinnerConfigProvider', 'dataProvider', function ($logProvider, $stateProvider, $provide, $urlRouterProvider, stateHelperProvider, $httpProvider, usSpinnerConfigProvider, dataProvider) {

    $logProvider.debugEnabled(true);

    usSpinnerConfigProvider.setDefaults({
      color: '#70be44',
      lines: 13,
      length: 0,
      width: 22,
      radius: 60,
      speed: 2.2,
      trail: 60,
      shadow: false,
      hwaccel: true,
      top: '450px'
    });

    $urlRouterProvider.when('', '/').otherwise('404');

    $httpProvider.defaults.headers.common['X-CSRF-TOKEN'] = $('meta[name="csrf-token"]').attr('content');

    stateHelperProvider
      //states that require building should have requirebuilding as parent.
      .state({
        abstract: true,
        name: 'requirebuilding',
        template: '<ui-view>',
        resolve: {
          lookupbuilding: ['data', 'Shared', function (data, Shared) {
            return Shared.lookupBuilding(data, true);
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
          lookupbuilding: ['data', 'Shared', function (data, Shared) {
            return Shared.lookupBuilding(data);
          }]
        }
      })
      .state({
        name: 'project',
        url: '/',
        controller: 'ProjectCtrl',
        templateUrl: 'project/project.html',
        resolve: {
          project: ['data', 'Shared', function (data, Shared) {
            if (!Shared.getProjectId()) return {};
            return data.show('projects', {id: Shared.getProjectId()});
          }]
        }
      })
      .state({
        name: 'projectDetails',
        url: '/projects/{project_id:[0-9a-f]{24}}',
        controller: 'ProjectCtrl',
        templateUrl: 'project/project.html',
        parent: 'lookupbuilding',
        resolve: {
          project: ['data', 'Shared', function (data, Shared) {
            return data.show('projects', {id: Shared.getProjectId()});
          }]
        }
      })
      .state({
        name: 'buildingPlaceholder',
        url: '/buildings',
        controller: 'BuildingCtrl',
        templateUrl: 'building/building.html',
        resolve: {
          building: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            if (!Shared.getBuildingId()) return {};
            return data.show('buildings', {id: Shared.getBuildingId(), project_id: Shared.getProjectId()});
          }],
          stories: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('building_stories', Shared.defaultParams());
          }],
          spaces: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('spaces', Shared.defaultParams());
          }]
        },
        parent: 'lookupbuilding'
      })
      .state({
        name: 'building',
        url: '/projects/{project_id:[0-9a-f]{24}}/buildings',
        controller: 'BuildingCtrl',
        templateUrl: 'building/building.html',
        resolve: {
          building: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            if (!Shared.getBuildingId()) return {};
            return data.show('buildings', {id: Shared.getBuildingId(), project_id: Shared.getProjectId()});
          }],
          stories: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('building_stories', Shared.defaultParams());
          }],
          spaces: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('spaces', Shared.defaultParams());
          }]
        },
        parent: 'lookupbuilding'
      })
      .state({
        name: 'buildingDetails',
        url: '/projects/{project_id:[0-9a-f]{24}}/buildings/{building_id:[0-9a-f]{24}}',
        controller: 'BuildingCtrl',
        templateUrl: 'building/building.html',
        resolve: {
          building: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.show('buildings', {id: Shared.getBuildingId(), project_id: Shared.getProjectId()});
          }],
          stories: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('building_stories', Shared.defaultParams());
          }],
          spaces: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('spaces', Shared.defaultParams());
          }]
        },
        parent: 'requirebuilding'
      })
      .state({
        name: 'constructions',
        url: '/projects/{project_id:[0-9a-f]{24}}/buildings/{building_id:[0-9a-f]{24}}/constructions',
        controller: 'ConstructionsCtrl',
        templateUrl: 'constructions/constructions.html',
        resolve: {
          constData: ['data', 'lookupbuilding', function (data, lookupbuilding) {
            return data.list('constructions');
          }],
          doorData: ['data', 'lookupbuilding', function (data, lookupbuilding) {
            return data.list('door_lookups');
          }],
          fenData: ['data', 'lookupbuilding', function (data, lookupbuilding) {
            return data.list('fenestrations');
          }],
          defaults: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('construction_defaults', Shared.defaultParams());
          }],
          spaces: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('spaces', Shared.defaultParams());
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
          constData: ['data', 'lookupbuilding', function (data, lookupbuilding) {
            return data.list('constructions');
          }],
          doorData: ['data', 'lookupbuilding', function (data, lookupbuilding) {
            return data.list('door_lookups');
          }],
          fenData: ['data', 'lookupbuilding', function (data, lookupbuilding) {
            return data.list('fenestrations');
          }],
          spaceFunctionDefaults: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('space_function_defaults', Shared.defaultParams());
          }],
          stories: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('building_stories', Shared.defaultParams());
          }],
          spaces: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('spaces', Shared.defaultParams());
          }],
          constructionDefaults: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('construction_defaults', Shared.defaultParams());
          }],
          luminaires: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('luminaires', Shared.defaultParams());
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
          saved_systems: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('zone_systems', Shared.defaultParams());
          }],
          saved_plants: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
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
          stories: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('building_stories', Shared.defaultParams());
          }],
          spaces: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('spaces', Shared.defaultParams());
          }],
          zones: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('thermal_zones', Shared.defaultParams());
          }],
          systems: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('zone_systems', Shared.defaultParams());
          }],
          terminals: ['data', 'Shared', 'lookupbuilding', function (data, Shared, lookupbuilding) {
            return data.list('terminal_units', Shared.defaultParams());
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


cbecc.run(['$rootScope', '$log', '$state', 'toaster', 'Shared', 'api', function ($rootScope, $log, $state, toaster, Shared, api) {
  api.add(['building_stories', 'buildings', 'construction_defaults', 'constructions', 'door_lookups', 'fenestrations', 'fluid_systems', 'luminaires', 'projects', 'simulations', 'space_function_defaults', 'spaces', 'terminal_units', 'thermal_zones', 'zone_systems']);

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    // Don't prompt to save on subtab changes
    var to = toState.hasOwnProperty('parent') ? (toState.parent.hasOwnProperty('name') ? toState.parent.name : toState.name) : null;
    var from = fromState.hasOwnProperty('parent') ? (fromState.parent.hasOwnProperty('name') ? fromState.parent.name : fromState.name) : null;
    var ignoreModified = _.contains(['requirebuilding.spaces', 'requirebuilding.zones'], to) && to == from;

    // Don't prompt when on project with no building
    if (fromState.name == 'project') ignoreModified = true;

    // Don't prompt when on building with no building and clicking a non-project tab
    if (fromState.name == 'lookupbuilding.building' && toState.name != 'lookupbuilding.projectDetails') ignoreModified = true;

    // Check for unsaved data first
    if (Shared.isModified() && !ignoreModified) {
      event.preventDefault();

      Shared.showModifiedDialog().then(function () {
        Shared.resetModified();
        $state.go(toState, toParams);
      });
    } else {
      Shared.setIds(toParams); //getBuilding should go into this - index request to determine building id
      Shared.startSpinner();
    }
  });
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    Shared.stopSpinner();
  });
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    Shared.stopSpinner();
    if (error == 'No project ID' || error == 'Invalid project ID') {
      toaster.pop('error', error, 'Please create or open a project.');
      Shared.setProjectId(null);
      $state.go('project');
    } else if (error == 'No building ID' || error == 'Invalid building ID') {
      toaster.pop('error', error, 'Please create a building.');
      Shared.setBuildingId(null);
      $state.go('lookupbuilding.building', {
        project_id: Shared.getProjectId()
      });
    } else {
      $log.error('Unhandled state change error:', error);
      Shared.setProjectId(null);
      Shared.setBuildingId(null);
      $state.go('project');
    }
  });
  $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
    $log.error('State not found:', unfoundState.to);
  });
}]);


cbecc.filter('mapEnums', ['Enums', function (Enums) {
  return function (input, name) {
    return Enums.enumsArr[name][input].value;
  };
}]).filter('mapHash', function () {
  return function (input, hash) {
    return hash[input];
  };
}).filter('parseRValue', function () {
  return function (input) {
    return input.replace('_', '.').replace(/[^\d.]/g, '');
  };
});
