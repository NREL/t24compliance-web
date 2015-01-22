cbecc.controller('BuildingCtrl', ['$scope', '$stateParams', '$resource', '$location', 'toaster', 'data', 'Shared', 'stories', function ($scope, $stateParams, $resource, $location, toaster, data, Shared, stories) {
  Shared.setIds($stateParams);

  $scope.stories = stories;

  $scope.updateStoryCount = function () {
    $scope.above = _.filter($scope.stories, function (story) {
      return story.z >= 0;
    }).length;
    $scope.below = $scope.stories.length - $scope.above;
  };
  $scope.updateStoryCount();

  // Stories UI Grid
  $scope.storiesGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Story Name'
    }, {
      name: 'z',
      displayName: 'Height Above Ground',
      cellEditableCondition: function ($scope) {
        if ($scope.grid.appScope.autoElevation && $scope.rowRenderIndex) return false;
        return true;
      }
    }, {
      name: 'floor_to_floor_height'
    }, {
      name: 'floor_to_ceiling_height'
    }],
    data: $scope.stories,
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
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        if ((colDef.name == 'z' || colDef.name == 'floor_to_floor_height') && newValue != oldValue) {
          if ($scope.autoElevation) {
            $scope.calculateElevation();
          }
          $scope.updateStoryCount();
        }
      });
    }
  };

  if (Shared.getBuildingId() === null) {
    // new building
    $scope.building = {
      building_azimuth: 0,
      living_unit_count: 0,
      total_floor_area: 0
    };
  } else {
    data.show('buildings', {project_id: Shared.getProjectId(), id: Shared.getBuildingId()}).then(function (response) {
      $scope.building = response;
      $scope.building.below_grade_story_count = $scope.building.total_story_count - $scope.building.above_grade_story_count;
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

  $scope.autoElevation = _.every($scope.stories, function (story, index) {
    if (index === 0) return true;
    var lowerStory = $scope.stories[index - 1];
    return story.z == lowerStory.z + lowerStory.floor_to_floor_height;
  });

  $scope.calculateElevation = function () {
    _.each($scope.stories, function (story, index) {
      if (index) {
        var lowerStory = $scope.stories[index - 1];
        story.z = lowerStory.z + lowerStory.floor_to_floor_height;
      }
    });
    $scope.updateStoryCount();
  };

  $scope.$watch('autoElevation', function () {
    if ($scope.autoElevation) $scope.calculateElevation();
  });

  // save
  $scope.submit = function () {
    console.log("submit");
    $scope.errors = {}; //clean up server errors

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
      data.bulkSync('building_stories', params);
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

      _.each(response.data.errors, function (errors, field) {
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
    $scope.building.above_grade_story_count = $scope.above;
    $scope.building.total_story_count = $scope.stories.length;


    // create vs update
    if (Shared.getBuildingId()) {
      data.update('buildings', $scope.building).then(success).catch(failure);
    } else {
      data.create('buildings', $scope.building).then(success).catch(failure);
    }

  };

  // Buttons
  $scope.addStory = function () {
    var z = 0;
    var floor_to_floor_height = 14;
    var floor_to_ceiling_height = 10;

    if ($scope.stories.length) {
      var lowerStory = $scope.stories[$scope.stories.length - 1];
      z = lowerStory.z + lowerStory.floor_to_floor_height;
      floor_to_floor_height = lowerStory.floor_to_floor_height;
      floor_to_ceiling_height = lowerStory.floor_to_ceiling_height;
    }

    $scope.stories.push({
      name: "Story " + ($scope.stories.length + 1),
      z: z,
      floor_to_floor_height: floor_to_floor_height,
      floor_to_ceiling_height: floor_to_ceiling_height
    });

    $scope.updateStoryCount();

    // Clear potential error help text
    if ($scope.hasOwnProperty('errors')) delete $scope.errors.total_story_count;
  };
  $scope.duplicateStory = function () {
    var lowerStory = $scope.stories[$scope.stories.length - 1];
    var z = lowerStory.z + lowerStory.floor_to_floor_height;

    $scope.stories.push({
      name: "Story " + ($scope.stories.length + 1),
      z: z,
      floor_to_floor_height: $scope.selected.floor_to_floor_height,
      floor_to_ceiling_height: $scope.selected.floor_to_ceiling_height
    });

    $scope.updateStoryCount();
  };
  $scope.deleteStory = function () {
    var index = $scope.stories.indexOf($scope.selected);
    $scope.stories.splice(index, 1);
    if (index > 0) {
      $scope.gridApi.selection.toggleRowSelection($scope.stories[index - 1]);
    } else {
      $scope.selected = null;
    }

    $scope.updateStoryCount();

    if ($scope.autoElevation) {
      $scope.calculateElevation();
    }
  };

  // Form Errors
  $scope.errorClass = function (name) {
    var s = $scope.form[name];
    return s.$invalid && s.$dirty ? "has-error" : "";
  };

  $scope.storyError = function () {
    return !$scope.stories.length ? "has-error" : "";
  };
}
]);
