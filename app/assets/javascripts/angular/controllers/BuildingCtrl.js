cbecc.controller('BuildingCtrl', [
  '$scope', '$stateParams', '$resource', '$location', 'toaster', 'data', 'Story', 'Shared', 'stories', function ($scope, $stateParams, $resource, $location, toaster, data, Story, Shared, stories) {
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

    $scope.stories = stories;
    $scope.storiesGridOptions.data = $scope.stories;
    if (Shared.getBuildingId() === null) {
      $scope.building = {}; //empty building
    } else {
      data.show('buildings', {project_id: Shared.getProjectId(), id: Shared.getBuildingId()}).then(function (response) {
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
        var the_id = response.hasOwnProperty('id') ? response.id : response._id;
        Shared.setBuildingId(the_id);
        // UPDATE STORIES
        $scope.stories.forEach(function (s) {
          // ensure each story has a building_id defined
          if (s.building_id != the_id) {
            s.building_id = the_id;
          }
        });

        // Story.createUpdate({building_id: Shared.getBuildingId()}, $scope.stories);
        var params = Shared.defaultParams();
        params['data'] = $scope.stories;
        data.bulkSync('building_stories', params)
        Shared.setBuildingId(the_id);
        $location.path(Shared.buildingPath());

      }

      function failure(response) {
        console.log("failure", response);
        if (response.status == 422) {
          var len = Object.keys(response.data.errors).length;
          toaster.pop('error', 'An error occurred while saving', len + ' invalid field' + (len == 1 ? '' : 's'));
        } else {
          toaster.pop('error', 'An error occurred while saving');
        }

        angular.forEach(response.data.errors, function(errors, field) {
          if (field !== 'total_story_count') {
            $scope.form[field].$setValidity('server', false);
            $scope.form[field].$dirty = true;
          }
          $scope.errors[field] = errors.join(', ');
        });

      }

      // set project ID
      $scope.building.project_id = Shared.getProjectId();
      if ($scope.building.relocatable_public_school_building) {
        $scope.building.relocatable_public_school_building = 1;
      } else {
        $scope.building.relocatable_public_school_building = 0;
      }

      // update STORIES
      $scope.building.total_story_count = $scope.storiesGridOptions.data.length;


      // create vs update
      if (Shared.getBuildingId()) {
        data.update('buildings', $scope.building).then(success).catch(failure);
      } else {
        data.create('buildings', $scope.building).then(success).catch(failure);
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
      return !$scope.storiesGridOptions.data.length ? "has-error" : "";
    };
  }
]);
