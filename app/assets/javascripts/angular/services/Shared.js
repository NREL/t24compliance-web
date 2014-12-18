cbecc.factory('Shared', ['usSpinnerService', function (usSpinnerService) {
  var service = {};
  var projectId = null;
  var buildingId = null;

  service.setIds = function($stateParams) {
    console.log("calling set ids")
    if ($stateParams.project_id) {
      this.setProjectId($stateParams.project_id);
    }
    if ($stateParams.building_id) {
      this.setBuildingId($stateParams.building_id);
    }
  };
  service.setProjectId = function (value) {
    console.log("setting proj id to "+value);
    projectId = value;
  };

  service.getProjectId = function () {
    return projectId;
  };

  service.setBuildingId = function (value) {
    console.log("set bid called with value: "+value);
    buildingId = value;
  };

  service.getBuildingId = function () {
    return buildingId;
  };

  service.projectPath = function() {
    var path = "/projects";
    if (projectId) {
      path = path + "/" + projectId;
    }
    return path;
  }
  service.buildingPath = function() {
    var path = "";
    if (projectId) {
      path = path + "/projects/" + projectId + "/buildings";
      if (buildingId) {
        path = path + "/" + buildingId;
      }
    }
    else {
      path = "/buildings"; //can't actually navigate here without project id...
    }
    return path;
  }
  service.constructionsPath = function() {
    if (projectId && buildingId) {
      return "/projects/" + projectId + "/buildings/" + buildingId + "/constructions"
    }
    else {
      //shouldn't be able to get to this
      return "/constructions"
    }

  }
  service.startSpinner = function () {
    usSpinnerService.spin('spinner');
  };

  service.stopSpinner = function () {
    usSpinnerService.stop('spinner');
  };

  return service;
}]);
