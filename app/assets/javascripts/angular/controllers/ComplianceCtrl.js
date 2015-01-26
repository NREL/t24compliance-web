cbecc.controller('ComplianceCtrl', ['$scope', '$log', 'data', 'Shared', function ($scope, $log, data, Shared) {
  $scope.getXml = function () {
    $log.debug('Submitting simulation to run queue');

    var params = Shared.defaultParams();
    params.data = {
      action: 'xml'
    };

    $log.debug(params);
    data.bulkSync('simulations', params);
  };
}]);
