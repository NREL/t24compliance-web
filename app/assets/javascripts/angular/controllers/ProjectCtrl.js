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
    }

    // save
    $scope.submit = function () {
      console.log("submit");

      function success(response) {
        toaster.pop('success', 'Project successfully saved');
        the_id = typeof response['id'] === "undefined" ? response['_id'] : response['id'];

        // go back to form with id of what was just saved
        Shared.setProjectId(the_id);
        console.log("redirecting to "+Shared.projectPath());
        $location.path(Shared.projectPath());

      }

      function failure(response) {
        console.log("failure", response);
        toaster.pop('error', 'An error occurred while saving', response.statusText);

        _.each(response.data, function (errors, key) {
          _.each(errors, function (e) {
            $scope.form[key].$dirty = true;
            $scope.form[key].$setValidity(e, false);
          });
        });
      }

      if (Shared.getProjectId()) {
        Project.update($scope.project, success, failure);
      } else {
        Project.create($scope.project, success, failure);
      }

    };


    //FORM TODO:  when saving, check if exceptional_condition_modeling is true.  If so, save exceptional_condition_narrative.
    // Exceptional_condition_modeling doesn't actually have a field


  }
]);
