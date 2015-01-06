cbecc.controller('SpacesSettingsCtrl', ['$scope', 'uiGridConstants', function ($scope, uiGridConstants) {
  // Initialize Settings UI Grid
  if (_.isEmpty($scope.data.settingsGridOptions)) {
    $scope.data.settingsGridOptions = {
      columnDefs: [{
        name: 'name',
        displayName: 'Space Name',
        enableHiding: false,
        filter: {
          condition: uiGridConstants.filter.CONTAINS
        }
      }, {
        name: 'space_function',
        enableHiding: false
      }, {
        name: 'occupant_density',
        displayName: 'Occupancy',
        enableHiding: false
      }, {
        name: 'hot_water_heating_rate',
        displayName: 'Hot Water Use',
        enableHiding: false
      }, {
        name: 'receptacle_power_density',
        displayName: 'Plug Loads',
        enableHiding: false
      }],
      data: $scope.data.spaces,
      enableCellEditOnFocus: true,
      enableFiltering: true,
      enableRowHeaderSelection: true,
      enableRowSelection: true,
      multiSelect: false,
      onRegisterApi: function (gridApi) {
        $scope.data.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          if (row.isSelected) {
            $scope.data.selectedSpace = row.entity;
          } else {
            // No rows selected
            $scope.data.selectedSpace = null;
          }
        });
      }
    };
  }
}]);
