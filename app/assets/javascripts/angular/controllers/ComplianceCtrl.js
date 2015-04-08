cbecc.controller('ComplianceCtrl', ['$scope', '$log', 'data', 'Shared', 'simulations', function ($scope, $log, data, Shared, simulations) {

  $scope.simulation = simulations[0];
  console.log('HI!');
  console.log($scope.simulation);

  $scope.isComplete = function() {
    return $scope.simulation['status'] == 'completed'
  };


  $scope.getXml = function () {
    $log.debug('Submitting simulation to run queue');

    var params = Shared.defaultParams();
    params.data = {
      action: 'xml'
    };

    $log.debug(params);
    data.bulkSync('simulations', params);
  };

  $scope.sddXmlPath = function() {
    return '/projects/' + Shared.defaultParams().project_id + '/download';
  }
}]);
