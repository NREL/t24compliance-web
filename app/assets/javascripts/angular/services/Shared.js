cbecc.factory('Shared', function() {
  var service = {};
  var projectId = null;
  var buildingId = null;

  service.setProjectId = function ( value ) {
    projectId = value;
  }

  service.getProjectId = function () {
    return projectId;
  }

  service.setBuildingId = function( value ) {
    buildingId = value;
  }

  service.getBuildingId = function () {
    return buildingId;
  }

  return service;
});
