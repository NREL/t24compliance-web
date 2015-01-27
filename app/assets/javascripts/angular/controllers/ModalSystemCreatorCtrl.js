cbecc.controller('ModalSystemCreatorCtrl', ['$scope', '$log', '$modalInstance', function ($scope, $log, $modalInstance) {
  $scope.quantity = 1;
  $scope.type = '';

  $scope.systemTypes = [{
    id: 'ptac',
    name: 'PTAC: Packaged Terminal Air Conditioner'
  }, {
    id: 'fpfc',
    name: 'FPFC: Four-Pipe Fan Coil'
  }, {
    id: 'szac',
    name: 'PSZ: Packaged Single Zone Air Conditioner'
  }, {
    id: 'vav',
    name: 'VAV: Variable Air Volume'
  }, {
    id: 'pvav',
    name: 'PVAV: Packaged Variable Air Volume'
  }];

  $scope.systemDescriptions = {
    ptac: 'Packaged terminal air conditioner: Ductless single-zone DX unit with hot water natural gas boiler.',
    fpfc: 'Four-pipe fan coil: Ductless single-zone unit with hot water and chilled water coils.',
    szac: 'Packaged single zone: This system can only serve one zone and includes a DX cooling coil and a gas heating coil.',
    vav: 'Variable volume system: packaged variable volume DX unit with gas heating and with hot water reheat terminal units.',
    pvav: 'Packaged variable volume system: VAV reheat system with packaged VAV DX unit with bass heating and hot water reheat terminal units.'
  };


  $scope.add = function () {
    var data = {
      quantity: $scope.quantity,
      type: $scope.type
    };
    $log.debug(data);
    $modalInstance.close(data);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
