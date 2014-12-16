cbecc.controller('ComplianceCtrl', [
    '$scope', '$window', '$routeParams', '$resource', '$location', 'flash', 'Shared', 'Compliance', 'ComplianceRun', function ($scope, $window, $routeParams, $resource, $location, flash, Shared, Compliance, ComplianceRun) {

        $scope.runSimulation = function () {
            console.log("submitting simulation to run queue");
            $scope.run = ComplianceRun.run({projectId: Shared.getProjectId(), id: "549097466e6c6f4c2ac61900"});
        };
    }
]);