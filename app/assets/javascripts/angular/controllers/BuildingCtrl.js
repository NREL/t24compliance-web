cbecc.controller('BuildingCtrl', [
  '$scope', '$window', '$routeParams', '$resource', '$location', 'flash', function ($scope, $window, $routeParams, $resource, $location, flash) {

    // new vs edit
    if ($stateParams.id) {
      $scope.building = Building.show({id: $stateParams.id});
    } else {
      $scope.building = new Building();
    }

    // save
    $scope.submit = function () {
      console.log("submit");

      function success(response) {
        the_id = typeof response['id'] === "undefined" ? response['_id'] : response['id'];

        // go back to form with id of what was just saved
        $location.path("/building/" + the_id);

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

      if ($stateParams.id) {
        Building.update($scope.building, success, failure);
      } else {
        Building.create($scope.building, success, failure);
      }

    };

  }
]);
