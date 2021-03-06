cbecc.controller('SpacesVentilationCtrl', ['$scope', 'uiGridConstants', 'Shared', 'Enums', function ($scope, uiGridConstants, Shared, Enums) {
  $scope.selected = {
    space: null
  };

  $scope.applySettingsActive = false;

  // Ventilation & Exhaust UI Grid
  $scope.ventilationGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableCellEdit: false,
      enableHiding: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'conditioning_type',
      enableFiltering: false,
      filters: Shared.notFilter('Plenum'),
      visible: false
    }, {
      name: 'space_function',
      enableCellEdit: false,
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'exhaust_per_area',
      displayName: 'Per Area',
      secondLine: Shared.html('cfm / ft<sup>2</sup>'),
      enableHiding: false,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.exhaust_per_area != row.entity.exhaust_per_area_default) {
          return 'modified-cell';
        }
      },
      cellEditableCondition: $scope.data.applySettingsCondition,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'exhaust_air_changes_per_hour',
      displayName: 'Per Volume',
      secondLine: Shared.html('ACH'),
      enableHiding: false,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.exhaust_air_changes_per_hour != row.entity.exhaust_air_changes_per_hour_default) {
          return 'modified-cell';
        }
      },
      cellEditableCondition: $scope.data.applySettingsCondition,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'exhaust_per_space',
      displayName: 'Per Space',
      secondLine: Shared.html('cfm'),
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'total_exhaust',
      secondLine: Shared.html('cfm'),
      enableCellEdit: false,
      enableHiding: false,
      cellClass: 'border-left-cell',
      headerCellClass: 'border-left-cell',
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }],
    data: $scope.data.spaces,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    enableSelectAll: false,
    excessRows: 10,
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
        if (newValue != oldValue) {
          Shared.setModified();

          $scope.data.updateTotalExhaust(rowEntity);
        }
      });
    }
  };

  // Buttons
  $scope.applySettings = function () {
    $scope.applySettingsActive = true;
    $scope.data.clearAll($scope.gridApi);
    $scope.ventilationGridOptions.enableSelectAll = true;
    $scope.ventilationGridOptions.multiSelect = true;
  };

  $scope.confirmApplySettings = function () {
    var selectedSpaceIndex = $scope.data.spaces.indexOf($scope.selected.space);

    _.each($scope.gridApi.selection.getSelectedGridRows(), function (row) {
      if (row.visible) {
        var rowEntity = row.entity;
        var spaceIndex = $scope.data.spaces.indexOf(rowEntity);

        if (spaceIndex != selectedSpaceIndex) {
          Shared.setModified();

          rowEntity.exhaust_per_area = $scope.selected.space.exhaust_per_area;
          rowEntity.exhaust_air_changes_per_hour = $scope.selected.space.exhaust_air_changes_per_hour;
          rowEntity.exhaust_per_space = $scope.selected.space.exhaust_per_space;
          $scope.data.updateTotalExhaust(rowEntity);
        }
      }
    });
    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    $scope.resetApplySettings();
  };

  $scope.resetApplySettings = function () {
    $scope.selected.space = null;
    $scope.applySettingsActive = false;
    $scope.data.clearAll($scope.gridApi);
    $scope.ventilationGridOptions.enableSelectAll = false;
    $scope.ventilationGridOptions.multiSelect = false;
  };

}]);
