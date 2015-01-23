cbecc.controller('ModalLuminaireEditorCtrl', ['$scope', '$modalInstance', 'Shared', 'Enums', 'params', function ($scope, $modalInstance, Shared, Enums, params) {
  $scope.data = params.data;
  $scope.selected = {
    luminaire: null
  };

  $scope.gridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Luminaire Name',
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      filter: Shared.textFilter()
    }, {
      name: 'power',
      type: 'number',
      secondLine: Shared.html('W'),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      filters: Shared.numberFilter()
    }, {
      name: 'fixture_type',
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.luminaires_fixture_type_enums,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      filter: Shared.textFilter()
    }, {
      name: 'lamp_type',
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.luminaires_lamp_type_enums,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      filter: Shared.textFilter()
    }],
    data: $scope.data.luminaires,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (row.isSelected) {
          $scope.selected.luminaire = row.entity;
        } else {
          // No rows selected
          $scope.selected.luminaire = null;
        }
      });
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        if (colDef.name == 'fixture_type' && newValue != oldValue) {
          _.merge(rowEntity, $scope.data.luminaireHeatGain(rowEntity.fixture_type));
        }
      });
    }
  };

  $scope.close = function () {
    $modalInstance.dismiss();
  };
}]);
