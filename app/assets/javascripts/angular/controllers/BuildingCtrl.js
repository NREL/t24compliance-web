cbecc.controller('BuildingCtrl', [
  '$scope', '$window', '$stateParams', '$resource', '$location', 'flash', 'Building', 'Story', 'Shared', function ($scope, $window, $stateParams, $resource, $location, flash, Building, Story, Shared) {

     // check on project, if undefined, redirect
    if (Shared.getProjectId() === null)
    {
        $location.path("/project");
    }
    console.log("Current ProjectID: ", Shared.getProjectId());
    $scope.projectId = Shared.getProjectId();

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
    console.log("SAVED STORIES ", $scope.stories);

    $scope.stories = [];
    $scope.saved_stories = [];
    // new vs edit (check if bld already saved and load that one)
    if ($stateParams.id) {
      Shared.setBuildingId($stateParams.id);
      $scope.building = Building.show({project_id: $scope.projectId, id: $stateParams.id});
      console.log('building retrieved by stateParams: ', $stateParams.id);
      Story.index({building_id: Shared.getBuildingId()}).$promise.then(function(storyData) {
        $scope.stories = storyData;
        $scope.saved_stories = storyData;
        $scope.storiesGridOptions.data = storyData;
      });
    }
    else if (Shared.getBuildingId() !== null) {
      $scope.building = Building.show({project_id: $scope.projectId, id: Shared.getBuildingId()});
      console.log('building retrieved by getBuildingId:', Shared.getBuildingId());
      Story.index({building_id: Shared.getBuildingId()}).$promise.then(function(storyData) {
        $scope.stories = storyData;
        $scope.storiesGridOptions.data = storyData;
      });
    }
    else {
      Building.index({project_id: $scope.projectId}).$promise.then(function(data) {
        if (data.length) {
          $scope.building = data[0];
          Shared.setBuildingId($scope.building.id);
          console.log('building retrieved by project id (bld exists): ', $scope.building.id);
          Story.index({building_id: $scope.building.id}).$promise.then(function(storyData) {
            $scope.stories = storyData;
            $scope.saved_stories = storyData;
            console.log("HEY!");
            console.log($scope.saved_stories);
            $scope.storiesGridOptions.data = storyData;

          });
        }
        else {
          $scope.building = new Building();
          console.log('no buildings associated with this project, creating new one');
          $scope.storiesGridOptions.data = [];
        }
      });
    }

    // save
    $scope.submit = function () {
      console.log("submit");

      function success(response) {
        var the_id = typeof response['id'] === "undefined" ? response['_id'] : response['id'];

        // create / update / delete stories
        //create all for now
        $scope.stories.forEach( function (story) {
          story.building_id = the_id;
          Story.create(story);
        });

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

      // set project ID
      $scope.building.project_id = Shared.getProjectId();
      // TODO: this checkbox stuff needs a second look
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
      if (Shared.getBuildingId() != null) {
        Building.update({project_id: $scope.projectId}, $scope.building, success, failure);
      } else {
        Building.create({project_id: $scope.projectId}, $scope.building, success, failure);
      }

    };

    // Buttons
    $scope.addStory = function () {
      $scope.stories.push({
        name: "Story " + ($scope.stories.length + 1),
        z: 0,
        floor_to_floor_height: 14,
        floor_to_ceiling_height: 10,
        above_or_below: 'Above'
      });
    };
    $scope.duplicateStory = function () {
      $scope.stories.push({
        name: "Story " + ($scope.stories.length + 1),
        z: $scope.selected.z,
        floor_to_floor_height: $scope.selected.floor_to_floor_height,
        floor_to_ceiling_height: $scope.selected.floor_to_ceiling_height,
        above_or_below: $scope.selected.above_or_below
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
