cbecc.factory('Shared', ['usSpinnerService', function (usSpinnerService) {
  var service = {};
  var projectId = null;
  var buildingId = null;

  service.setProjectId = function (value) {
    projectId = value;
  };

  service.getProjectId = function () {
    return projectId;
  };

  service.setBuildingId = function (value) {
    buildingId = value;
  };

  service.getBuildingId = function () {
    return buildingId;
  };

  service.startSpinner = function () {
    usSpinnerService.spin('spinner');
  };

  service.stopSpinner = function () {
    usSpinnerService.stop('spinner');
  };

  return service;
}]);
