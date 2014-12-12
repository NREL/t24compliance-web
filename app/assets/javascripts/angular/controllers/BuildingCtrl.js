cbecc.controller('BuildingCtrl', [
  '$scope', '$window', '$stateParams', '$resource', '$location', 'flash', 'Building', function ($scope, $window, $stateParams, $resource, $location, flash, Building) {

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

    // Stories UI Grid
    $scope.storiesGridOptions = {
      columnDefs: [{
        name: 'story_name'
      }, {
        name: 'altitude'
      }, {
        name: 'floor_area_to_floor_height'
      }, {
        name: 'floor_area_to_floor_ceiling'
      }, {
        name: 'above_or_below'
      }],
      enableCellEditOnFocus: true,
      enableColumnMenus: false,
      enableRowHeaderSelection: true,
      enableRowSelection: true,
      enableSorting: false,
      multiSelect: false,
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          if (row.isSelected) {
            $scope.selected = row.entity;
          } else {
            // No rows selected
            $scope.selected = null;
          }
        });
      }
    };

    // Buttons
    $scope.addStory = function () {
      $scope.storiesGridOptions.data.push({
        story_name: "Story " + ($scope.storiesGridOptions.data.length + 1),
        altitude: 6000,
        floor_area_to_floor_height: 14,
        floor_area_to_floor_ceiling: 14,
        above_or_below: 'Above'
      });
    };
    $scope.duplicateStory = function () {
      $scope.storiesGridOptions.data.push({
        story_name: "Story " + ($scope.storiesGridOptions.data.length + 1),
        altitude: $scope.selected.altitude,
        floor_area_to_floor_height: $scope.selected.floor_area_to_floor_height,
        floor_area_to_floor_ceiling: $scope.selected.floor_area_to_floor_ceiling,
        above_or_below: $scope.selected.above_or_below
      });
    };
    $scope.deleteStory = function () {
      var index = $scope.storiesGridOptions.data.indexOf($scope.selected);
      $scope.storiesGridOptions.data.splice(index, 1);
      $scope.selected = null;
    };

    $scope.storiesBelow = function () {
      // TODO
    };
  }
]);
