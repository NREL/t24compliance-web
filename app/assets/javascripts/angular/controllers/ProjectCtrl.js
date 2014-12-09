cbecc.controller('ProjectCtrl', [
  '$scope', '$window', '$routeParams', '$stateParams', '$resource', '$location', 'flash', 'Project', function ($scope, $window, $routeParams, $stateParams, $resource, $location, flash, Project) {

    // pull in global enum definitions
    $scope.project_compliance_type_enums = $window.project_compliance_type_enums;

    // project tabs
    $scope.status =
      {
        project_team: true,
        exceptional_condition: true
      };

    // new vs edit
    console.log($routeParams);
    console.log($stateParams);
    if ($routeParams.id) {
      $scope.project = Project.show({ id: $routeParams.id });
      console.log('existing project');
    } else {
      $scope.project = new Project();
      console.log('new project');
    }

    // save
    $scope.submit = function () {
      console.log("submit");

      function success(response) {
        console.log("success", response);
        console.log($scope.project);
        console.log(response['_id']);
        // go back to form with id of what was just saved
        $location.path("/project/" + response['_id']);

      }

      function failure(response) {
        console.log("failure", response);

        _.each(response.data, function(errors, key) {
          _.each(errors, function(e) {
            $scope.form[key].$dirty = true;
            $scope.form[key].$setValidity(e, false);
          });
        });
      }

      if ($routeParams.id) {
        Project.update($scope.project, success, failure);
      } else {
        Project.create($scope.project, success, failure);
      }

    };


    //FORM TODO:  when saving, check if exceptional_condition_modeling is true.  If so, save exceptional_condition_narrative.
    // Exceptional_condition_modeling doesn't actually have a field


  }
]);
