cbecc.controller('ZonesSpacesCtrl', [
  '$scope', 'Shared', function ($scope, Shared) {

    // Spaces UI Grid
    $scope.spacesGridOptions = {
      columnDefs: [{
        name: 'space_name',
        enableHiding: false,
        filter: Shared.textFilter()
      }, {
        name: 'story',
        enableHiding: false,
        enableCellEdit: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/customHeaderCell'

      }, {
        name: 'thermal_zone',
        enableHiding: false,
        editableCellTemplate: 'ui-grid/dropdownEditor',
        cellFilter: 'mapZones:this',
        editDropdownOptionsArray: $scope.data.zones,
        filter: Shared.enumFilter($scope.data.zones),
        sortingAlgorithm: Shared.sort($scope.data.zones)
      }],
      data: $scope.data.spaces_to_zones,
      enableCellEditOnFocus: true,
      enableFiltering: true,
      enableRowHeaderSelection: true,
      enableRowSelection: true,
      multiSelect: false,
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          if (row.isSelected) {
            $scope.selected = row.entity;
          } else {
            // No rows selected
            $scope.selected = null;
          }
        });
      }
    };

}]);
