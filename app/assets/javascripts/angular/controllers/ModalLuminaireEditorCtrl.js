cbecc.controller('ModalLuminaireEditorCtrl', ['$scope', '$interval', '$modalInstance', 'Shared', 'Enums', 'params', function ($scope, $interval, $modalInstance, Shared, Enums, params) {
  $scope.data = params.data;
  $scope.selected = {
    luminaire: null
  };
  $scope.editable = true;

  $scope.luminaireGridApi = params.luminaireGridApi;

  if (typeof (params.luminaireIndex) !== 'undefined') $scope.editable = false;

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
    enableCellEditOnFocus: $scope.editable,
    enableFiltering: true,
    enableRowHeaderSelection: $scope.editable,
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
      if ($scope.editable) {
        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
          if (newValue != oldValue) {
            Shared.setModified();

            if (colDef.name == 'name') {
              $scope.data.updateLumHash();
            } else if (colDef.name == 'fixture_type') {
              _.merge(rowEntity, $scope.data.luminaireHeatGain(rowEntity.fixture_type));
            } else if (colDef.name == 'power') {
              _.each($scope.data.lightingSystems, function (lightingSystem) {
                var luminaire = lightingSystem.luminaire_reference[0];
                if (luminaire) {
                  lightingSystem.power = $scope.data.luminaires[luminaire].power * lightingSystem.luminaire_count[0];
                }
              });
            }
            _.each($scope.data.spaces, function (space, spaceIndex) {
              if (space.lighting_input_method == 'Luminaires') $scope.data.calculateLPD(spaceIndex);
            });
          }
        });
      } else {
        $interval(function () {
          $scope.gridApi.selection.selectRow($scope.gridOptions.data[params.luminaireIndex]);
        }, 0, 1);
      }
    }
  };

  $scope.close = function () {
    $modalInstance.close();
  };

  $scope.ok = function () {
    var luminaireIndex = $scope.data.luminaires.indexOf($scope.selected.luminaire);
    $modalInstance.close(luminaireIndex);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
