cbecc.controller('BuildingCtrl', [
  '$scope', '$window', '$stateParams', '$resource', '$location', 'toaster', 'Building', 'Story', 'Shared', 'data', function ($scope, $window, $stateParams, $resource, $location, toaster, Building, Story, Shared, data) {
    Shared.setIds($stateParams);

    // Stories UI Grid
    $scope.storiesGridOptions = {
      columnDefs: [{
        name: 'name',
        displayName: 'Story Name'
      }, {
        name: 'z',
        displayName: 'Elevation'
      }, {
        name: 'floor_to_floor_height'
      }, {
        name: 'floor_to_ceiling_height'
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

    $scope.stories = data;
    $scope.storiesGridOptions.data = $scope.stories;
    if (Shared.getBuildingId() === null) {
      console.log("new building");
      $scope.building = new Building();
    } else {
      console.log("existing building: id " + Shared.getBuildingId());
      Building.show({project_id: Shared.getProjectId(), id: Shared.getBuildingId()}).$promise.then(function (response) {
        $scope.building = response;
      }, function (response) {
        if (response.status == 404) {
          Shared.setBuildingId(null);
          toaster.pop('error', 'Invalid building ID');
          $location.path(Shared.buildingPath());
        } else {
          toaster.pop('error', 'Unable to retrieve building');
        }
      });
    }

    // save
    $scope.submit = function () {
      console.log("submit");
      $scope.errors = {} ; //clean up server errors

      function success(response) {
        toaster.pop('success', 'Building successfully saved');
        var the_id = typeof response['id'] === "undefined" ? response['_id'] : response['id'];
        Shared.setBuildingId(the_id);
        console.log("BLDG ID: ", the_id);
        // UPDATE STORIES
        console.log($scope.stories);
        $scope.stories.forEach(function (s) {
          // ensure each story has a building_id defined
          if (s.building_id != the_id) {
            s.building_id = the_id;
          }
        });

        Story.createUpdate({building_id: Shared.getBuildingId()}, $scope.stories);

        Shared.setBuildingId(the_id);
        console.log("redirecting to " + Shared.buildingPath());
        $location.path(Shared.buildingPath());

      }

      function failure(response) {
        console.log("failure", response);
        toaster.pop('error', 'An error occurred while saving');

        return angular.forEach(response.data.errors, function(errors, field) {
          console.log(field);
          if (field !== 'total_story_count') {
            $scope.form[field].$setValidity('server', false);
            $scope.form[field].$dirty = true;
          }
          return $scope.errors[field] = errors.join(', ');
        });

      }

      // set project ID
      $scope.building.project_id = Shared.getProjectId();
      console.log('checkbox: ', $scope.building.relocatable_public_school_building);
      if ($scope.building.relocatable_public_school_building) {
        $scope.building.relocatable_public_school_building = 1;
      } else {
        $scope.building.relocatable_public_school_building = 0;
      }

      // update STORIES
      console.log("STORIES:");
      $scope.building.total_story_count = $scope.storiesGridOptions.data.length;
      console.log($scope.building.total_story_count);


      // create vs update
      if (Shared.getBuildingId()) {
        console.log('Update Bldg');
        Building.update({project_id: Shared.getProjectId()}, $scope.building, success, failure);
      } else {
        console.log('Create Bldg');
        Building.create({project_id: Shared.getProjectId()}, $scope.building, success, failure);
      }

    };

    // Buttons
    $scope.addStory = function () {
      $scope.stories.push({
        name: "Story " + ($scope.stories.length + 1),
        z: 0,
        floor_to_floor_height: 14,
        floor_to_ceiling_height: 10
      });
    };
    $scope.duplicateStory = function () {
      $scope.stories.push({
        name: "Story " + ($scope.stories.length + 1),
        z: $scope.selected.z,
        floor_to_floor_height: $scope.selected.floor_to_floor_height,
        floor_to_ceiling_height: $scope.selected.floor_to_ceiling_height
      });
    };
    $scope.deleteStory = function () {
      var index = $scope.stories.indexOf($scope.selected);
      $scope.stories.splice(index, 1);
      if (index > 0) {
        $scope.gridApi.selection.toggleRowSelection($scope.stories[index - 1]);
      } else {
        $scope.selected = null;
      }
    };

    $scope.storiesBelow = function () {
      // TODO
    };

    // Form Errors
    $scope.errorClass = function(name) {
      var s = $scope.form[name];
      return s.$invalid && s.$dirty ? "has-error" : "";
    };

    $scope.storyError = function() {
      return ($scope.building.total_story_count < 1) ? "has-error" : "";
    }
  }
]);
