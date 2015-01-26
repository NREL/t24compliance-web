cbecc.controller('ProjectCtrl', ['$scope', '$log', '$stateParams', '$location', 'toaster', 'Project', 'Shared', 'Enums', function ($scope, $log, $stateParams, $location, toaster, Project, Shared, Enums) {
  Shared.setIds($stateParams);

  // pull in global enum definitions
  $scope.project_compliance_type_enums = Enums.enums.project_compliance_type_enums;

  // project tabs
  $scope.status = {
    project_team: true,
    exceptional_condition: true
  };

  // new vs edit
  var proj_id = Shared.getProjectId();
  if (proj_id) {
    Project.show({id: proj_id}).$promise.then(function (response) {
      $scope.project = response;
      $scope.project.geometry_input_type = 'Simplified';
    }, function (response) {
      if (response.status == 404) {
        Shared.setProjectId(null);
        toaster.pop('error', 'Invalid project ID', 'Please create or open a project.');
        $location.path(Shared.projectPath());
      } else {
        toaster.pop('error', 'Unable to retrieve project');
      }
    });
  } else {
    $scope.project = new Project();
    // Initialize defaults
    $scope.project.geometry_input_type = 'Simplified';
    $scope.project.state = 'CA';
    $scope.project.exceptional_condition_no_cooling_system = 'No';
    $scope.project.exceptional_condition_rated_capacity = 'No';
    $scope.project.exceptional_condition_water_heater = 'No';
    $scope.project.exceptional_condition_narrative = 'No';
  }

  // save
  $scope.submit = function () {
    $log.debug('Submitting project');
    $scope.errors = {}; //clean up server errors

    function success(response) {
      toaster.pop('success', 'Project successfully saved');
      if (!Shared.getBuildingId()) toaster.pop('note', 'You can move on to the next tab by selecting \'Building\' from the top navigation menu.');

      var the_id = response.hasOwnProperty('id') ? response.id : response._id;

      // go back to form with id of what was just saved
      Shared.setProjectId(the_id);
      $location.path(Shared.projectPath());
    }

    function failure(response) {
      $log.error('Failure submitting project', response);
      if (response.status == 422) {
        var len = Object.keys(response.data.errors).length;
        toaster.pop('error', 'An error occurred while saving', len + ' invalid field' + (len == 1 ? '' : 's'));
      } else {
        toaster.pop('error', 'An error occurred while saving');
      }

      angular.forEach(response.data.errors, function (errors, field) {
        $scope.form[field].$setValidity('server', false);
        $scope.form[field].$dirty = true;
        $scope.errors[field] = errors.join(', ');
      });
    }

    if (Shared.getProjectId()) {
      Project.update($scope.project, success, failure);
    } else {
      Project.create($scope.project, success, failure);
    }

  };

  // Form Errors
  $scope.errorClass = function (name) {
    var s = $scope.form[name];
    return s.$invalid && s.$dirty ? "has-error" : "";
  };

}]);
