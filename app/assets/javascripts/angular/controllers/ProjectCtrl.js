cbecc.controller('ProjectCtrl', ['$scope', '$stateParams', '$location', 'toaster', 'Project', 'Shared', 'Enums', function ($scope, $stateParams, $location, toaster, Project, Shared, Enums) {
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
      // Exceptional_condition_modeling doesn't actually have a field, Initialize checkbox
      if ($scope.project.exceptional_condition_narrative) {
        $scope.project.exceptional_condition_modeling = 'Yes';
      } else {
        $scope.project.exceptional_condition_modeling = 'No';
      }
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
    // Initialize checkboxes
    $scope.project.exceptional_condition_no_cooling_system = 'No';
    $scope.project.exceptional_condition_rated_capacity = 'No';
    $scope.project.exceptional_condition_water_heater = 'No';
    $scope.project.exceptional_condition_modeling = 'No';
    $scope.project.geometry_input_type = 'Simplified';
  }

  // save
  $scope.submit = function () {
    console.log("submit");
    $scope.errors = {}; //clean up server errors

    // Exceptional_condition_modeling doesn't actually have a field, clear narrative if checkbox is 'No'
    if ($scope.project.exceptional_condition_modeling == 'No') {
      $scope.project.exceptional_condition_narrative = null;
    }

    function success(response) {
      toaster.pop('success', 'Project successfully saved');
      var the_id = response.hasOwnProperty('id') ? response.id : response._id;

      // go back to form with id of what was just saved
      Shared.setProjectId(the_id);
      console.log("redirecting to " + Shared.projectPath());
      $location.path(Shared.projectPath());

    }

    function failure(response) {
      console.log("failure", response);
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
