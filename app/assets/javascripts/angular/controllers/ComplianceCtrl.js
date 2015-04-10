cbecc.controller('ComplianceCtrl', ['$scope', '$log', '$timeout','data', 'Shared', 'simulation', function ($scope, $log, $timeout, data, Shared, simulation) {

  $scope.simulation = simulation;
  console.log($scope.simulation);

  $scope.errors_open = false;

  $scope.isComplete = function() {
    return $scope.simulation.status  == 'completed' || $scope.simulation.status == 'errored'
  };
  $scope.isRunning = function() {
    return (($scope.simulation.status == 'init') || ($scope.simulation['status'] == 'queued') || ($scope.simulation['status'] == 'started'))
  };

  $scope.hasErrors = function() {
    return $scope.simulation.error_messages.length > 0
  };

  $scope.hasCompliancePDF = function()  {
    return $scope.simulation['compliance_report_pdf_path'] == null;
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
