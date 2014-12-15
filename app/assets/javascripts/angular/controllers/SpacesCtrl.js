cbecc.controller('SpacesCtrl', [
  '$scope', '$window', '$location', '$routeParams', '$resource', '$location', 'flash', function ($scope, $window, $location, $routeParams, $resource, $location, flash) {

    // Reset tabs if the main Spaces nav button is clicked
    $scope.$on('$locationChangeSuccess', function () {
      if ($location.path() === '/spaces') $scope.tabs[0].active = true;
    });

    $scope.tabs = [{
      heading: 'Spaces',
      route: 'spaces.main'
    }, {
      heading: 'Space Type Settings',
      route: 'spaces.settings'
    }, {
      heading: 'Surfaces: Walls, Floors, Ceilings, and Roofs',
      route: 'spaces.surfaces'
    }, {
      heading: 'Sub-surfaces: Windows, Doors, and Skylights',
      route: 'spaces.subsurfaces'
    }, {
      heading: 'Ventilation & Exhaust',
      route: 'spaces.ventilation'
    }, {
      heading: 'Loads',
      route: 'spaces.loads'
    }, {
      heading: 'Lighting',
      route: 'spaces.lighting'
    }];
  }
]);

cbecc.controller('SubtabSpacesCtrl', ['$scope', '$modal', function ($scope, $modal) {
  // Spaces UI Grid
  $scope.spacesGridOptions = {
    columnDefs: [{
      name: 'space_name'
    }, {
      name: 'floor_to_ceiling_height'
    }, {
      name: 'story'
    }, {
      name: 'area'
    }, {
      name: 'conditioning_type'
    }, {
      name: 'envelope_status'
    }, {
      name: 'lighting_status'
    }],
    enableCellEditOnFocus: true,
    enableColumnMenus: false,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    enableSorting: false,
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
  $scope.addSpace = function () {
    $scope.spacesGridOptions.data.push({
      space_name: "Space " + ($scope.spacesGridOptions.data.length + 1),
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
            space_name: spaceGroup.name + ' ' + (i + 1),
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
      }
      $modalInstance.close(data);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);

