cbecc.controller('SpacesLightingCtrl', ['$scope', '$modal', 'Shared', 'Enums', function ($scope, $modal, Shared, Enums) {
  $scope.selected = {
    space: null
  };

  $scope.applySettingsActive = false;

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
      name: 'interior_lighting_power_density_regulated',
      displayName: 'Regulated LPD',
      secondLine: Shared.html('W / ft<sup>2</sup>'),
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'interior_lighting_power_density_non_regulated',
      displayName: 'Unregulated LPD',
      secondLine: Shared.html('W / ft<sup>2</sup>'),
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
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
