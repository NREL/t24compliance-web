cbecc.controller("NavCtrl", [
  '$scope', '$location', 'Shared', function ($scope, $location, Shared) {
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
    $scope.projectPath = function() {
      return Shared.projectPath();
    };
    $scope.buildingPath = function() {
      return Shared.buildingPath();
    };
    $scope.constructionsPath = function() {
      return Shared.constructionsPath();
    };
  }
]);
