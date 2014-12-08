cbecc.controller('ProjectCtrl', [
  '$scope', '$window', '$routeParams', '$resource', '$location', 'flash', 'Project', function ($scope, $window, $routeParams, $resource, $location, flash, Project) {

    // pull in global enum definitions
    $scope.project_compliance_type_enums = $window.project_compliance_type_enums;

    if ($routeParams.id) {
      $scope.project = Project.show({id: $routeParams.id});
    }
    else {
      $scope.project = new Project();
    }

    $scope.submit = function () {
      console.log("submit");

      function success(response) {
        console.log("success", response);
        $location.path("#/project/" + $scope.project.id);
      }

      function failure(response) {
        console.log("failure", response);

        _.each(response.data, function (errors, key) {
          _.each(errors, function (e) {
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

    $scope.cancel = function () {
      $location.path("#/project/" + $scope.project.id);
    };




  }
]);
