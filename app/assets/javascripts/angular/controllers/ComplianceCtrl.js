cbecc.controller('ComplianceCtrl', ['$scope', '$log', '$timeout','data', 'Shared', 'simulation', function ($scope, $log, $timeout, data, Shared, simulation) {
  $scope.simulation = simulation;
  $scope.errors_open = false;

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
  };

  $scope.sddXmlPath = function () {
    return '/projects/' + Shared.defaultParams().project_id + '/download';
  };
}]);
