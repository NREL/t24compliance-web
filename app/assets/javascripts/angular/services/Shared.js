cbecc.factory('Shared', ['usSpinnerService', function (usSpinnerService) {
  var service = {};
  var projectId = null;
  var buildingId = null;

  service.setIds = function($stateParams) {
    console.log("calling set ids")
    if ($stateParams.project_id !== null) {
      this.setProjectId($stateParams.project_id);
    }
    if ($stateParams.building_id !== null) {
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
  // service.buildingPath = function() {
  //   var path = "";
  //   if (this.projectId) {
  //     path = path + "#/projects/" + this.projectId + "/buildings";
  //     if (this.buildingId) {
  //       path = path + "/" + this.buildingId;
  //     }
  //   }
  //   else {
  //     path = "#/buildings"; //can't actually navigate here without project id...
  //   }
  //   // return "#/building";
  //   return path;
  // }
  // service.constructionsPath = function() {
  //   var path = "#/constructions";
  //   var id = Shared.getProjectId();
  //   if (id != null) {
  //     path = path + "/" + id;
  //   }
  //   return path;
  // }

  return service;
}]);
