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
    data: [],
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
  $scope.applySettings = function () {
    // TODO
  };
  $scope.deleteSpace = function () {
    var index = $scope.spacesGridOptions.data.indexOf($scope.selected);
    $scope.spacesGridOptions.data.splice(index, 1);
    $scope.selected = null;
  };

  // Modal Settings
  $scope.openSpaceCreatorModal = function () {
    var modalInstance = $modal.open({
      backdrop: 'static',
      controller: 'ModalSpaceCreatorCtrl',
      templateUrl: 'spaces/spaceCreator.html',
      windowClass: 'wide-modal'
    });

    modalInstance.result.then(function (selectedConstruction) {
      $scope.panels[index].selected = selectedConstruction;
      $scope.panels[index].gridOptions.data = selectedConstruction.layers;
    }, function () {
      // Modal canceled
    });
  };
}]);

cbecc.controller('ModalSpaceCreatorCtrl', [
  '$scope', '$modalInstance', function ($scope, $modalInstance) {
    $scope.selected = null;

    $scope.ok = function () {
      $modalInstance.close($scope.selected);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);

