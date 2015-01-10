cbecc.controller('SpacesLoadsCtrl', ['$scope', '$sce', 'uiGridConstants', 'Shared', function ($scope, $sce, uiGridConstants, Shared) {
  $scope.selectedSpace = null;

  $scope.applySettingsActive = false;

  $scope.editableCondition = function ($scope) {
    while (!$scope.hasOwnProperty('applySettingsActive')) {
      $scope = $scope.$parent;
    }
    return !$scope.applySettingsActive;
  };

  // Loads UI Grid
  $scope.loadsGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableCellEdit: false,
      enableHiding: false,
      headerCellTemplate: 'ui-grid/customHeaderCell',
      filter: Shared.textFilter()
    }, {
      name: 'process_electric',
      secondLine: $sce.trustAsHtml('W / ft<sup>2</sup>'),
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: 'ui-grid/customHeaderCell',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'refrigeration',
      secondLine: $sce.trustAsHtml('W / ft<sup>2</sup>'),
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: 'ui-grid/customHeaderCell',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'elevator_count',
      secondLine: $sce.trustAsHtml('ElevMechan / Space'),
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: 'ui-grid/customHeaderCell',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'escalator_count',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: 'ui-grid/customHeaderCell',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'loads_radiant_fraction',
      enableHiding: false,
      cellClass: 'border-left-cell',
      headerCellClass: 'border-left-cell',
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: 'ui-grid/customHeaderCell',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'loads_latent_fraction',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: 'ui-grid/customHeaderCell',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'loads_lost_fraction',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: 'ui-grid/customHeaderCell',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'elevator_lost_fraction',
      enableHiding: false,
      cellClass: 'border-left-cell',
      headerCellClass: 'border-left-cell',
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: 'ui-grid/customHeaderCell',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'escalator_lost_fraction',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: 'ui-grid/customHeaderCell',
      type: 'number',
      filters: Shared.numberFilter()
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
            $scope.selectedSpace = row.entity;
          } else {
            // No rows selected
            $scope.selectedSpace = null;
          }
        }
      });
    }
  };

  // Buttons
  $scope.applySettings = function () {
    $scope.applySettingsActive = true;
    $scope.clearAll();
    $scope.loadsGridOptions.multiSelect = true;
  };

  $scope.confirmApplySettings = function () {
    var replacement = {
      process_electric: $scope.selectedSpace.process_electric,
      refrigeration: $scope.selectedSpace.refrigeration,
      elevator_count: $scope.selectedSpace.elevator_count,
      escalator_count: $scope.selectedSpace.escalator_count,
      loads_radiant_fraction: $scope.selectedSpace.loads_radiant_fraction,
      loads_latent_fraction: $scope.selectedSpace.loads_latent_fraction,
      loads_lost_fraction: $scope.selectedSpace.loads_lost_fraction,
      elevator_lost_fraction: $scope.selectedSpace.elevator_lost_fraction,
      escalator_lost_fraction: $scope.selectedSpace.escalator_lost_fraction
    };
    var rows = $scope.gridApi.selection.getSelectedRows();
    _.each(rows, function (row) {
      _.merge(row, replacement);
    });
    $scope.resetApplySettings();
  };

  $scope.resetApplySettings = function () {
    $scope.selectedSpace = null;
    $scope.applySettingsActive = false;
    $scope.clearAll();
    $scope.loadsGridOptions.multiSelect = false;
  };

  $scope.selectAll = function () {
    $scope.gridApi.selection.selectAllRows();
  };
  $scope.clearAll = function () {
    $scope.gridApi.selection.clearSelectedRows();
  };

}]);
