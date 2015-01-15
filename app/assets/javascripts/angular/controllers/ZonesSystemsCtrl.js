cbecc.controller('ZonesSystemsCtrl', ['$scope', 'uiGridConstants', 'Shared', function ($scope, uiGridConstants, Shared) {

  $scope.selected = {
    zone: null
  };

  // array of plenum zones for dropdown
  $scope.plenumZonesArr = [];
  $scope.plenumZonesHash = {};
  _.each($scope.data.zones, function (zone, index) {
    if (zone.type === 'Plenum') {
      $scope.plenumZonesArr.push({
        id: zone.name,
        value: zone.name
      });
      $scope.plenumZonesHash[index] = zone.name;
    }

  });

  // array of (non-exhaust) HVAC systems
  $scope.systemsArr = [];
  _.each($scope.data.non_exhaust_systems, function (system, index) {
    $scope.systemsArr.push({
      id: system.name,
      value: system.name
    });
  });

  // Systems UI Grid
  $scope.systemsGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Thermal Zone',
      enableHiding: false,
      enableCellEdit: false,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    },{
      name: 'type',
      enableFiltering: false,
      filter: {
        condition: uiGridConstants.filter.EXACT,
        noTerm: true,
        term: 'Conditioned'
      },
      visible: false
    }, {
      name: 'primary_air_conditioning_system_reference',
      displayName: 'Primary HVAC System',
      editableCellTemplate: 'ui-grid/dropdownEditor',
      enableHiding: false,
      filter: Shared.textFilter(),
      editDropdownOptionsArray: $scope.systemsArr,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'supply_plenum_zone_reference',
      displayName: 'Supply Plenum Zone',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: $scope.plenumZonesArr,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    },
      {
        name: 'return_plenum_zone_reference',
        displayName: 'Return Plenum Zone',
        enableHiding: false,
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownOptionsArray: $scope.plenumZonesArr,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCell'
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
