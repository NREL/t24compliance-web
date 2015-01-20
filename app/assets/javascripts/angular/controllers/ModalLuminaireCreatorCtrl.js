cbecc.controller('ModalLuminaireCreatorCtrl', ['$scope', '$modalInstance', 'Shared', 'Enums', function ($scope, $modalInstance, Shared, Enums) {
  $scope.data = [{
    name: null,
    power: null,
    fixture_type: Enums.enums.luminaires_fixture_type_enums[0],
    lamp_type: Enums.enums.luminaires_lamp_type_enums[0]
  }];

  $scope.gridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Luminaire Name'
    }, {
      name: 'power',
      type: 'number',
      secondLine: Shared.html('W / ft<sup>2</sup>'),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'fixture_type',
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.luminaires_fixture_type_enums
    }, {
      name: 'lamp_type',
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.luminaires_lamp_type_enums
    }],
    data: 'data',
    enableCellEditOnFocus: true,
    enableColumnMenus: false,
    enableSorting: false
  };

  $scope.ok = function () {
    $modalInstance.close($scope.gridOptions.data);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
