cbecc.controller('ComplianceCtrl', ['$scope', '$log', '$http', '$timeout', 'data', 'Shared', 'simulation', function ($scope, $log, $http, $timeout, data, Shared, simulation) {
    $scope.simulation = simulation;
    $scope.errors_open = false;

    $log.debug('Simulation ID:', Shared.getSimulationId());

    $scope.isComplete = function () {
        return _.contains(['completed', 'error'], $scope.simulation.status);
    };
    $scope.isRunning = function () {
        return _.contains(['init', 'queued', 'started'], $scope.simulation.status);
    };
    $scope.hasErrors = function () {
        return !_.isEmpty($scope.simulation.error_messages);
    };
    $scope.hasWarnings = function () {
        return !_.isEmpty($scope.simulation.warning_messages);
    };
    $scope.hasMessages = function () {
        return !_.isEmpty($scope.simulation.percent_complete_message);
    };
    $scope.hasCompliancePDF = function () {
        return $scope.simulation.compliance_report_pdf_path != null;
    };
    $scope.hasComplianceXml = function () {
        return $scope.simulation.compliance_report_xml != null;
    };
    $scope.hasAnalysisXml = function () {
        return $scope.simulation.analysis_results_xml != null;
    };
    $scope.hasOpenStudioBaseline = function () {
        return $scope.simulation.openstudio_model_baseline != null;
    };
    $scope.hasOpenStudioProposed = function () {
        return $scope.simulation.openstudio_model_proposed != null;
    };
    $scope.hasResultsZip = function () {
        return $scope.simulation.results_zip_file != null;
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
        $http.get($scope.simulationPath()).then(function (response) {
            $scope.simulation = response.data;
            $scope.calls++;
            if (!$scope.isComplete()) {
                $timeout($scope.poll, 2000);
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

    $scope.simulationDownloadReport = function (report_name) {
        return '/simulations/' + Shared.getSimulationId() + '/download_report?report=' + report_name
    };

    if ($scope.isRunning()) {
        $scope.poll();
    }
}]);
