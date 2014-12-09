cbecc.controller('ProjectCtrl', [
  '$scope', '$window', '$routeParams', '$resource', '$location', 'flash', 'Project', function ($scope, $window, $routeParams, $resource, $location, flash, Project) {

    // pull in global enum definitions
    $scope.project_compliance_type_enums = $window.project_compliance_type_enums;

    // project tabs
    $scope.status =
      {
        project_team: true,
        exceptional_condition: true
      };

    // new vs edit
    if ($routeParams.id) {
      $scope.project = Project.show({ id: $routeParams.id });
    } else {
      $scope.project = new Project();
    }

    // save
    $scope.submit = function () {
      console.log("submit");

      function success(response) {
        console.log("success", response);
        console.log($scope.project);
        $location.path("/project/");

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
