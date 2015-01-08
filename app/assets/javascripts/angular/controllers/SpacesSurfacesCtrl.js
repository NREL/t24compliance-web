cbecc.controller('SpacesSurfacesCtrl', ['$scope', 'Enums', function ($scope, Enums) {
  $scope.dropdowns = [
    'Interior',
    'Exterior',
    'Underground'
  ];
  $scope.currentWallDropdown = 0;
  $scope.currentFloorDropdown = 0;

  $scope.spacesArr = [];
  $scope.spacesHash = {};
  _.each($scope.data.spaces, function (space, index) {
    $scope.spacesArr.push({
      id: index,
      value: space.name
    });
    $scope.spacesHash[index] = space.name;
  });

  // Update stories if they were modified on the Spaces subtab
  _.each($scope.data.surfaces, function (surface, index) {
    if (surface.story != $scope.data.spaces[surface.space].story) {
      surface.story = $scope.data.spaces[surface.space].story;
    }
  });

  // Surfaces UI Grid
  $scope.surfacesGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Surface Name',
      enableHiding: false,
      filter: angular.copy($scope.data.textFilter)
    }, {
      name: 'space',
      displayName: 'Space Name',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapSpaces:this',
      editDropdownOptionsArray: $scope.spacesArr,
      filter: {
        condition: function (searchTerm, cellValue) {
          var haystack = $scope.data.spacesHash[cellValue];
          return _.contains(haystack.toLowerCase(), searchTerm.toLowerCase());
        }
      },
      sortingAlgorithm: $scope.data.sort($scope.data.spacesArr)
    }, {
      name: 'surface_type',
      enableCellEdit: false,
      enableHiding: false
    }, {
      name: 'story',
      enableCellEdit: false,
      cellFilter: 'mapStories:this',
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
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        if (colDef.name == 'space' && newValue != oldValue) {
          rowEntity.story = $scope.data.spaces[newValue].story;

          var regex = '^' + $scope.spacesHash[oldValue] + ' ' + rowEntity.type;
          if (rowEntity.type == 'Wall' || rowEntity.type == 'Floor') regex += ' [0-9]+';
          regex += '$';
          if (new RegExp(regex).test(rowEntity.name)) {
            var name = $scope.spacesHash[newValue] + ' ' + rowEntity.type;
            if (rowEntity.type == 'Wall' || rowEntity.type == 'Floor') {
              var len = _.filter($scope.data.surfaces, function (surface) {
                return surface.space == newValue && surface.type == rowEntity.type;
              }).length;
              name += ' ' + len;
            }
            rowEntity.name = name;
          }
        }
      });
    }
  };

  // Buttons
  $scope.addSurface = function (type, boundary) {
    var spaceIndex = 0;

    var name = $scope.spacesHash[spaceIndex] + ' ' + type;
    var surfaceType = type;

    if (type == 'Wall' || type == 'Floor') {
      var len = _.filter($scope.data.surfaces, function (surface) {
        return surface.space == spaceIndex && surface.type == type;
      }).length;
      name += ' ' + (len + 1);
      surfaceType = boundary + ' ' + surfaceType;
    }
    $scope.data.surfaces.push({
      name: name,
      space: spaceIndex,
      type: type,
      boundary: boundary,
      surface_type: surfaceType,
      story: $scope.data.spaces[spaceIndex].story,
      area: null,
      azimuth: null,
      construction: null,
      adjacent_space: null,
      tilt: null,
      wall_height: null,
      exposed_perimeter: null
    });
  };
  $scope.duplicateSurface = function () {

  };
  $scope.deleteSurface = function () {

  };

}]);
