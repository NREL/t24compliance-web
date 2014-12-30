cbecc.controller('ProjectCtrl', [
  '$scope', '$rootScope', '$window', '$stateParams', '$resource', '$location', 'toaster', 'Project', 'Shared', function ($scope, $rootScope, $window, $stateParams, $resource, $location, toaster, Project, Shared) {
    // pull in global enum definitions
    $scope.project_compliance_type_enums = $window.project_compliance_type_enums;

    // project tabs
    $scope.status = {
      project_team: true,
      exceptional_condition: true
    };

    Shared.setIds($stateParams);
    // new vs edit
    var proj_id = Shared.getProjectId();
    if (proj_id) {
      Project.show({id: proj_id}).$promise.then(function (response) {
        $scope.project = response;
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
    }

    // save
    $scope.submit = function () {
      console.log("submit");
      $scope.errors = {}; //clean up server errors

      console.log('EXCEPTIONALS');
      console.log('no cooling: ', $scope.project.exceptional_condition_no_cooling_system);
      console.log('rated capacity: ', $scope.project.exceptional_condition_rated_capacity);
      console.log('water heater: ', $scope.project.exceptional_condition_water_heater);

      // Exceptional_condition_modeling doesn't actually have a field, clear narrative if checkbox is 'No'
      if ($scope.project.exceptional_condition_modeling == 'No') {
        $scope.project.exceptional_condition_narrative = null;
      }

      function success(response) {
        toaster.pop('success', 'Project successfully saved');
        the_id = response.hasOwnProperty('id') ? response.id : response._id;

        // go back to form with id of what was just saved
        Shared.setProjectId(the_id);
        console.log("redirecting to " + Shared.projectPath());
        $location.path(Shared.projectPath());

      }

      function failure(response) {
        console.log("failure", response);
        toaster.pop('error', 'An error occurred while saving');

        return angular.forEach(response.data.errors, function (errors, field) {
          $scope.form[field].$setValidity('server', false);
          return $scope.errors[field] = errors.join(', ');
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


  }
]);
