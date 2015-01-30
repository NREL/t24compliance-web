cbecc.controller('ModalFenestrationLibraryCtrl', ['$scope', '$modalInstance', '$interval', 'Shared', 'params', function ($scope, $modalInstance, $interval, Shared, params) {
  params.data.then(function(data) {
    $scope.data = data;
  });
  $scope.title = params.type;
  $scope.selected = null;

  if (params.type == 'Window Construction') {
    $scope.type = 'VerticalFenestration';
  } else if (params.type == 'Skylight Construction') {
    $scope.type = 'Skylight';
  }

  $scope.fenestrationGridOptions = {
    columnDefs: [{
      name: 'name',
      enableHiding: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      minWidth: 400
    }, {
      name: 'fenestration_type',
      enableFiltering: false,
      filters: Shared.exactFilter($scope.type),
      visible: false
    }, {
      name: 'fenestration_framing',
      displayName: 'Frame Type',
      enableHiding: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'fenestration_panes',
      displayName: 'Panes',
      enableHiding: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'fenestration_product_type',
      displayName: 'Product Type',
      enableHiding: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      visible: $scope.type == 'VerticalFenestration'
    }, {
      name: 'glazing_tint',
      enableHiding: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      visible: $scope.type == 'VerticalFenestration'
    }, {
      name: 'u_factor',
      secondLine: Shared.html('Btu / (ft<sup>2</sup> &deg;F hr)'),
      enableHiding: false,
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'shgc',
      displayName: 'Solar Heat Gain Coefficient',
      secondLine: Shared.html('frac.'),
      enableHiding: false,
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      visible: $scope.type == 'VerticalFenestration'
    }, {
      name: 'skylight_curb',
      enableHiding: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      visible: $scope.type == 'Skylight'
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
        } else {
          // No rows selected
          $scope.selected = null;
        }
      });
      if (typeof (params.rowEntity) !== 'undefined' && params.rowEntity) {
        $interval(function () {
          $scope.gridApi.selection.selectRow(_.find($scope.data, {id: params.rowEntity.id}));
        }, 0, 1);
      }
    }
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
