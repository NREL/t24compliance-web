
cbecc.controller("NavCtrl", [
  '$scope', '$location', function($scope, $location) {
    return $scope.isActive = function(viewLocation) {
      return viewLocation === $location.path();
    };
  }
]);