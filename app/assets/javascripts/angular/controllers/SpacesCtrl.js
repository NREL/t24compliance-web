cbecc.controller('SpacesCtrl', [
  '$scope', '$location', 'uiGridConstants', 'toaster', 'Shared', 'Enums', 'data', /*'constData', 'doorData', 'fenData',*/ 'stories', 'spaces', 'space_function_defaults', 'constructions', function ($scope, $location, uiGridConstants, toaster, Shared, Enums, data, /*constData, doorData, fenData,*/ stories, spaces, space_function_defaults, constructions) {
    $scope.data = {
      /*constData: constData,
       doorData: doorData,
       fenData: fenData,*/
      stories: stories,
      spaces: spaces,
      spaceFunctionDefaults: space_function_defaults,
      constructions: constructions,
      surfaces: [],
      subsurfaces: []
    };

    // Load saved spaces
    var surfaceIndex = 0;
    _.each($scope.data.spaces, function (space, spaceIndex) {
      _.each(['interior_walls', 'exterior_walls', 'underground_walls', 'interior_floors', 'exterior_floors', 'underground_floors', 'roofs'], function (surfaceType) {
        _.each(space[surfaceType], function (surface) {
          _.each(['doors', 'skylights', 'windows'], function (subsurfaceType) {
            _.each(surface[subsurfaceType], function (subsurface) {
              subsurface.space = spaceIndex;
              subsurface.surface = surfaceIndex;
              subsurface.building_story_id = space.building_story_id;
              if (subsurfaceType == 'doors') {
                subsurface.construction = subsurface.construct_assembly_reference;
              } else {
                subsurface.construction = subsurface.fenestration_construction_reference;
              }
              $scope.data.subsurfaces.push(subsurface);
            });
            delete surface[subsurfaceType];
          });
          surface.space = spaceIndex;
          if (surfaceType == 'interior_floors') {
            surface.type = 'Floor';
            surface.boundary = 'Interior';
            surface.adjacent_space = surface.adjacent_space_reference;
          } else if (surfaceType == 'exterior_floors') {
            surface.type = 'Floor';
            surface.boundary = 'Exterior';
          } else if (surfaceType == 'underground_floors') {
            surface.type = 'Floor';
            surface.boundary = 'Underground';
          } else if (surfaceType == 'interior_walls') {
            surface.type = 'Wall';
            surface.boundary = 'Interior';
            surface.adjacent_space = surface.adjacent_space_reference;
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
          surface.building_story_id = space.building_story_id;
          surface.construction = surface.construct_assembly_reference;
          $scope.data.surfaces.push(surface);
          surfaceIndex++;
        });
        delete space[surfaceType];
      });

      var defaults = _.find($scope.data.spaceFunctionDefaults, {
        name: space.space_function
      });
      space.occupant_density_default = defaults.occupant_density;
      space.hot_water_heating_rate_default = defaults.hot_water_heating_rate;
      space.receptacle_power_density_default = defaults.receptacle_power_density;
      space.exhaust_per_area_default = defaults.exhaust_per_area;
      space.exhaust_air_changes_per_hour_default = defaults.exhaust_air_changes_per_hour;
      space.total_exhaust = Shared.calculateTotalExhaust(space);
    });

    // Check for construction defaults
    if ($scope.data.constructions.length) {
      $scope.data.constructions = $scope.data.constructions[0];
    } else {
      $scope.data.constructions = null;
    }

    $scope.data.storiesArr = [];
    $scope.data.storiesHash = {};
    _.each($scope.data.stories, function (story) {
      $scope.data.storiesArr.push({
        id: story.id,
        value: story.name
      });
      $scope.data.storiesHash[story.id] = story.name;
    });

    // TODO Test this when spaces can be saved and loaded
    // Delete spaces that belong to nonexistent stories
    $scope.data.spaces = _.filter($scope.data.spaces, function (space) {
      return $scope.data.storiesHash.hasOwnProperty(space.building_story_id);
    });

    $scope.tabs = [{
      heading: 'Spaces',
      path: '/spaces',
      route: 'requirebuilding.spaces.main'
    }, {
      heading: 'Space Type Settings',
      path: '/spaces/settings',
      route: 'requirebuilding.spaces.settings'
    }, {
      heading: 'Surfaces',
      path: '/spaces/surfaces',
      route: 'requirebuilding.spaces.surfaces'
    }, {
      heading: 'Subsurfaces',
      path: '/spaces/subsurfaces',
      route: 'requirebuilding.spaces.subsurfaces'
    }, {
      heading: 'Ventilation & Exhaust',
      path: '/spaces/ventilation',
      route: 'requirebuilding.spaces.ventilation'
    }, {
      heading: 'Electric Process Loads',
      path: '/spaces/loads',
      route: 'requirebuilding.spaces.loads'
    }, {
      heading: 'Natural Gas',
      path: '/spaces/gas',
      route: 'requirebuilding.spaces.gas'
    }, {
      heading: 'Lighting',
      path: '/spaces/lighting',
      route: 'requirebuilding.spaces.lighting'
    }];

    function updateActiveTab() {
      // Reset tabs if the main nav button is clicked or the page is refreshed
      $scope.tabs.filter(function (element) {
        var regex = new RegExp('^/projects/[0-9a-f]{24}/buildings/[0-9a-f]{24}' + element.path + '$');
        if (regex.test($location.path())) element.active = true;
      });
    }

    updateActiveTab();
    $scope.$on('$locationChangeSuccess', function () {
      // Update active subtab
      updateActiveTab();
    });

    // Buttons
    $scope.data.selectAll = function (gridApi) {
      gridApi.selection.selectAllVisibleRows();
    };
    $scope.data.clearAll = function (gridApi) {
      gridApi.selection.clearSelectedRows();
    };

    $scope.data.addSpace = function (input) {
      var space = {
        name: "Space " + ($scope.data.spaces.length + 1),
        floor_to_ceiling_height: 14,
        building_story_id: $scope.data.stories[0].id,
        area: 400,
        conditioning_type: Enums.enums.spaces_conditioning_type_enums[0],
        envelope_status: Enums.enums.spaces_envelope_status_enums[0],
        lighting_status: Enums.enums.spaces_lighting_status_enums[0],
        space_function: Enums.enums.spaces_space_function_enums[0],

        process_electric: null,
        refrigeration: null,
        elevator_count: null,
        escalator_count: null,
        loads_radiant_fraction: null,
        loads_latent_fraction: null,
        loads_lost_fraction: null,
        elevator_lost_fraction: null,
        escalator_lost_fraction: null,

        gas_equipment: null,
        process_gas: null,
        gas_radiant_fraction: null,
        gas_latent_fraction: null,
        gas_lost_fraction: null
      };

      if (!_.isEmpty(input)) {
        _.merge(space, input);
      }

      // TODO Lookup space defaults
      space.occupant_density = 10;
      space.occupant_density_default = 10;
      space.hot_water_heating_rate = 0.18;
      space.hot_water_heating_rate_default = 0.18;
      space.receptacle_power_density = 1.5;
      space.receptacle_power_density_default = 1.5;

      space.exhaust_per_area = 10;
      space.exhaust_per_area_default = 10;
      space.exhaust_air_changes_per_hour = 0.18;
      space.exhaust_air_changes_per_hour_default = 0.18;

      $scope.data.updateTotalExhaust(space);
      $scope.data.spaces.push(space);
    };
    $scope.data.duplicateSpace = function (selected) {
      // TODO handle children
      var selectedSpace = selected.space;
      $scope.data.spaces.push({
        name: "Space " + ($scope.data.spaces.length + 1),
        floor_to_ceiling_height: selectedSpace.floor_to_ceiling_height,
        building_story_id: selectedSpace.building_story_id,
        area: selectedSpace.area,
        conditioning_type: selectedSpace.conditioning_type,
        envelope_status: selectedSpace.envelope_status,
        lighting_status: selectedSpace.lighting_status,
        space_function: selectedSpace.space_function,

        gas_equipment: selectedSpace.gas_equipment,
        process_gas: selectedSpace.process_gas,
        gas_radiant_fraction: selectedSpace.gas_radiant_fraction,
        gas_latent_fraction: selectedSpace.gas_latent_fraction,
        gas_lost_fraction: selectedSpace.gas_lost_fraction,

        occupant_density: selectedSpace.occupant_density,
        occupant_density_default: selectedSpace.occupant_density_default,
        hot_water_heating_rate: selectedSpace.hot_water_heating_rate,
        hot_water_heating_rate_default: selectedSpace.hot_water_heating_rate_default,
        receptacle_power_density: selectedSpace.receptacle_power_density,
        receptacle_power_density_default: selectedSpace.receptacle_power_density_default
      });
    };
    $scope.data.deleteSpace = function (selected, gridApi) {
      var spaceIndex = $scope.data.spaces.indexOf(selected.space);

      // Delete subsurfaces
      _.eachRight($scope.data.surfaces, function (surface, surfaceIndex) {
        if (surface.space == spaceIndex) {
          // Delete subsurfaces
          $scope.data.subsurfaces = _.difference($scope.data.subsurfaces, _.where($scope.data.subsurfaces, {'surface': surfaceIndex}));

          // Update subsurface surface parent
          _.each($scope.data.subsurfaces, function (subsurface) {
            if (subsurface.surface > surfaceIndex) {
              subsurface.surface--;
            }
          });
        }
      });

      // Delete surfaces
      $scope.data.surfaces = _.difference($scope.data.surfaces, _.where($scope.data.surfaces, {'space': spaceIndex}));

      // Update subsurface/surface parents
      _.each($scope.data.subsurfaces, function (subsurface) {
        if (subsurface.space > spaceIndex) {
          subsurface.space--;
        }
      });
      _.each($scope.data.surfaces, function (surface) {
        if (surface.space > spaceIndex) {
          surface.space--;
        }
      });

      $scope.data.spaces.splice(spaceIndex, 1);
      if (spaceIndex > 0) {
        gridApi.selection.toggleRowSelection($scope.data.spaces[spaceIndex - 1]);
      } else {
        selected.space = null;
      }
    };

    $scope.data.addSurface = function (type, boundary, spaceIndex) {
      if (spaceIndex === undefined) {
        spaceIndex = 0;
      }

      var name = $scope.data.spaces[spaceIndex].name + ' ' + type;
      var surfaceType = type;

      if (type == 'Wall' || type == 'Floor') {
        var len = _.filter($scope.data.surfaces, function (surface) {
          return surface.space == spaceIndex && surface.type == type;
        }).length;
        name += ' ' + (len + 1);
        surfaceType = boundary + ' ' + surfaceType;
      }
      $scope.data.surfaces.push({
        name: name,
        space: spaceIndex,
        type: type,
        boundary: boundary,
        surface_type: surfaceType,
        building_story_id: $scope.data.spaces[spaceIndex].building_story_id,
        area: null,
        azimuth: null,
        construction: null,
        adjacent_space: null,
        tilt: null,
        height: null,
        perimeter_exposed: null
      });
    };
    $scope.data.restoreSpaceTypeSettingsDefaults = function (gridApi) {
      _.each($scope.data.spaces, function (space) {
        space.occupant_density = space.occupant_density_default;
        space.hot_water_heating_rate = space.hot_water_heating_rate_default;
        space.receptacle_power_density = space.receptacle_power_density_default;
        gridApi.core.notifyDataChange(gridApi.grid, uiGridConstants.dataChange.EDIT);
      });
    };
    $scope.data.modifiedSpaceTypeSettingsValues = function () {
      return !_.isEmpty(_.find($scope.data.spaces, function (space) {
        return (space.occupant_density !== space.occupant_density_default ||
        space.hot_water_heating_rate !== space.hot_water_heating_rate_default ||
        space.receptacle_power_density !== space.receptacle_power_density_default);
      }));
    };
    $scope.data.restoreSpaceTypeVentilationDefaults = function (gridApi) {
      _.each($scope.data.spaces, function (space) {
        space.exhaust_per_area = space.exhaust_per_area_default;
        space.exhaust_air_changes_per_hour = space.exhaust_air_changes_per_hour_default;
        $scope.data.updateTotalExhaust(space);
        gridApi.core.notifyDataChange(gridApi.grid, uiGridConstants.dataChange.EDIT);
      });
    };
    $scope.data.modifiedSpaceTypeVentilationValues = function () {
      return !_.isEmpty(_.find($scope.data.spaces, function (space) {
        return (space.exhaust_per_area !== space.exhaust_per_area_default || space.exhaust_air_changes_per_hour !== space.exhaust_air_changes_per_hour_default);
      }));
    };
    $scope.data.duplicateSurface = function (selected) {
      // TODO handle children
      var selectedSurface = selected.surface;
      var spaceIndex = selectedSurface.space;

      var name = $scope.data.spaces[spaceIndex].name + ' ' + selectedSurface.type;
      if (selectedSurface.type == 'Wall' || selectedSurface.type == 'Floor') {
        var len = _.filter($scope.data.surfaces, function (surface) {
          return surface.space == spaceIndex && surface.type == selectedSurface.type;
        }).length;
        name += ' ' + (len + 1);
      }

      $scope.data.surfaces.push({
        name: name,
        space: selectedSurface.space,
        type: selectedSurface.type,
        boundary: selectedSurface.boundary,
        surface_type: selectedSurface.surface_type,
        building_story_id: selectedSurface.building_story_id,
        area: selectedSurface.area,
        azimuth: selectedSurface.azimuth,
        construction: selectedSurface.construction,
        adjacent_space: selectedSurface.adjacent_space,
        tilt: selectedSurface.tilt,
        height: selectedSurface.height,
        perimeter_exposed: selectedSurface.perimeter_exposed
      });
    };
    $scope.data.deleteSurface = function (selected, gridApi) {
      var surfaceIndex = $scope.data.surfaces.indexOf(selected.surface);

      // Delete subsurfaces
      $scope.data.subsurfaces = _.difference($scope.data.subsurfaces, _.where($scope.data.subsurfaces, {'surface': surfaceIndex}));

      // Update subsurface parents
      _.each($scope.data.subsurfaces, function (subsurface) {
        if (subsurface.surface > surfaceIndex) {
          subsurface.surface--;
        }
      });

      $scope.data.surfaces.splice(surfaceIndex, 1);
      if (surfaceIndex > 0) {
        gridApi.selection.toggleRowSelection($scope.data.surfaces[surfaceIndex - 1]);
      } else {
        selected.surface = null;
      }
    };

    $scope.data.addSubsurface = function (type, surfaceIndex) {
      if (surfaceIndex === undefined) {
        surfaceIndex = 0;
      }

      $scope.data.subsurfaces.push({
        name: $scope.data.surfaces[surfaceIndex].name + ' ' + type,
        space: $scope.data.surfaces[surfaceIndex].space,
        surface: surfaceIndex,
        type: type,
        building_story_id: $scope.data.spaces[$scope.data.surfaces[surfaceIndex].space].building_story_id,
        area: null,
        construction: null
      });
    };
    $scope.data.duplicateSubsurface = function (selected, newParent) {
      var selectedSubsurface = selected.subsurface;

      var surface = newParent === undefined ? selectedSubsurface.surface : newParent;
      var space = $scope.data.surfaces[surface].space;

      $scope.data.subsurfaces.push({
        name: selectedSubsurface.name,
        space: space,
        surface: surface,
        type: selectedSubsurface.type,
        building_story_id: selectedSubsurface.building_story_id,
        area: selectedSubsurface.area,
        construction: selectedSubsurface.construction
      });
    };
    $scope.data.deleteSubsurface = function (selected, gridApi) {
      var subsurfaceIndex = $scope.data.subsurfaces.indexOf(selected.subsurface);
      $scope.data.subsurfaces.splice(subsurfaceIndex, 1);
      if (subsurfaceIndex > 0) {
        gridApi.selection.toggleRowSelection($scope.data.subsurfaces[subsurfaceIndex - 1]);
      } else {
        selected.subsurface = null;
      }
    };

    $scope.data.updateTotalExhaust = function (space) {
      space.total_exhaust = Shared.calculateTotalExhaust(space);
    };

    // save
    $scope.submit = function () {
      console.log("submit");

      var spaces = angular.copy($scope.data.spaces);
      var surfaces = angular.copy($scope.data.surfaces);
      var subsurfaces = angular.copy($scope.data.subsurfaces);
      _.each(spaces, function (space) {
        space.surfaces = [];
      });
      _.each(surfaces, function (surface, surfaceIndex) {
        surface.subsurfaces = _.where(subsurfaces, {'surface': surfaceIndex});
        spaces[surface.space].surfaces.push(surface);
      });

      var params = Shared.defaultParams();
      params.data = spaces;
      data.bulkSync('spaces', params).then(success).catch(failure);


      function success(response) {
        toaster.pop('success', 'Spaces successfully saved');
      }

      function failure(response) {
        console.log("failure", response);
        toaster.pop('error', 'An error occurred while saving', response.statusText);
      }
    };

  }]);
