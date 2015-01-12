cbecc.controller('SpacesSurfacesCtrl', ['$scope', 'Shared', 'Enums', function ($scope, Shared, Enums) {
  $scope.selected = {
    surface: null
  };

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

  // TODO make this global?
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
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'space',
      displayName: 'Space Name',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapSpaces:this',
      editDropdownOptionsArray: $scope.spacesArr,
      filter: Shared.enumFilter($scope.spacesHash),
      headerCellTemplate: 'ui-grid/customHeaderCell',
      sortingAlgorithm: Shared.sort($scope.spacesArr)
    }, {
      name: 'surface_type',
      enableCellEdit: false,
      enableHiding: false,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'story',
      enableCellEdit: false,
      cellFilter: 'mapStories:this',
      enableHiding: false,
      filter: Shared.enumFilter($scope.data.storiesHash),
      headerCellTemplate: 'ui-grid/customHeaderCell',
      sortingAlgorithm: Shared.sort($scope.data.storiesHash)
    }, {
      name: 'area',
      secondLine: Shared.html('ft<sup>2</sup>'),
      enableHiding: false,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'azimuth',
      secondLine: Shared.html('&deg;'),
      enableHiding: false,
      type: 'number',
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (!(row.entity.type == 'Roof' || (row.entity.type == 'Wall' && row.entity.boundary == 'Exterior'))) {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.type == 'Roof' || ($scope.row.entity.type == 'Wall' && $scope.row.entity.boundary == 'Exterior'));
      },
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'construction',
      enableHiding: false,
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'adjacent_space',
      enableHiding: false,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
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
      filter: Shared.enumFilter($scope.spacesHash),
      headerCellTemplate: 'ui-grid/customHeaderCell',
      sortingAlgorithm: Shared.sort($scope.spacesArr)
    }, {
      name: 'tilt',
      secondLine: Shared.html('&deg;'),
      enableHiding: false,
      type: 'number',
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.type != 'Roof') {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return $scope.row.entity.type == 'Roof';
      },
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'wall_height',
      secondLine: Shared.html('ft'),
      enableHiding: false,
      type: 'number',
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (!(row.entity.type == 'Wall' && row.entity.boundary == 'Underground')) {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.type == 'Wall' && $scope.row.entity.boundary == 'Underground');
      },
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'exposed_perimeter',
      secondLine: Shared.html('ft'),
      enableHiding: false,
      type: 'number',
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (!(row.entity.type == 'Floor' && row.entity.boundary == 'Underground')) {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.type == 'Floor' && $scope.row.entity.boundary == 'Underground');
      },
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }],
    data: $scope.data.surfaces,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (row.isSelected) {
          $scope.selected.surface = row.entity;
        } else {
          // No rows selected
          $scope.selected.surface = null;
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
