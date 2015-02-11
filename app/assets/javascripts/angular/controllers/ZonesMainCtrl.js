cbecc.controller('ZonesMainCtrl', ['$scope', 'uiGridConstants', 'Shared', 'Enums', function ($scope, uiGridConstants, Shared, Enums) {
  $scope.selected = {
    zone: null
  };

  $scope.applySettingsActive = false;

  // Zones UI Grid
  $scope.zonesGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Thermal Zone Name',
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      filters: Shared.textFilter()
      // }, {
      //   name: 'building_story_id',
      //   displayName: 'Story',
      //   enableHiding: false,
      //   cellEditableCondition: $scope.data.applySettingsCondition,
      //   editableCellTemplate: 'ui-grid/dropdownEditor',
      //   cellFilter: 'mapHash:grid.appScope.data.storiesHash',
      //   editDropdownOptionsArray: $scope.data.storiesArr,
      //   filters: Shared.enumFilter($scope.data.storiesHash),
      //   sortingAlgorithm: Shared.sort($scope.data.storiesHash)
    }, {
      name: 'type',
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.zones_type_enums
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
        if (!$scope.applySettingsActive) {
          if (row.isSelected) {
            $scope.selected.zone = row.entity;
          } else {
            // No rows selected
            $scope.selected.zone = null;
          }
        }
      });
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        if (newValue != oldValue) {
          Shared.setModified();

          var zoneIndex = $scope.data.zones.indexOf(rowEntity);
          if (colDef.name == 'name') {
            var unique = Shared.checkUnique($scope.data.zones, newValue, zoneIndex);
            if (!unique) {
              rowEntity.name = oldValue;
            } else {
              // update space 'thermal_zone_reference'
              _.each($scope.data.spaces, function (space) {
                if (space.thermal_zone_reference == oldValue) space.thermal_zone_reference = newValue;
              });
              // plenum zones must also update supply / return plenum array and zone references on systems tab
              if (rowEntity.type == 'Plenum') {
                _.each($scope.plenumZonesArr, function (zone) {
                  if (zone.id == oldValue) {
                    zone.id = newValue;
                    zone.value = newValue;
                  }
                });
                _.each($scope.data.zones, function (zone) {
                  if (zone.supply_plenum_zone_reference == oldValue) zone.supply_plenum_zone_reference = newValue;
                  if (zone.return_plenum_zone_reference == oldValue) zone.return_plenum_zone_reference = newValue;
                });
              }
              // update zone name on exhausts tab
              _.each($scope.data.exhausts, function (sys) {
                if (sys.zone_name == oldValue) sys.zone_name = newValue;
              });
              // update zone name on terminals tab
              _.each($scope.data.terminals, function (terminal) {
                if (terminal.zone_served_reference == oldValue) terminal.zone_served_reference = newValue;
              });
            }
          } else if (colDef.name == 'type') {
            $scope.updateType(rowEntity, zoneIndex, newValue, oldValue);
          }
        }
      });
    }
  };

  $scope.updateType = function (rowEntity, zoneIndex, newValue, oldValue) {
    if (oldValue == 'Plenum') {
      // clear out plenum references if zone type is no longer 'Plenum'
      _.each($scope.data.zones, function (zone) {
        if (zone.supply_plenum_zone_reference == rowEntity.name) zone.supply_plenum_zone_reference = '';
        if (zone.return_plenum_zone_reference == rowEntity.name) zone.return_plenum_zone_reference = '';
      });
    }
  };

  // Buttons
  $scope.applySettings = function () {
    $scope.applySettingsActive = true;
    $scope.data.clearAll($scope.gridApi);
    $scope.zonesGridOptions.multiSelect = true;
  };

  $scope.confirmApplySettings = function () {
    var selectedRowEntity = angular.copy($scope.selected.zone);
    var selectedZoneIndex = $scope.data.zones.indexOf($scope.selected.zone);

    _.each($scope.gridApi.selection.getSelectedGridRows(), function (row) {
      if (row.visible) {
        var rowEntity = row.entity;
        var zoneIndex = $scope.data.zones.indexOf(rowEntity);

        if (zoneIndex != selectedZoneIndex) {
          Shared.setModified();

          rowEntity.type = $scope.selected.zone.type;
          $scope.updateType(rowEntity, zoneIndex, $scope.selected.zone.type, selectedRowEntity.zone);
        }
      }
    });
    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    $scope.resetApplySettings();
  };

  $scope.resetApplySettings = function () {
    $scope.selected.zone = null;
    $scope.applySettingsActive = false;
    $scope.data.clearAll($scope.gridApi);
    $scope.zonesGridOptions.multiSelect = false;
  };

}]);
