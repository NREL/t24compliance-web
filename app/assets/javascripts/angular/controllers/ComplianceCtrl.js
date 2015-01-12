

cbecc.controller('ComplianceCtrl', [
  '$scope', 'data', 'Shared', function ($scope, data, Shared) {
    $scope.getXml = function () {
      console.log("submitting simulation to run queue");

      var params = Shared.defaultParams();
      params.data = { action: 'xml' };

      console.log(params);
      data.bulkSync('simulations', params);
    };
  }
]);
