cbecc.controller("NavCtrl", [
  '$scope', '$location', 'Shared', function ($scope, $location, Shared) {
    $scope.isActive = function(tabIndicator) {
      var tabRegex = new RegExp(tabIndicator);
      return tabRegex.test($location.path());
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
