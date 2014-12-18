cbecc.factory('Shared', ['$cacheFactory', 'usSpinnerService', function ($cacheFactory, usSpinnerService) {
  var service = {};
  var projectId = null;
  var buildingId = null;
  var cache = $cacheFactory('constructionsCache');
  var cacheKeys = [];

  service.setIds = function ($stateParams) {
    console.log("calling set ids");
    if ($stateParams.project_id) {
      this.setProjectId($stateParams.project_id);
    }
    if ($stateParams.building_id) {
      this.setBuildingId($stateParams.building_id);
    }
  };
  service.setProjectId = function (value) {
    if (value != projectId) {
      console.log("setting proj id to " + value);
      projectId = value;
    }
  };

  service.getProjectId = function () {
    return projectId;
  };

  service.setBuildingId = function (value) {
    if (value != buildingId) {
      console.log("set bid called with value: " + value);
      buildingId = value;
    }
  };

  service.getBuildingId = function () {
    return buildingId;
  };

  service.projectPath = function () {
    var path = "/projects";
    if (projectId) {
      path += "/" + projectId;
    }
    return path;
  };

  service.buildingPath = function () {
    var path = "";
    if (projectId) {
      path = "/projects/" + projectId + "/buildings";
      if (buildingId) {
        path += "/" + buildingId;
      }
    } else {
      path = "/buildings"; //can't actually navigate here without project id...
    }
    return path;
  };

  service.constructionsPath = function () {
    if (projectId && buildingId) {
      return "/projects/" + projectId + "/buildings/" + buildingId + "/constructions"
    } else {
      //shouldn't be able to get to this
      return "/constructions"
    }

  };

  service.spacesPath = function () {
    if (projectId && buildingId) {
      return "/projects/" + projectId + "/buildings/" + buildingId + "/spaces"
    } else {
      //shouldn't be able to get to this
      return "/spaces"
    }

  };

  service.startSpinner = function () {
    usSpinnerService.spin('spinner');
  };

  service.stopSpinner = function () {
    usSpinnerService.stop('spinner');
  };

  service.loadFromCache = function (key) {
    if (cacheKeys.indexOf(key) == -1) {
      return null;
    }
    return cache.get(key);
  };

  service.saveToCache = function (key, value) {
    if (cacheKeys.indexOf(key) == -1) {
      cacheKeys.push(key);
    }
    cache.put(key, value === undefined ? null : value);
  };

  return service;
}]);
