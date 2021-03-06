cbecc.controller('ZonesSystemsCtrl', ['$scope', 'Shared', function ($scope, Shared) {
  // array of plenum zones for dropdown
  $scope.plenumZonesArr = $scope.data.plenumCompatibleZones();

  // array of (non-exhaust) HVAC systems
  $scope.systemsArr = [];
  _.each($scope.data.non_exhaust_systems, function (system, index) {
    $scope.systemsArr.push({
      id: system.name,
      value: system.name
    });
  });

  // Systems UI Grid
  $scope.systemsGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Thermal Zone',
      enableHiding: false,
      enableCellEdit: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'type',
      enableFiltering: false,
      filters: Shared.exactFilter('Conditioned'),
      visible: false
    }, {
      name: 'primary_air_conditioning_system_reference',
      displayName: 'Primary HVAC System',
      editableCellTemplate: 'ui-grid/dropdownEditor',
      enableHiding: false,
      filters: Shared.textFilter(),
      editDropdownOptionsArray: $scope.systemsArr,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'supply_plenum_zone_reference',
      displayName: 'Supply Plenum Zone',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: $scope.plenumZonesArr,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'return_plenum_zone_reference',
      displayName: 'Return Plenum Zone',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: $scope.plenumZonesArr,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }],
    data: $scope.data.zones,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        if (newValue != oldValue) {
          Shared.setModified();
        }
      });
    }
  };

}]);
