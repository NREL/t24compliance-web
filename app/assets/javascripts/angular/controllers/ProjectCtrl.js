cbecc.controller('ProjectCtrl', [
  '$scope', '$rootScope', '$window', '$stateParams', '$resource', '$location', 'toaster', 'Project', 'Shared', function ($scope, $rootScope, $window, $stateParams, $resource, $location, toaster, Project, Shared) {
    // pull in global enum definitions
    $scope.project_compliance_type_enums = $window.project_compliance_type_enums;

    // project tabs
    $scope.status = {
      project_team: true,
      exceptional_condition: true
    };

    // new vs edit
    if ($stateParams.id) {
      Shared.setProjectId($stateParams.id);
      console.log('Current ProjectID: ', Shared.getProjectId());
      $scope.project = Project.show({id: $stateParams.id});
    }
    else if (Shared.getProjectId() != null) {
      $scope.project = Project.show({id: Shared.getProjectId()});
      console.log('Current ProjectID already set: ', Shared.getProjectId());
    }
    else {

      $scope.project = new Project();
    }

    // save
    $scope.submit = function () {
      console.log("submit");

      function success(response) {
        console.log("success", response);
        toaster.pop('success', 'Project successfully saved');
        //console.log($scope.project);
        //console.log("_id is: ", response['_id'], "or id is: ", response['id']);
        the_id = typeof response['id'] === "undefined" ? response['_id'] : response['id'];

        // go back to form with id of what was just saved
        $location.path("/project/" + the_id);

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

      if ($stateParams.id) {
        Project.update($scope.project, success, failure);
      } else {
        Project.create($scope.project, success, failure);
      }

    };


    //FORM TODO:  when saving, check if exceptional_condition_modeling is true.  If so, save exceptional_condition_narrative.
    // Exceptional_condition_modeling doesn't actually have a field


  }
]);
