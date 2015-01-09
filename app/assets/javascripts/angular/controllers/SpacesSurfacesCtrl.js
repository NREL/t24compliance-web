cbecc.controller('SpacesSurfacesCtrl', ['$scope', '$sce', 'Enums', function ($scope, $sce, Enums) {
  $scope.selectedSurface = null;

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
      filter: angular.copy($scope.data.textFilter),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'space',
      displayName: 'Space Name',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapSpaces:this',
      editDropdownOptionsArray: $scope.spacesArr,
      filter: {
        condition: function (searchTerm, cellValue) {
          var haystack = $scope.spacesHash[cellValue];
          return _.contains(haystack.toLowerCase(), searchTerm.toLowerCase());
        }
      },
      headerCellTemplate: 'ui-grid/customHeaderCell',
      sortingAlgorithm: $scope.data.sort($scope.spacesArr)
    }, {
      name: 'surface_type',
      enableCellEdit: false,
      enableHiding: false,
      filter: angular.copy($scope.data.textFilter),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'story',
      enableCellEdit: false,
      cellFilter: 'mapStories:this',
      enableHiding: false,
      filter: {
        condition: function (searchTerm, cellValue) {
          var haystack = $scope.data.storiesHash[cellValue];
          return _.contains(haystack.toLowerCase(), searchTerm.toLowerCase());
        }
      },
      headerCellTemplate: 'ui-grid/customHeaderCell',
      sortingAlgorithm: $scope.data.sort($scope.data.storiesArr)
    }, {
      name: 'area',
      secondLine: $sce.trustAsHtml('ft<sup>2</sup>'),
      enableHiding: false,
      type: 'number',
      filters: angular.copy($scope.data.numberFilter),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'azimuth',
      secondLine: $sce.trustAsHtml('&deg;'),
      enableHiding: false,
      type: 'number',
      cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
        if (!(row.entity.type == 'Roof' || (row.entity.type == 'Wall' && row.entity.boundary == 'Exterior'))) {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.type == 'Roof' || ($scope.row.entity.type == 'Wall' && $scope.row.entity.boundary == 'Exterior'));
      },
      filters: angular.copy($scope.data.numberFilter),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'construction',
      enableHiding: false,
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'adjacent_space',
      enableHiding: false,
      cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
        if (!(row.entity.type == 'Ceiling' || row.entity.boundary == 'Interior')) {
          return 'disabled-cell';
        }
        if (row.entity.space == row.entity.adjacent_space) {
          return 'error-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.type == 'Ceiling' || $scope.row.entity.boundary == 'Interior');
      },
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapSpaces:this',
      editDropdownOptionsArray: $scope.spacesArr,
      filter: {
        condition: function (searchTerm, cellValue) {
          if (cellValue === null) return false;
          var haystack = $scope.spacesHash[cellValue];
          return _.contains(haystack.toLowerCase(), searchTerm.toLowerCase());
        }
      },
      headerCellTemplate: 'ui-grid/customHeaderCell',
      sortingAlgorithm: $scope.data.sort($scope.spacesArr)
    }, {
      name: 'tilt',
      secondLine: $sce.trustAsHtml('&deg;'),
      enableHiding: false,
      type: 'number',
      cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.type != 'Roof') {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return $scope.row.entity.type == 'Roof';
      },
      filters: angular.copy($scope.data.numberFilter),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'wall_height',
      secondLine: $sce.trustAsHtml('ft'),
      enableHiding: false,
      type: 'number',
      cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
        if (!(row.entity.type == 'Wall' && row.entity.boundary == 'Underground')) {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.type == 'Wall' && $scope.row.entity.boundary == 'Underground');
      },
      filters: angular.copy($scope.data.numberFilter),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'exposed_perimeter',
      secondLine: $sce.trustAsHtml('ft'),
      enableHiding: false,
      type: 'number',
      cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
        if (!(row.entity.type == 'Floor' && row.entity.boundary == 'Underground')) {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.type == 'Floor' && $scope.row.entity.boundary == 'Underground');
      },
      filters: angular.copy($scope.data.numberFilter),
      headerCellTemplate: 'ui-grid/customHeaderCell'
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
          if (rowEntity.type == 'Wall' || rowEntity.type == 'Floor') {
            regex += ' [0-9]+';
          }
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

}]);
