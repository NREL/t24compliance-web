cbecc.controller('SpacesSurfacesCtrl', ['$scope', '$window', function ($scope, $window) {
  $scope.dropdowns = [
    'Interior',
    'Exterior',
    'Underground'
  ];
  $scope.currentWallDropdown = 0;
  $scope.currentFloorDropdown = 0;

  // Surfaces UI Grid
  $scope.surfacesGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Surface Name',
      enableHiding: false,
      filter: angular.copy($scope.data.textFilter)
    }, {
      name: 'space_name',
      enableHiding: false
    }, {
      name: 'surface_type',
      enableHiding: false
    }, {
      name: 'story',
      enableHiding: false
    }, {
      name: 'area',
      enableHiding: false
    }, {
      name: 'azimuth',
      enableHiding: false
    }, {
      name: 'construction',
      enableHiding: false
    }, {
      name: 'adjacent_space',
      enableHiding: false
    }, {
      name: 'tilt',
      enableHiding: false
    }, {
      name: 'wall_height',
      enableHiding: false
    }, {
      name: 'exposed_perimeter',
      enableHiding: false
    }],
    data: $scope.data.surfaces,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.data.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (row.isSelected) {
          $scope.selectedSurface = row.entity;
        } else {
          // No rows selected
          $scope.selectedSurface = null;
        }
      });
    }
  };

  // Buttons
  $scope.addWall = function (type) {
    console.log('addWall called:', type);

    $scope.data.surfaces.push({
      name: "Surface " + ($scope.data.surfaces.length + 1),
      space_name: $scope.data.spaces[0].name,
      surface_type: type + ' Wall',
      story: 1,
      area: null,
      azimuth: null,
      construction: null,
      adjacent_space: null,
      tilt: null,
      wall_height: null,
      exposed_perimeter: null
    });
  };
  $scope.addFloor = function (type) {
    console.log('addFloor called:', type);
  };
  $scope.addCeiling = function () {
    console.log('addCeiling called');
  };
  $scope.addRoof = function () {
    console.log('addRoof called');
  };
  $scope.duplicateSurface = function () {
    console.log('duplicateSurface called');
  };
  $scope.deleteSurface = function () {
    console.log('deleteSurface called');
  };

}]);
