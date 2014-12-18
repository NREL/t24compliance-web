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
    }
    $scope.buildingPath = function() {
      var path = "";
      var proj_id = Shared.getProjectId();
      var building_id = Shared.getBuildingId();
      if (proj_id != null) {
        path = path + "/projects/" + proj_id + "/buildings";
        if (building_id != null) {
          path = path + "/" + building_id;
        }
      }
      else {
        path = "/buildings"; //can't actually navigate here without project id...
      }
      // return "#/building";
      return path;
    }
    $scope.constructionsPath = function() {
      var path = "/constructions";
      var id = Shared.getProjectId();
      if (id != null) {
        path = path + "/" + id;
      }
      return path;
    }
  }
]);
