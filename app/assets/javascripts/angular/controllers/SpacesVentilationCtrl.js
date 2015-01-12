cbecc.controller('SpacesVentilationCtrl', ['$scope', 'uiGridConstants', 'Shared', 'Enums', function ($scope, uiGridConstants, Shared, Enums) {
  $scope.selected = {
    space: null
  };

  $scope.applySettingsActive = false;

  $scope.editableCondition = function ($scope) {
    while (!$scope.hasOwnProperty('applySettingsActive')) {
      $scope = $scope.$parent;
    }
    return !$scope.applySettingsActive;
  };

  // Ventilation & Exhaust UI Grid
  $scope.ventilationGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableCellEdit: false,
      enableHiding: false,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'space_function',
      enableCellEdit: false,
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapEnums:"spaces_space_function_enums"',
      filter: Shared.enumFilter(Enums.enumsArr.spaces_space_function_enums),
      headerCellTemplate: 'ui-grid/customHeaderCell',
      sortingAlgorithm: Shared.sort(Enums.enumsArr.spaces_space_function_enums)
    }, {
      name: 'exhaust_per_area',
      displayName: 'Per Area',
      secondLine: Shared.html('cfm / ft<sup>2</sup>'),
      enableHiding: false,
      cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.exhaust_per_area != row.entity.exhaust_per_area_default) {
          return 'red-cell';
        }
      },
      cellEditableCondition: $scope.editableCondition,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'exhaust_air_changes_per_hour',
      displayName: 'Per Volume',
      secondLine: Shared.html('ACH'),
      enableHiding: false,
      cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.exhaust_air_changes_per_hour != row.entity.exhaust_air_changes_per_hour_default) {
          return 'red-cell';
        }
      },
      cellEditableCondition: $scope.editableCondition,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'exhaust_per_space',
      displayName: 'Per Space',
      secondLine: Shared.html('cfm'),
      enableHiding: false,
      cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.exhaust_per_space != row.entity.exhaust_per_space_default) {
          return 'red-cell';
        }
      },
      cellEditableCondition: $scope.editableCondition,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'total_exhaust',
      secondLine: Shared.html('cfm'),
      enableCellEdit: false,
      enableHiding: false,
      cellClass: 'border-left-cell',
      headerCellClass: 'border-left-cell',
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }],
    data: $scope.data.spaces,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (!$scope.applySettingsActive) {
          if (row.isSelected) {
            $scope.selected.space = row.entity;
          } else {
            // No rows selected
            $scope.selected.space = null;
          }
        }
      });
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        $scope.data.updateTotalExhaust(rowEntity);
      });
    }
  };

  // Buttons
  $scope.applySettings = function () {
    $scope.applySettingsActive = true;
    $scope.data.clearAll($scope.gridApi);
    $scope.ventilationGridOptions.multiSelect = true;
  };

  $scope.confirmApplySettings = function () {
    var replacement = {
      exhaust_per_area: $scope.selected.space.exhaust_per_area,
      exhaust_air_changes_per_hour: $scope.selected.space.exhaust_air_changes_per_hour,
      exhaust_per_space: $scope.selected.space.exhaust_per_space
    };
    var rows = $scope.gridApi.selection.getSelectedRows();
    _.each(rows, function (row) {
      _.merge(row, replacement);
      $scope.data.updateTotalExhaust(row);
    });
    $scope.gridApi.core.notifyDataChange($scope.gridApi.grid, uiGridConstants.dataChange.EDIT);
    $scope.resetApplySettings();
  };

  $scope.resetApplySettings = function () {
    $scope.selected.space = null;
    $scope.applySettingsActive = false;
    $scope.data.clearAll($scope.gridApi);
    $scope.ventilationGridOptions.multiSelect = false;
  };

}]);
