cbecc.controller('SpacesCtrl', [
  '$scope', '$window', '$location', '$routeParams', '$resource', '$stateParams', 'Shared', 'stories', 'spaces', function ($scope, $window, $location, $routeParams, $resource, $stateParams, Shared, stories, spaces) {
    $scope.data = {
      stories: stories,
      spaces: spaces,
      spacesGridOptions: {},
      settingsGridOptions: {},
      selectedSpace: null,
      gridApi: {}
    };

    $scope.tabs = [{
      heading: 'Spaces',
      path: '/spaces',
      route: 'requirebuilding.spaces.main'
    }, {
      heading: 'Space Type Settings',
      path: '/spaces/settings',
      route: 'requirebuilding.spaces.settings'
    }, {
      heading: 'Surfaces: Walls, Floors, Ceilings, and Roofs',
      path: '/spaces/surfaces',
      route: 'requirebuilding.spaces.surfaces'
    }, {
      heading: 'Sub-surfaces: Windows, Doors, and Skylights',
      path: '/spaces/subsurfaces',
      route: 'requirebuilding.spaces.subsurfaces'
    }, {
      heading: 'Ventilation & Exhaust',
      path: '/spaces/ventilation',
      route: 'requirebuilding.spaces.ventilation'
    }, {
      heading: 'Loads',
      path: '/spaces/loads',
      route: 'requirebuilding.spaces.loads'
    }, {
      heading: 'Lighting',
      path: '/spaces/lighting',
      route: 'requirebuilding.spaces.lighting'
    }];

    function updateActiveTab() {
      // Reset tabs if the main nav button is clicked or the page is refreshed
      $scope.tabs.filter(function (element) {
        var regex = new RegExp('^/projects/[0-9a-f]{24}/buildings/[0-9a-f]{24}' + element.path + '$');
        if (regex.test($location.path())) element.active = true;
      });
    }

    updateActiveTab();
    $scope.$on('$locationChangeSuccess', function () {
      // Reset row selection
      $scope.data.selectedSpace = null;

      // Update active subtab
      updateActiveTab();
    });

    // Buttons
    $scope.data.addSpace = function () {
      $scope.data.spaces.push({
        name: "Space " + ($scope.data.spaces.length + 1),
        floor_to_ceiling_height: 14,
        story: null,
        area: 400,
        conditioning_type: 'Directly Conditioned',
        envelope_status: 'New',
        lighting_status: 'New',

        space_function: 'Small Office',
        occupant_density: 10,
        hot_water_heating_rate: 0.18,
        receptacle_power_density: 1.5
      });
    };
    $scope.data.duplicateSpace = function () {
      $scope.data.spaces.push({
        name: "Space " + ($scope.data.spaces.length + 1),
        floor_to_ceiling_height: $scope.data.selectedSpace.floor_to_ceiling_height,
        story: $scope.data.selectedSpace.story,
        area: $scope.data.selectedSpace.area,
        conditioning_type: $scope.data.selectedSpace.conditioning_type,
        envelope_status: $scope.data.selectedSpace.envelope_status,
        lighting_status: $scope.data.selectedSpace.lighting_status,

        space_function: $scope.data.selectedSpace.space_function,
        occupant_density: $scope.data.selectedSpace.occupant_density,
        hot_water_heating_rate: $scope.data.selectedSpace.hot_water_heating_rate,
        receptacle_power_density: $scope.data.selectedSpace.receptacle_power_density
      });
    };
    $scope.data.deleteSpace = function () {
      var index = $scope.data.spaces.indexOf($scope.data.selectedSpace);
      $scope.data.spaces.splice(index, 1);
      if (index > 0) {
        $scope.data.gridApi.selection.toggleRowSelection($scope.data.spaces[index - 1]);
      } else {
        $scope.data.selectedSpace = null;
      }
    };

  }]);

cbecc.controller('SubtabSpacesCtrl', ['$scope', '$modal', 'uiGridConstants', function ($scope, $modal, uiGridConstants) {
  // Initialize Spaces UI Grid
  if (_.isEmpty($scope.data.spacesGridOptions)) {
    $scope.data.spacesGridOptions = {
      columnDefs: [{
        name: 'name',
        displayName: 'Space Name',
        enableHiding: false,
        filter: {
          condition: uiGridConstants.filter.CONTAINS
        }
      }, {
        name: 'floor_to_ceiling_height',
        enableHiding: false
      }, {
        name: 'story',
        enableHiding: false
      }, {
        name: 'area',
        enableHiding: false
      }, {
        name: 'conditioning_type',
        enableHiding: false
      }, {
        name: 'envelope_status',
        enableHiding: false
      }, {
        name: 'lighting_status',
        enableHiding: false
      }],
      data: $scope.data.spaces,
      enableCellEditOnFocus: true,
      enableFiltering: true,
      enableRowHeaderSelection: true,
      enableRowSelection: true,
      multiSelect: false,
      onRegisterApi: function (gridApi) {
        $scope.data.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          if (row.isSelected) {
            $scope.data.selectedSpace = row.entity;
          } else {
            // No rows selected
            $scope.data.selectedSpace = null;
          }
        });
      }
    };
  }

  // Modal Settings
  $scope.openSpaceCreatorModal = function () {
    var modalInstance = $modal.open({
      backdrop: 'static',
      controller: 'ModalSpaceCreatorCtrl',
      templateUrl: 'spaces/spaceCreator.html',
      windowClass: 'wide-modal'
    });

    modalInstance.result.then(function (spaceGroups) {
      _.each(spaceGroups, function (spaceGroup) {
        for (var i = 0; i < spaceGroup.quantity; ++i) {
          $scope.data.spaces.push({
            name: spaceGroup.name + ' ' + (i + 1),
            floor_to_ceiling_height: spaceGroup.floor_to_ceiling_height,
            story: spaceGroup.story,
            area: spaceGroup.area,
            conditioning_type: spaceGroup.conditioning_type,
            envelope_status: spaceGroup.envelope_status,
            lighting_status: spaceGroup.lighting_status
          });
        }
      });
    }, function () {
      // Modal canceled
    });
  };
}]);

cbecc.controller('SubtabSettingsCtrl', ['$scope', '$modal', 'uiGridConstants', function ($scope, $modal, uiGridConstants) {
  // Initialize Settings UI Grid
  if (_.isEmpty($scope.data.settingsGridOptions)) {
    $scope.data.settingsGridOptions = {
      columnDefs: [{
        name: 'name',
        displayName: 'Space Name',
        enableHiding: false,
        filter: {
          condition: uiGridConstants.filter.CONTAINS
        }
      }, {
        name: 'space_function',
        enableHiding: false
      }, {
        name: 'occupant_density',
        displayName: 'Occupancy',
        enableHiding: false
      }, {
        name: 'hot_water_heating_rate',
        displayName: 'Hot Water Use',
        enableHiding: false
      }, {
        name: 'receptacle_power_density',
        displayName: 'Plug Loads',
        enableHiding: false
      }],
      data: $scope.data.spaces,
      enableCellEditOnFocus: true,
      enableFiltering: true,
      enableRowHeaderSelection: true,
      enableRowSelection: true,
      multiSelect: false,
      onRegisterApi: function (gridApi) {
        $scope.data.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          if (row.isSelected) {
            $scope.data.selectedSpace = row.entity;
          } else {
            // No rows selected
            $scope.data.selectedSpace = null;
          }
        });
      }
    };
  }

}]);

cbecc.controller('ModalSpaceCreatorCtrl', [
  '$scope', '$modalInstance', 'uiGridConstants', function ($scope, $modalInstance, uiGridConstants) {
    $scope.spaceGroups = [];

    $scope.addSpaceGroup = function () {
      $scope.spaceGroups.push({
        gridOptions: {
          columnDefs: [{
            name: 'quantity',
            displayName: '# of Spaces of This Type'
          }, {
            name: 'name',
            displayName: 'Name + 1,2,3...'
          }, {
            name: 'space_type_or_function'
          }, {
            name: 'floor_to_ceiling_height'
          }, {
            name: 'story',
            width: 71
          }, {
            name: 'area',
            displayName: 'Area (ft2)',
            width: 98
          }, {
            name: 'conditioning_type'
          }, {
            name: 'envelope_status'
          }, {
            name: 'lighting_status'
          }],
          data: [{
            quantity: 20,
            name: 'Small Office',
            space_type_or_function: 'Large Office ≥ 250ft',
            floor_to_ceiling_height: 10,
            area: 250,
            story: 1,
            conditioning_type: 'Directly Conditioned',
            envelope_status: 'New',
            lighting_status: 'New'
          }],
          enableCellEditOnFocus: true,
          enableColumnMenus: false,
          enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
          enableSorting: false,
          enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER
        },
        wallGridOptions: {
          columnDefs: [{
            name: 'external_walls',
            displayName: '# of External Walls'
          }, {
            name: 'windows',
            displayName: '# of Windows on External Walls'
          }, {
            name: 'internal_walls',
            displayName: '# of Internal Walls'
          }],
          data: [{
            external_walls: 1,
            windows: 1,
            internal_walls: 3
          }],
          enableCellEditOnFocus: true,
          enableColumnMenus: false,
          enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
          enableSorting: false,
          enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER
        }
      });
    };

    $scope.addSpaceGroup();

    $scope.removeSpaceGroup = function (index) {
      $scope.spaceGroups.splice(index, 1);
    };

    $scope.ok = function () {
      var data = [];
      for (var i = 0; i < $scope.spaceGroups.length; ++i) {
        data.push($scope.spaceGroups[i].gridOptions.data[0]);
        data.push($scope.spaceGroups[i].wallGridOptions.data[0]);
      }
      $modalInstance.close(data);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
