cbecc.controller('ZonesSpacesCtrl', ['$scope', 'Shared', function ($scope, Shared) {
  $scope.selected = {
    space: null
  };

  $scope.zonesArr = [];
  $scope.zonesHash = {};
  _.each($scope.data.zones, function (zone, index) {
    $scope.zonesArr.push({
      id: index,
      value: zone.name
    });
    $scope.zonesHash[index] = zone.name;
  });

  // Spaces UI Grid
  $scope.spacesGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableHiding: false,
      enableCellEdit: false,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'building_story_id',
      displayName: 'Story',
      enableCellEdit: false,
      cellFilter: 'mapStories:this',
      enableHiding: false,
      filter: Shared.enumFilter($scope.data.storiesHash),
      headerCellTemplate: 'ui-grid/customHeaderCell',
      sortingAlgorithm: Shared.sort($scope.data.storiesHash)
    }, {
      name: 'thermal_zone',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapZones:this',
      editDropdownOptionsArray: $scope.zonesArr,
      filter: Shared.enumFilter($scope.zonesHash),
      headerCellTemplate: 'ui-grid/customHeaderCell',
      sortingAlgorithm: Shared.sort($scope.zonesArr)
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
    }
  };

}]);
