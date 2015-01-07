cbecc.controller('SpacesSettingsCtrl', ['$scope', '$window', function ($scope, $window) {
  // Settings UI Grid
  $scope.settingsGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableHiding: false,
      filter: angular.copy($scope.data.textFilter)
    }, {
      name: 'space_function',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapEnums:"spaces_space_function_enums"',
      editDropdownOptionsArray: $window.enumsArr.spaces_space_function_enums,
      filter: {
        condition: function (searchTerm, cellValue) {
          var haystack = $window.enumsArr.spaces_space_function_enums[cellValue].value;
          return _.contains(haystack.toLowerCase(), searchTerm.toLowerCase());
        }
      },
      sortingAlgorithm: $scope.data.sort($window.enumsArr.spaces_space_function_enums)
    }, {
      name: 'occupant_density',
      displayName: 'Occupancy',
      enableHiding: false,
      filters: angular.copy($scope.data.numberFilter)
    }, {
      name: 'hot_water_heating_rate',
      displayName: 'Hot Water Use',
      enableHiding: false,
      filters: angular.copy($scope.data.numberFilter)
    }, {
      name: 'receptacle_power_density',
      displayName: 'Plug Loads',
      enableHiding: false,
      filters: angular.copy($scope.data.numberFilter)
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
}]);