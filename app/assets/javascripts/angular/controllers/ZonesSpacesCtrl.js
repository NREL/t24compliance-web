cbecc.controller('ZonesSpacesCtrl', ['$scope', '$log', 'Shared', function ($scope, $log, Shared) {
  $scope.selected = {
    space: null
  };

  // plenum & non-plenum thermal zone references array for ZoneSpaces tab
  $scope.plenumZonesArr = $scope.data.plenumCompatibleZones();
  $scope.nonPlenumZonesArr = $scope.data.nonPlenumCompatibleZones();

  _.each($scope.data.spaces, function (space) {
    if (space.conditioning_type == 'Plenum'){
      space.zoneOptions = $scope.plenumZonesArr;
    }
    else {
      space.zoneOptions = $scope.nonPlenumZonesArr;
    }
  });

  // Spaces UI Grid
  $scope.spacesGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableHiding: false,
      enableCellEdit: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'building_story_id',
      displayName: 'Story',
      enableCellEdit: false,
      cellFilter: 'mapHash:grid.appScope.data.storiesHash',
      enableHiding: false,
      filters: Shared.enumFilter($scope.data.storiesHash),
      headerCellTemplate: 'ui-grid/cbeccHeaderCell',
      sortingAlgorithm: Shared.sort($scope.data.storiesHash)
    }, {
      name: 'thermal_zone_reference',
      display_name: 'Thermal Zone',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownIdLabel: 'value',
      editDropdownRowEntityOptionsArrayPath: 'zoneOptions',
      filters: Shared.textFilter(),
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

          // update exhaust systems
          Shared.updateExhaustSystems($scope.data.zones, $scope.data.spaces, $scope.data.exhausts);
        }

      });
    }
  };

}]);
