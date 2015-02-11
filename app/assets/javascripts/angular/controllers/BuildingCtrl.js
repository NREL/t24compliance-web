cbecc.controller('BuildingCtrl', ['$scope', '$log', '$stateParams', '$resource', '$location', 'uiGridConstants', 'toaster', 'data', 'Shared', 'building', 'stories', 'spaces', function ($scope, $log, $stateParams, $resource, $location, uiGridConstants, toaster, data, Shared, building, stories, spaces) {
  Shared.setIds($stateParams);
  $scope.stories = stories;
  $scope.spaces = spaces;
  $scope.building = building;
  $scope.spacesModified = false;

  // initialize building
  if (_.isEmpty($scope.building)) {
    $scope.building = {
      building_azimuth: 0,
      living_unit_count: 0,
      total_floor_area: 0,
      total_story_count: 0,
      above_grade_story_count: 0
    };
  }
  $scope.building.below_grade_story_count = $scope.building.total_story_count - $scope.building.above_grade_story_count;

  $scope.setModified = function () {
    Shared.setModified();
  };

  // Load saved spaces
  _.each($scope.spaces, function (space, spaceIndex) {
    space.surfaces = [];
    _.each(['interior_walls', 'exterior_walls', 'underground_walls', 'interior_floors', 'exterior_floors', 'underground_floors', 'roofs'], function (surfaceType) {
      _.each(space[surfaceType], function (surface) {
        surface.subsurfaces = [];
        _.each(['doors', 'skylights', 'windows'], function (subsurfaceType) {
          _.each(surface[subsurfaceType], function (subsurface) {
            surface.subsurfaces.push(subsurface);
          });
          delete surface[subsurfaceType];
        });
        if (surfaceType == 'interior_floors') {
          surface.type = 'Floor';
          surface.boundary = 'Interior';
        } else if (surfaceType == 'exterior_floors') {
          surface.type = 'Floor';
          surface.boundary = 'Exterior';
        } else if (surfaceType == 'underground_floors') {
          surface.type = 'Floor';
          surface.boundary = 'Underground';
        } else if (surfaceType == 'interior_walls') {
          surface.type = 'Wall';
          surface.boundary = 'Interior';
        } else if (surfaceType == 'exterior_walls') {
          surface.type = 'Wall';
          surface.boundary = 'Exterior';
        } else if (surfaceType == 'underground_walls') {
          surface.type = 'Wall';
          surface.boundary = 'Underground';
        } else if (surfaceType == 'roofs') {
          surface.type = 'Roof';
          surface.boundary = null;
        }
        space.surfaces.push(surface);
      });
      delete space[surfaceType];
    });
  });

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
      secondLine: Shared.html('ft'),
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (grid.appScope.autoElevation && rowRenderIndex) {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return !($scope.grid.appScope.autoElevation && $scope.rowRenderIndex);
      },
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'floor_to_floor_height',
      secondLine: Shared.html('ft'),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'floor_to_ceiling_height',
      secondLine: Shared.html('ft'),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
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
        if (newValue != oldValue) {
          Shared.setModified();

          if (colDef.name == 'name') {
            var unique = Shared.checkUnique($scope.stories, newValue, $scope.stories.indexOf(rowEntity));
            if (!unique) rowEntity.name = oldValue;
          } else if (colDef.name == 'z' || colDef.name == 'floor_to_floor_height') {
            if ($scope.autoElevation) {
              $scope.calculateElevation();
            }
            $scope.updateStoryCount();
          } else if (colDef.name == 'floor_to_ceiling_height') {
            if (rowEntity.hasOwnProperty('id')) {
              _.each($scope.spaces, function (space) {
                if (space.building_story_id == rowEntity.id && space.floor_to_ceiling_height == oldValue) {
                  $scope.spacesModified = true;
                  space.floor_to_ceiling_height = newValue;
                  _.each(space.interior_lighting_systems, function (lightingSystem) {
                    if (lightingSystem.luminaire_mounting_height == oldValue) lightingSystem.luminaire_mounting_height = newValue;
                  });
                }
              });
            }
          }
        }
      });
    }
  };


  $scope.autoElevation = _.every($scope.stories, function (story, index) {
    if (index === 0) return true;
    var lowerStory = $scope.stories[index - 1];
    return story.z == Shared.fixPrecision(lowerStory.z + lowerStory.floor_to_floor_height);
  });

  $scope.calculateElevation = function () {
    _.each($scope.stories, function (story, index) {
      if (index) {
        var lowerStory = $scope.stories[index - 1];
        story.z = Shared.fixPrecision(lowerStory.z + lowerStory.floor_to_floor_height);
      }
    });
    $scope.updateStoryCount();
  };

  $scope.$watch('autoElevation', function () {
    if ($scope.autoElevation) $scope.calculateElevation();
    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
  });

  // Buttons
  $scope.addStory = function (input) {
    Shared.setModified();

    var story = {
      name: Shared.uniqueName($scope.stories, _.template('Story <%= num %>')),
      z: 0,
      floor_to_floor_height: 14,
      floor_to_ceiling_height: 10
    };

    if ($scope.stories.length) {
      var lowerStory = $scope.stories[$scope.stories.length - 1];
      story.z = Shared.fixPrecision(lowerStory.z + lowerStory.floor_to_floor_height);
      story.floor_to_floor_height = lowerStory.floor_to_floor_height;
      story.floor_to_ceiling_height = lowerStory.floor_to_ceiling_height;
    }

    if (!_.isEmpty(input)) {
      _.merge(story, input);
    }

    $scope.stories.push(story);

    $scope.updateStoryCount();

    // Clear potential error help text
    if ($scope.hasOwnProperty('errors')) delete $scope.errors.total_story_count;
  };
  $scope.duplicateStory = function () {
    $scope.addStory({
      floor_to_floor_height: $scope.selected.floor_to_floor_height,
      floor_to_ceiling_height: $scope.selected.floor_to_ceiling_height
    });
  };
  $scope.deleteStory = function () {
    Shared.setModified();

    // Delete matching spaces
    if ($scope.selected.hasOwnProperty('id')) {
      _.remove($scope.spaces, {building_story_id: $scope.selected.id});
    }

    var index = $scope.stories.indexOf($scope.selected);
    $scope.stories.splice(index, 1);
    while (index > 0 && !$scope.gridApi.grid.rows[index - 1].visible) index--;
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
    return s.$invalid && s.$dirty ? 'has-error' : '';
  };

  $scope.storyError = function () {
    return !$scope.stories.length ? 'has-error' : '';
  };

  // save
  $scope.submit = function () {
    $log.debug('Submitting building');
    $scope.errors = {}; //clean up server errors

    function success(response) {
      toaster.pop('success', 'Building successfully saved');
      var id = response.hasOwnProperty('id') ? response.id : response._id;
      Shared.setBuildingId(id);
      // UPDATE STORIES
      _.each($scope.stories, function (story) {
        // ensure each story has a building_id defined
        if (story.building_id != id) story.building_id = id;
      });
      $log.debug('Submitting stories');

      var params = Shared.defaultParams();
      params.data = $scope.stories;
      data.bulkSync('building_stories', params).then(success).catch(failure);

      function success(response) {
        Shared.resetModified();
        toaster.pop('success', 'Building stories successfully saved');
        $location.path(Shared.buildingPath());

        if ($scope.spacesModified) {
          $log.debug('Submitting spaces');

          var params = Shared.defaultParams();
          params.data = $scope.spaces;
          data.bulkSync('spaces', params).then(success).catch(failure);

          function success(response) {
            $scope.spacesModified = false;
            toaster.pop('success', 'Space heights successfully updated');
          }

          function failure(response) {
            $log.error('Failure submitting spaces', response);
            toaster.pop('error', 'An error occurred while updating space heights', response.statusText);
          }
        }
      }

      function failure(response) {
        $log.error('Failure submitting building stories', response);
        toaster.pop('error', 'An error occurred while saving building stories', response.statusText);
      }
    }

    function failure(response) {
      $log.error('Failure submitting building', response);
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
}]);
