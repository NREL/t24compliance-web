cbecc.controller('ModalDoorLibraryCtrl', ['$scope', '$modalInstance', '$interval', 'uiGridConstants', 'Shared', 'params', function ($scope, $modalInstance, $interval, uiGridConstants, Shared, params) {
  params.data.then(function (data) {
    $scope.data = data;
  });
  $scope.title = params.type;
  $scope.selected = null;

  $scope.doorGridOptions = {
    columnDefs: [{
      name: 'name',
      enableHiding: false,
      allowCellFocus: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      minWidth: 400
    }, {
      name: 'type',
      enableHiding: false,
      allowCellFocus: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'certification_method',
      enableHiding: false,
      allowCellFocus: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'u_factor',
      secondLine: Shared.html('Btu / (ft<sup>2</sup> &deg;F hr)'),
      enableHiding: false,
      allowCellFocus: false,
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'open',
      enableHiding: false,
      allowCellFocus: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
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
          var rowEntity = _.find($scope.data, {id: params.rowEntity.id});
          $scope.gridApi.selection.selectRow(rowEntity);
          $scope.gridApi.cellNav.scrollTo(rowEntity);
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
