cbecc.controller('ZonesExhaustsCtrl', ['$scope', 'uiGridConstants', 'Shared', 'Enums', function ($scope, uiGridConstants, Shared, Enums) {

  $scope.selected = {
    exhaust: null
  };

  // find all zones that contain a space that has exhaust
  exhaustZonesArr = [];
  _.each(_.filter($scope.data.zones, {type: 'Conditioned'}), function (zone) {
    _.each(_.filter($scope.data.spaces, {thermal_zone_reference: zone.name}), function (space) {
      if (Shared.calculateTotalExhaust(space) > 0) {
        //console.log("TOTAL EXHAUST FOR ", space.name, ": ", Shared.calculateTotalExhaust(space) );
        exhaustZonesArr.push({
          id: zone.id,
          value: zone.name
        });
        // break when 1 space is found
        return false;
      }
    });
  });

  console.log("exhaustZonesArray");
  console.log(exhaustZonesArr);

  // compare exhaustZonesArr with $scope.data.exhausts to see if rows need to be added (for zones that have new spaces with exhaust)
  _.each(exhaustZonesArr, function (zone) {
    var match = _.find($scope.data.exhausts, {zone_id: zone.id});
    if (!match) {
      console.log("NO MATCH FOR zone id: ", zone.id);
      // add to array
      $scope.data.exhausts.push({
        zone_id: zone.id,
        zone_name: zone.value,
        name: zone.value + ' Exhaust System',
        type: 'Exhaust'
      })
    }
  });
  console.log("data.exhausts");
  console.log($scope.data.exhausts);


  // Exhausts UI Grid
  $scope.exhaustsGridOptions = {
    columnDefs: [{
      name: 'zone_name',
      displayName: 'Thermal Zone',
      enableHiding: false,
      enableCellEdit: false,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'fan_classification',
      displayName: 'Classification',
      field: 'fan.classification',
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.fans_classification_enums,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'fan_control_method',
      displayName: 'Control Method',
      field: 'fan.control_method',
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.fans_control_method_enums,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }],
    data: $scope.data.exhausts,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (row.isSelected) {
          $scope.selected.exhaust = row.entity;
        } else {
          // No rows selected
          $scope.selected.exhaust = null;
        }
      });
    }
  };

}]);
