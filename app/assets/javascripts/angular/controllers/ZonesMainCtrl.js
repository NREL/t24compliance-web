cbecc.controller('ZonesMainCtrl', ['$scope', 'Shared', 'Enums', function ($scope, Shared, Enums) {
  $scope.selected = {
    zone: null
  };

  // Zones UI Grid
  $scope.zonesGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Thermal Zone Name',
      enableHiding: false,
      filter: Shared.textFilter()
    }, {
      name: 'story',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapStories:this',
      editDropdownOptionsArray: $scope.data.storiesArr,
      filter: {
        condition: function (searchTerm, cellValue) {
          var haystack = $scope.data.storiesHash[cellValue];
          return _.contains(haystack.toLowerCase(), searchTerm.toLowerCase());
        }
      },
      sortingAlgorithm: Shared.sort($scope.data.storiesHash)
    }, {
      name: 'type',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapEnums:"zones_type_enums"',
      editDropdownOptionsArray: Enums.enumsArr.zones_type_enums,
      filter: {
        condition: function (searchTerm, cellValue) {
          var haystack = Enums.enumsArr.zones_type_enums[cellValue].value;
          return _.contains(haystack.toLowerCase(), searchTerm.toLowerCase());
        }
      },
      sortingAlgorithm: Shared.sort(Enums.enumsArr.zones_type_enums)
    }],
    data: $scope.data.zones,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (row.isSelected) {
          $scope.selected.zone = row.entity;
        } else {
          // No rows selected
          $scope.selected.zone = null;
        }
      });
    }
  };
}]);
