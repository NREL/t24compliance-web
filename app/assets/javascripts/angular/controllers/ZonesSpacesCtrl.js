cbecc.controller('ZonesSpacesCtrl', ['$scope', 'Shared', function ($scope, Shared) {
  $scope.selected = {
    space: null
  };

  $scope.zonesArr = [];
  $scope.zonesHash = {};
  _.each($scope.data.zones, function (zone, index) {
    $scope.zonesArr.push({
      id: zone.id,
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
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'building_story_id',
      displayName: 'Story',
      enableCellEdit: false,
      cellFilter: 'mapStories:this',
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
    }
  };

}]);
