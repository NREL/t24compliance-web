cbecc.controller('BuildingCtrl', [
  '$scope', '$window', '$stateParams', '$resource', '$location', 'flash', 'Building', 'Story', 'Shared', function ($scope, $window, $stateParams, $resource, $location, flash, Building, Story, Shared) {

     // check on project, if undefined, redirect
    if (Shared.getProjectId() == null)
    {
        $location.path("/project");
    }
    console.log("Current ProjectID: ", Shared.getProjectId());
    $scope.projectId = Shared.getProjectId();

    // new vs edit (check if bld already saved and load that one)
    if ($stateParams.id) {
      Shared.setBuildingId($stateParams.id);
      $scope.building = Building.show({project_id: $scope.projectId, id: $stateParams.id});
      console.log('building retrieved by stateParams: ', $stateParams.id);
    }
    else if (Shared.getBuildingId() != null) {
      $scope.building = Building.show({project_id: $scope.projectId, id: Shared.getBuildingId()});
      console.log('building retrieved by getBuildingId:', Shared.getBuildingId());
    }
    else {
      buildings = Building.index({project_id: $scope.projectId});
      // I don't know why, but this syntax on the index action is important
      buildings.$promise.then(function(data) {
        console.log('buildings: ', data);
        if (data.length > 0) {
          $scope.building = data[0];
          Shared.setBuildingId($scope.building.id);
          console.log('building retrieved by project id (bld exists): ', $scope.building.id);
        }
        else {
          $scope.building = new Building();
          console.log('no buildings associated wiht this project, creating new one');
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
      if ($scope.building.relocatable_public_school_building == true)
      {
        $scope.building.relocatable_public_school_building = 1;
      }
      else {
        $scope.building.relocatable_public_school_building = 0;
      }

      // STORIES
      $scope.building.total_story_count = $scope.storiesGridOptions.data.length;
      console.log('total stories:', $scope.building.total_story_count);
      var above_cnt = 0;
      console.log('STORIES: ', $scope.storiesGridOptions);
      $scope.stories = [];
      $scope.storiesGridOptions.data.forEach( function (row)
        {
          if (row.above_or_below == 'Above')
          {
            above_cnt += 1;
            // save story to scope
            delete row.$$hashKey;
            $scope.stories.push(row);
          }
        });
      $scope.building.above_grade_story_count = above_cnt;

      // create vs update
      if (Shared.getBuildingId() != null) {
        Building.update({project_id: $scope.projectId}, $scope.building, success, failure);
      } else {
        Building.create({project_id: $scope.projectId}, $scope.building, success, failure);
      }

    };

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

    // Buttons
    $scope.addStory = function () {
      $scope.storiesGridOptions.data.push({
        name: "Story " + ($scope.storiesGridOptions.data.length + 1),
        z: 0,
        floor_to_floor_height: 14,
        floor_to_ceiling_height: 10,
        above_or_below: 'Above'
      });
    };
    $scope.duplicateStory = function () {
      $scope.storiesGridOptions.data.push({
        name: "Story " + ($scope.storiesGridOptions.data.length + 1),
        z: $scope.selected.z,
        floor_to_floor_height: $scope.selected.floor_to_floor_height,
        floor_to_ceiling_height: $scope.selected.floor_to_ceiling_height,
        above_or_below: $scope.selected.above_or_below
      });
    };
    $scope.deleteStory = function () {
      var index = $scope.storiesGridOptions.data.indexOf($scope.selected);
      $scope.storiesGridOptions.data.splice(index, 1);
      if (index > 0) {
        $scope.gridApi.selection.toggleRowSelection($scope.storiesGridOptions.data[index - 1]);
      } else {
        $scope.selected = null;
      }
    };

    $scope.storiesBelow = function () {
      // TODO
    };
  }
]);
