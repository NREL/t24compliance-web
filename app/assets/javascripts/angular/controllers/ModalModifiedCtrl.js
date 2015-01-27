cbecc.controller('ModalModifiedCtrl', ['$scope', '$timeout', '$modalInstance', function ($scope, $timeout, $modalInstance) {
  $modalInstance.opened.then(function () {
    $timeout(function () {
      document.getElementById('continueBtn').focus();
    }, 100);
  });

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss();
  };
}]);
