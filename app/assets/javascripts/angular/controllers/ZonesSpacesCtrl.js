cbecc.controller('ZonesSpacesCtrl', ['$scope', '$log', 'Shared', function ($scope, $log, Shared) {
  $scope.selected = {
    space: null
  };

  // thermal zone references array for ZoneSpaces tab
  $scope.zonesArr = [{
    id: "",
    value: ""
  }];
  $scope.zonesHash = {};
  _.each($scope.data.zones, function (zone, index) {
    $scope.zonesArr.push({
      id: zone.id,
      value: zone.name
    });
    $scope.zonesHash[index] = zone.name;
  });
  $log.debug('ZONES Arr');
  $log.debug($scope.zonesArr);

  // Spaces UI Grid
  $scope.spacesGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableHiding: false,
      enableCellEdit: false,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'building_story_id',
      displayName: 'Story',
      enableCellEdit: false,
      cellFilter: 'mapHash:grid.appScope.data.storiesHash',
      enableHiding: false,
      filter: Shared.enumFilter($scope.data.storiesHash),
      headerCellTemplate: 'ui-grid/cbeccHeaderCell',
      sortingAlgorithm: Shared.sort($scope.data.storiesHash)
    }, {
      name: 'thermal_zone_reference',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownIdLabel: 'value',
      editDropdownOptionsArray: $scope.zonesArr,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
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
        if (row.isSelected) {
          $scope.selected.space = row.entity;
        } else {
          // No rows selected
          $scope.selected.space = null;
        }
      });
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        if (newValue != oldValue) {
          Shared.setModified();
        }
      });
    }
  };

}]);
