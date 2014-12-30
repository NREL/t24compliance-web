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
    $scope.spacesPath = function() {
      return Shared.spacesPath();
    };
    $scope.systemsPath = function() {
      return Shared.systemsPath();
    };
    $scope.zonesPath = function() {
      return Shared.zonesPath();
    };
    $scope.reviewPath = function() {
      return Shared.reviewPath();
    };
    $scope.compliancePath = function() {
      return Shared.compliancePath();
    };
  }
]);
