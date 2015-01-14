cbecc.controller('SpacesSurfacesCtrl', ['$scope', 'uiGridConstants', 'Shared', 'Enums', function ($scope, uiGridConstants, Shared, Enums) {
  $scope.selected = {
    surface: null
  };

  $scope.applySettingsActive = false;

  $scope.editableCondition = function ($scope) {
    while (!$scope.hasOwnProperty('applySettingsActive')) {
      $scope = $scope.$parent;
    }
    return !$scope.applySettingsActive;
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

  // Surfaces UI Grid
  $scope.surfacesGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Surface Name',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'space',
      displayName: 'Space Name',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
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
      name: 'building_story_id',
      displayName: 'Story',
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
      cellEditableCondition: $scope.editableCondition,
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
        var mainScope = $scope;
        while (!mainScope.hasOwnProperty('applySettingsActive')) {
          mainScope = mainScope.$parent;
        }
        if (mainScope.applySettingsActive) return false;
        return ($scope.row.entity.type == 'Roof' || ($scope.row.entity.type == 'Wall' && $scope.row.entity.boundary == 'Exterior'));
      },
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'construction',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
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
        var mainScope = $scope;
        while (!mainScope.hasOwnProperty('applySettingsActive')) {
          mainScope = mainScope.$parent;
        }
        if (mainScope.applySettingsActive) return false;
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
        var mainScope = $scope;
        while (!mainScope.hasOwnProperty('applySettingsActive')) {
          mainScope = mainScope.$parent;
        }
        if (mainScope.applySettingsActive) return false;
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
        var mainScope = $scope;
        while (!mainScope.hasOwnProperty('applySettingsActive')) {
          mainScope = mainScope.$parent;
        }
        if (mainScope.applySettingsActive) return false;
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
        var mainScope = $scope;
        while (!mainScope.hasOwnProperty('applySettingsActive')) {
          mainScope = mainScope.$parent;
        }
        if (mainScope.applySettingsActive) return false;
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
          rowEntity.building_story_id = $scope.data.spaces[newValue].building_story_id;

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

  // Buttons
  $scope.applySettings = function () {
    $scope.applySettingsActive = true;
    $scope.data.clearAll($scope.gridApi);
    $scope.surfacesGridOptions.multiSelect = true;

    $scope.surfacesGridOptions.columnDefs[2].enableFiltering = false;
    $scope.surfacesGridOptions.columnDefs[2].filter.noTerm = true;
    $scope.surfacesGridOptions.columnDefs[2].filter.term = $scope.selected.surface.surface_type;
    $scope.gridApi.core.notifyDataChange($scope.gridApi.grid, uiGridConstants.dataChange.COLUMN);
  };

  $scope.confirmApplySettings = function () {
    var replacement = {
      area: $scope.selected.surface.area,
      azimuth: $scope.selected.surface.azimuth,
      construction: $scope.selected.surface.construction,
      adjacent_space: $scope.selected.surface.adjacent_space,
      tilt: $scope.selected.surface.tilt,
      wall_height: $scope.selected.surface.wall_height,
      exposed_perimeter: $scope.selected.surface.exposed_perimeter
    };
    var rows = $scope.gridApi.selection.getSelectedRows();
    _.each(rows, function (row) {
      _.merge(row, replacement);
    });
    $scope.gridApi.core.notifyDataChange($scope.gridApi.grid, uiGridConstants.dataChange.EDIT);
    $scope.resetApplySettings();
  };

  $scope.resetApplySettings = function () {
    $scope.selected.surface = null;
    $scope.applySettingsActive = false;
    $scope.data.clearAll($scope.gridApi);
    $scope.surfacesGridOptions.multiSelect = false;

    $scope.surfacesGridOptions.columnDefs[2].enableFiltering = true;
    $scope.surfacesGridOptions.columnDefs[2].filter.noTerm = false;
    $scope.surfacesGridOptions.columnDefs[2].filter.term = '';
    $scope.gridApi.core.notifyDataChange($scope.gridApi.grid, uiGridConstants.dataChange.COLUMN);
  };

}]);
