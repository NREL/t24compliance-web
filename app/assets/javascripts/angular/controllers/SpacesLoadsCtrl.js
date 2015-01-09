cbecc.controller('SpacesLoadsCtrl', ['$scope', '$sce', 'uiGridConstants', function ($scope, $sce, uiGridConstants) {
  $scope.selectedSpace = null;

  $scope.applySettingsActive = false;

  $scope.editableCondition = function ($scope) {
    while (!$scope.hasOwnProperty('applySettingsActive')) {
      $scope = $scope.$parent;
    }
    return !$scope.applySettingsActive;
  };

  $scope.headerCell = "<div ng-class=\"{ 'sortable': sortable }\"><div class=\"ui-grid-vertical-bar\">&nbsp;</div><div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><span>{{ col.displayName CUSTOM_FILTERS }}</span> <span ui-grid-visible=\"col.sort.direction\" ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\">&nbsp;</span><br><small ng-bind-html=\"col.colDef.secondLine\"></small></div><div class=\"ui-grid-column-menu-button\" ng-if=\"grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false\" class=\"ui-grid-column-menu-button\" ng-click=\"toggleMenu($event)\"><i class=\"ui-grid-icon-angle-down\">&nbsp;</i></div><div ng-if=\"filterable\" class=\"ui-grid-filter-container\" ng-repeat=\"colFilter in col.filters\"><input type=\"text\" class=\"ui-grid-filter-input\" ng-model=\"colFilter.term\" ng-attr-placeholder=\"{{colFilter.placeholder || ''}}\"><div class=\"ui-grid-filter-button\" ng-click=\"colFilter.term = null\"><i class=\"ui-grid-icon-cancel\" ng-show=\"!!colFilter.term\">&nbsp;</i><!-- use !! because angular interprets 'f' as false --></div></div></div>";

  // Loads UI Grid
  $scope.loadsGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableCellEdit: false,
      enableHiding: false,
      headerCellTemplate: $scope.headerCell,
      filter: angular.copy($scope.data.textFilter)
    }, {
      name: 'process_electric',
      secondLine: $sce.trustAsHtml('W/ft<sup>2</sup>'),
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: $scope.headerCell,
      type: 'number',
      filters: angular.copy($scope.data.numberFilter)
    }, {
      name: 'refrigeration',
      secondLine: $sce.trustAsHtml('W/ft<sup>2</sup>'),
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: $scope.headerCell,
      type: 'number',
      filters: angular.copy($scope.data.numberFilter)
    }, {
      name: 'elevator_count',
      secondLine: $sce.trustAsHtml('ElevMechan/Space'),
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: $scope.headerCell,
      type: 'number',
      filters: angular.copy($scope.data.numberFilter)
    }, {
      name: 'escalator_count',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: $scope.headerCell,
      type: 'number',
      filters: angular.copy($scope.data.numberFilter)
    }, {
      name: 'loads_radiant_fraction',
      enableHiding: false,
      cellClass: 'border-left-cell',
      headerCellClass: 'border-left-cell',
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: $scope.headerCell,
      type: 'number',
      filters: angular.copy($scope.data.numberFilter)
    }, {
      name: 'loads_latent_fraction',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: $scope.headerCell,
      type: 'number',
      filters: angular.copy($scope.data.numberFilter)
    }, {
      name: 'loads_lost_fraction',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: $scope.headerCell,
      type: 'number',
      filters: angular.copy($scope.data.numberFilter)
    }, {
      name: 'elevator_lost_fraction',
      enableHiding: false,
      cellClass: 'border-left-cell',
      headerCellClass: 'border-left-cell',
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: $scope.headerCell,
      type: 'number',
      filters: angular.copy($scope.data.numberFilter)
    }, {
      name: 'escalator_lost_fraction',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      headerCellTemplate: $scope.headerCell,
      type: 'number',
      filters: angular.copy($scope.data.numberFilter)
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
