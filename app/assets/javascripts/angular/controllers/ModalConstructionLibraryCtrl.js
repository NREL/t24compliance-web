cbecc.controller('ModalConstructionLibraryCtrl', ['$scope', '$modalInstance', '$interval', 'uiGridConstants', 'Shared', 'params', function ($scope, $modalInstance, $interval, uiGridConstants, Shared, params) {
  params.data.then(function (data) {
    $scope.data = data;
  });
  $scope.title = params.type;
  $scope.layerData = [];
  $scope.selected = null;

  if (params.type == 'Exterior Wall Construction') {
    $scope.type = 'ExteriorWall';
  } else if (params.type == 'Interior Wall Construction') {
    $scope.type = 'InteriorWall';
  } else if (params.type == 'Underground Wall Construction') {
    $scope.type = 'UndergroundWall';
  } else if (params.type == 'Roof Construction') {
    $scope.type = 'Roof';
  } else if (params.type == 'Interior Floor Construction') {
    $scope.type = 'InteriorFloor';
  } else if (params.type == 'Exterior Floor Construction') {
    $scope.type = 'ExteriorFloor';
  } else if (params.type == 'Underground Floor Construction') {
    $scope.type = 'UndergroundFloor';
  }

  $scope.constructionsGridOptions = {
    columnDefs: [{
      name: 'name',
      enableHiding: false,
      allowCellFocus: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      minWidth: 400
    }, {
      name: 'compatible_surface_type',
      allowCellFocus: false,
      enableFiltering: false,
      filters: Shared.exactFilter($scope.type),
      visible: false
    }, {
      name: 'type',
      enableHiding: false,
      allowCellFocus: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'framing_configuration',
      enableHiding: false,
      allowCellFocus: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      maxWidth: 218,
      visible: $scope.type != 'UndergroundFloor'
    }, {
      name: 'framing_size',
      enableHiding: false,
      allowCellFocus: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      maxWidth: 159,
      visible: $scope.type != 'UndergroundFloor'
    }, {
      name: 'cavity_insulation_r_value',
      secondLine: Shared.html('ft<sup>2</sup> &deg;F hr / Btu'),
      enableHiding: false,
      allowCellFocus: false,
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      visible: $scope.type != 'UndergroundFloor'
    }, {
      name: 'continuous_insulation_r_value',
      secondLine: Shared.html('ft<sup>2</sup> &deg;F hr / Btu'),
      enableHiding: false,
      allowCellFocus: false,
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      visible: $scope.type != 'UndergroundFloor'
    }, {
      name: 'continuous_insulation_material_name',
      enableHiding: false,
      allowCellFocus: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      minWidth: 300,
      visible: $scope.type != 'UndergroundFloor'
    }, {
      name: 'slab_type',
      enableHiding: false,
      allowCellFocus: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      visible: $scope.type == 'UndergroundFloor'
    }, {
      name: 'slab_insulation_orientation',
      enableHiding: false,
      allowCellFocus: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      visible: $scope.type == 'UndergroundFloor'
    }, {
      name: 'slab_insulation_thermal_resistance',
      secondLine: Shared.html('ft<sup>2</sup> &deg;F hr / Btu'),
      allowCellFocus: false,
      cellFilter: 'parseRValue',
      enableHiding: false,
      filters: [{
        condition: function (searchTerm, cellValue) {
          var term = searchTerm.replace(/[^\d.-]/g, '');
          if (term.length) {
            term = Number(term);
            if (isNaN(term)) term = 0;
            if (cellValue === null) return false;
            var rValue = Number(cellValue.replace('_', '.').replace(/[^\d.]/g, ''));
            return rValue >= term;
          }
          return true;
        },
        placeholder: 'At least'
      }, {
        condition: function (searchTerm, cellValue) {
          var term = searchTerm.replace(/[^\d.-]/g, '');
          if (term.length) {
            term = Number(term);
            if (isNaN(term)) term = 0;
            if (cellValue === null) return false;
            var rValue = Number(cellValue.replace('_', '.').replace(/[^\d.]/g, ''));
            return rValue <= term;
          }
          return true;
        },
        placeholder: 'No more than'
      }],
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      sortingAlgorithm: function (a, b) {
        if (a === b) {
          return 0;
        }
        if (a === null) {
          return 1;
        } else if (b === null) {
          return -1;
        }
        var numA = Number(a.replace('_', '.').replace(/[^\d.]/g, ''));
        var numB = Number(b.replace('_', '.').replace(/[^\d.]/g, ''));
        return numA < numB ? -1 : 1;
      },
      visible: $scope.type == 'UndergroundFloor'
    }],
    data: 'data',
    enableFiltering: true,
    enableRowHeaderSelection: false,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (row.isSelected) {
          $scope.selected = row.entity;
          $scope.layerData = row.entity.layers;
        } else {
          // No rows selected
          $scope.selected = null;
          $scope.layerData = [];
        }
      });
      if (typeof (params.rowEntity) !== 'undefined' && params.rowEntity) {
        $interval(function () {
          var rowEntity = _.find($scope.data, {id: params.rowEntity.id});
          $scope.gridApi.selection.selectRow(rowEntity);
          $scope.gridApi.cellNav.scrollTo(rowEntity);
        }, 0, 1);
      }
    }
  };

  $scope.layersGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Layer'
    }, {
      name: 'code_category'
    }],
    data: 'layerData',
    enableColumnMenus: false,
    enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
    enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
    enableSorting: false
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
