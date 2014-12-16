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
    $scope.currentProjPath = function() {
      var path = "#/project";
      var id = Shared.getProjectId();
      if (id != null) {
        path = path + "/" + id;
      }
      return path;
    }
  }
]);
