cbecc.controller("NavCtrl", [
  '$scope', '$location', function ($scope, $location) {
    $scope.isActive = function(viewLocation) {
      if (viewLocation == '/') {
        if ($location.path() == '/') return true;
        return false;
      }
      if ($location.path().substr(0, viewLocation.length) == viewLocation) {
        return true;
      }
      return false;
    };
  }
]);
