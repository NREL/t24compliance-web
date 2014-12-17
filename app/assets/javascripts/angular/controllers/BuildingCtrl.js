cbecc.controller('BuildingCtrl', [
  '$scope', '$window', '$stateParams', '$resource', '$location', 'toaster', 'Building', 'Story', 'Shared', 'data', function ($scope, $window, $stateParams, $resource, $location, toaster, Building, Story, Shared, data) {

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
      $scope.building = new Building();
    } else {
      $scope.building = Building.show({project_id: Shared.getProjectId(), id: Shared.getBuildingId()});
    }

    // save
    $scope.submit = function () {
      console.log("submit");

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

        // go back to form with id of what was just saved
        $location.path("/building/" + the_id);

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

      // set project ID
      $scope.building.project_id = Shared.getProjectId();
      console.log('checkbox: ', $scope.building.relocatable_public_school_building);
      if ($scope.building.relocatable_public_school_building) {
        $scope.building.relocatable_public_school_building = 1;
      } else {
        $scope.building.relocatable_public_school_building = 0;
      }

      // STORIES
      $scope.building.total_story_count = $scope.stories.length;
      console.log('total stories:', $scope.building.total_story_count);

      // create vs update
      if (Shared.getBuildingId() !== null) {
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
  }
]);
