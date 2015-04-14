cbecc.controller('ComplianceCtrl', ['$scope', '$log', '$http', '$timeout', 'data', 'Shared', 'simulation', function ($scope, $log, $http, $timeout, data, Shared, simulation) {
  $scope.simulation = simulation;
  $scope.errors_open = false;

  $log.debug('Simulation ID:', Shared.getSimulationId());

  $scope.isComplete = function () {
    return _.contains(['completed', 'errored'], $scope.simulation.status);
  };
  $scope.isRunning = function () {
    return _.contains(['init', 'queued', 'started'], $scope.simulation.status);
  };
  $scope.hasErrors = function () {
    return !_.isEmpty($scope.simulation.error_messages);
  };
  $scope.hasCompliancePDF = function () {
    return $scope.simulation.compliance_report_pdf_path != null;
  };

  $scope.getXml = function () {
    $log.debug('Submitting simulation to run queue');

    var params = Shared.defaultParams();
    params.data = {
      action: 'xml'
    };

    $log.debug(params);
    data.bulkSync('simulations', params);

    $scope.poll();
  };

  $scope.calls = 0;
  $scope.poll = function () {
    $log.debug('Polling');
    $http.get($scope.simulationPath()).then(function (response) {
      $scope.simulation = response;
      $scope.calls++;
      if (!$scope.isComplete()) {
        $timeout($scope.poll, 1000);
      } else {
        $scope.calls = 0;
      }
    });
  };

  $scope.simulationPath = function () {
    return '/simulations/' + Shared.getSimulationId() + '.json';
  };

  $scope.sddXmlPath = function () {
    return '/projects/' + Shared.getProjectId() + '/download';
  };
}]);
