cbecc.controller('SpacesCtrl', [
  '$scope', '$window', '$location', '$routeParams', '$resource', '$stateParams', 'Shared', 'stories','spaces', function ($scope, $window, $location, $routeParams, $resource, $stateParams, Shared, stories, spaces) {

    $scope.spaces = spaces;
    $scope.stories = stories;

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
      // Reset tabs if the main Spaces nav button is clicked
      $scope.tabs.filter(function (element) {
        if ($location.path() === element.path) element.active = true;
      });
    }

    updateActiveTab();
    $scope.$on('$locationChangeSuccess', function () {
      updateActiveTab();
    });
  }]);

cbecc.controller('SubtabSpacesCtrl', ['$scope', '$modal', 'uiGridConstants', function ($scope, $modal, uiGridConstants) {
  // Spaces UI Grid
  $scope.spacesGridOptions = {
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
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (row.isSelected) {
          $scope.selected = row.entity;
        } else {
          // No rows selected
          $scope.selected = null;
        }
      });
    }
  };
  $scope.spacesGridOptions.data = $scope.spaces;
  // Buttons
  $scope.addSpace = function () {
    $scope.spacesGridOptions.data.push({
      name: "Space " + ($scope.spacesGridOptions.data.length + 1),
      floor_to_ceiling_height: 14,
      story: 1,
      area: 400,
      conditioning_type: 'Directly Conditioned',
      envelope_status: 'New',
      lighting_status: 'New'
    });
  };
  $scope.duplicateSpace = function () {
    $scope.spacesGridOptions.data.push({
      name: "Space " + ($scope.spacesGridOptions.data.length + 1),
      floor_to_ceiling_height: $scope.selected.floor_to_ceiling_height,
      story: $scope.selected.story,
      area: $scope.selected.area,
      conditioning_type: $scope.selected.conditioning_type,
      envelope_status: $scope.selected.envelope_status,
      lighting_status: $scope.selected.lighting_status
    });
  };
  $scope.deleteSpace = function () {
    var index = $scope.spacesGridOptions.data.indexOf($scope.selected);
    $scope.spacesGridOptions.data.splice(index, 1);
    if (index > 0) {
      $scope.gridApi.selection.toggleRowSelection($scope.spacesGridOptions.data[index - 1]);
    } else {
      $scope.selected = null;
    }
  };

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
          $scope.spacesGridOptions.data.push({
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
  // Settings UI Grid
  $scope.settingsGridOptions = {
    columnDefs: [{
      name: 'space_name',
      enableHiding: false,
      filter: {
        condition: uiGridConstants.filter.CONTAINS
      }
    }, {
      name: 'space_function',
      enableHiding: false
    }, {
      name: 'occupancy',
      enableHiding: false
    }, {
      name: 'hot_water_use',
      enableHiding: false
    }, {
      name: 'sensible',
      enableHiding: false
    }, {
      name: 'latent',
      enableHiding: false
    }, {
      name: 'schedule_group',
      enableHiding: false
    }, {
      name: 'plug_loads',
      enableHiding: false
    }],
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (row.isSelected) {
          $scope.selected = row.entity;
        } else {
          // No rows selected
          $scope.selected = null;
        }
      });
    }
  };

  // Buttons
  $scope.duplicateSpace = function () {
    $scope.spacesGridOptions.data.push({
      space_name: "Space " + ($scope.spacesGridOptions.data.length + 1),
      floor_to_ceiling_height: $scope.selected.floor_to_ceiling_height,
      story: $scope.selected.story,
      area: $scope.selected.area,
      conditioning_type: $scope.selected.conditioning_type,
      envelope_status: $scope.selected.envelope_status,
      lighting_status: $scope.selected.lighting_status
    });
  };
  $scope.deleteSpace = function () {
    var index = $scope.spacesGridOptions.data.indexOf($scope.selected);
    $scope.spacesGridOptions.data.splice(index, 1);
    if (index > 0) {
      $scope.gridApi.selection.toggleRowSelection($scope.spacesGridOptions.data[index - 1]);
    } else {
      $scope.selected = null;
    }
  };

}]);

cbecc.controller('ModalSpaceCreatorCtrl', [
  '$scope', '$modalInstance', 'uiGridConstants', function ($scope, $modalInstance, uiGridConstants) {
    $scope.selected = null;

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
