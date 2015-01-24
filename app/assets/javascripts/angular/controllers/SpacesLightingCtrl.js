cbecc.controller('SpacesLightingCtrl', ['$scope', '$modal', 'uiGridConstants', 'Shared', 'Enums', function ($scope, $modal, uiGridConstants, Shared, Enums) {
  $scope.selected = {
    space: null
  };

  $scope.applySettingsActive = false;

  $scope.showLuminaires = function () {
    return !_.isEmpty(_.find($scope.data.spaces, {lighting_input_method: 'Luminaires'}));
  };

  // LPD UI Grid
  $scope.lpdGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableCellEdit: false,
      enableHiding: false,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      filter: Shared.textFilter()
    }, {
      name: 'lighting_input_method',
      enableHiding: false,
      cellEditableCondition: function ($scope) {
        if ($scope.grid.appScope.applySettingsActive) return false;
        return !_.contains(['High-Rise Residential Living Spaces', 'Hotel/Motel Guest Room'], $scope.row.entity.space_function);
      },
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: $scope.data.lightingInputMethodsArr,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      filter: Shared.textFilter()
    }, {
      name: 'interior_lighting_power_density_regulated',
      displayName: 'Regulated LPD',
      secondLine: Shared.html('W / ft<sup>2</sup>'),
      enableHiding: false,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.lighting_input_method == 'Luminaires') {
          return 'disabled-cell';
        } else if (row.entity.interior_lighting_power_density_regulated != row.entity.interior_lighting_power_density_regulated_default) {
          return 'modified-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        if ($scope.grid.appScope.applySettingsActive) return false;
        return $scope.row.entity.lighting_input_method != 'Luminaires';
      },
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'interior_lighting_power_density_non_regulated',
      displayName: 'Unregulated LPD',
      secondLine: Shared.html('W / ft<sup>2</sup>'),
      enableHiding: false,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.lighting_input_method == 'Luminaires') {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        if ($scope.grid.appScope.applySettingsActive) return false;
        return $scope.row.entity.lighting_input_method != 'Luminaires';
      },
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
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
      $scope.lpdGridApi = gridApi;
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
    }
  };

  // Luminaire UI Grid
  $scope.luminaireGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableCellEdit: false,
      enableHiding: false,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell',
      filter: Shared.textFilter()
    }],
    data: [],
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.luminaireGridApi = gridApi;
    }
  };

  // Modal Settings
  $scope.openLuminaireEditorModal = function () {
    var modalInstance = $modal.open({
      backdrop: 'static',
      controller: 'ModalLuminaireEditorCtrl',
      templateUrl: 'spaces/luminaireEditor.html',
      windowClass: 'wide-modal',
      resolve: {
        params: function () {
          return {
            data: $scope.data
          };
        }
      }
    });

    modalInstance.result.then(function (data) {
      console.log(data);
    }, function () {
      // Modal canceled
    });
  };

}]);
