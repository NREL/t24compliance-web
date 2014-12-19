cbecc.controller('ProjectCtrl', [
  '$scope', '$rootScope', '$window', '$stateParams', '$resource', '$location', 'toaster', 'Project', 'Shared', function ($scope, $rootScope, $window, $stateParams, $resource, $location, toaster, Project, Shared) {
    // pull in global enum definitions
    $scope.project_compliance_type_enums = $window.project_compliance_type_enums;

    // project tabs
    $scope.status = {
      project_team: true,
      exceptional_condition: true
    };

    function toCamelCase(input) {
      return input.toLowerCase();
    }


    Shared.setIds($stateParams);
    // new vs edit
    var proj_id = Shared.getProjectId();
    if (proj_id) {
      Project.show({id: proj_id}).$promise.then(function (response) {
        $scope.project = response;
      }, function () {
        toaster.pop('error', 'Unable to retrieve project', 'Invalid projectId');
      });
    } else {
      $scope.project = new Project();
    }

    // save
    $scope.submit = function () {
      console.log("submit");
      $scope.errors = {} ; //clean up server errors


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
        toaster.pop('error', 'An error occurred while saving');


//        _.each(response.data, function (errors) {
//          _.each(errors, function (e, key) {

//            console.log(key);
//            $scope.form[key].$dirty = true;
            // e is an array of errors...need to
            // e should be in camelCase or it might cause problems?

//            $scope.form[key].$setValidity(e, false);
//          });
//        });

        return angular.forEach(response.data.errors, function(errors, field) {
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
    $scope.errorClass = function(name) {
      var s = $scope.form[name];
      return s.$invalid && s.$dirty ? "has-error" : "";
    };

    $scope.errorMessage = function(name) {
      result = [];
      _.each($scope.form[name].$error, function(key, value) {
        result.push(value);
      });
      return result.join(", ");
    };

    //FORM TODO:  when saving, check if exceptional_condition_modeling is true.  If so, save exceptional_condition_narrative.
    // Exceptional_condition_modeling doesn't actually have a field


  }
]);
