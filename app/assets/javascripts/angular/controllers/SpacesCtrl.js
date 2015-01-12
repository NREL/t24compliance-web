cbecc.controller('SpacesCtrl', [
  '$scope', '$location', 'uiGridConstants', 'Shared', /*'constData', 'fenData',*/ 'stories', 'spaces', 'constructions', function ($scope, $location, uiGridConstants, Shared, /*constData, fenData,*/ stories, spaces, constructions) {
    $scope.data = {
      /*constData: constData,
       fenData: fenData,*/
      stories: stories,
      spaces: spaces,
      constructions: constructions,
      surfaces: [],
      subsurfaces: []
    };

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
      return $scope.data.storiesHash.hasOwnProperty(space.story);
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
      gridApi.selection.selectAllRows();
    };
    $scope.data.clearAll = function (gridApi) {
      gridApi.selection.clearSelectedRows();
    };

    $scope.data.addSpace = function (input) {
      var space = {
        name: "Space " + ($scope.data.spaces.length + 1),
        floor_to_ceiling_height: 14,
        story: $scope.data.stories[0].id,
        area: 400,
        conditioning_type: 0,
        envelope_status: 0,
        lighting_status: 0,
        space_function: 0,

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
      space.exhaust_per_space = 250;
      space.exhaust_per_space_default = 250;

      $scope.data.updateTotalExhaust(space);
      $scope.data.spaces.push(space);
    };
    $scope.data.duplicateSpace = function (selected) {
      // TODO handle children
      var selectedSpace = selected.space;
      $scope.data.spaces.push({
        name: "Space " + ($scope.data.spaces.length + 1),
        floor_to_ceiling_height: selectedSpace.floor_to_ceiling_height,
        story: selectedSpace.story,
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
      // TODO handle children
      var index = $scope.data.spaces.indexOf(selected.space);
      $scope.data.spaces.splice(index, 1);
      if (index > 0) {
        gridApi.selection.toggleRowSelection($scope.data.spaces[index - 1]);
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
        story: $scope.data.spaces[spaceIndex].story,
        area: null,
        azimuth: null,
        construction: null,
        adjacent_space: null,
        tilt: null,
        wall_height: null,
        exposed_perimeter: null
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
        space.exhaust_per_space = space.exhaust_per_space_default;
        $scope.data.updateTotalExhaust(space);
        gridApi.core.notifyDataChange(gridApi.grid, uiGridConstants.dataChange.EDIT);
      });
    };
    $scope.data.modifiedSpaceTypeVentilationValues = function () {
      return !_.isEmpty(_.find($scope.data.spaces, function (space) {
        return (space.exhaust_per_area !== space.exhaust_per_area_default ||
        space.exhaust_air_changes_per_hour !== space.exhaust_air_changes_per_hour_default ||
        space.exhaust_per_space !== space.exhaust_per_space_default);
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
        story: selectedSurface.story,
        area: selectedSurface.area,
        azimuth: selectedSurface.azimuth,
        construction: selectedSurface.construction,
        adjacent_space: selectedSurface.adjacent_space,
        tilt: selectedSurface.tilt,
        wall_height: selectedSurface.wall_height,
        exposed_perimeter: selectedSurface.exposed_perimeter
      });
    };
    $scope.data.deleteSurface = function (selected, gridApi) {
      // TODO handle children
      var index = $scope.data.surfaces.indexOf(selected.surface);
      $scope.data.surfaces.splice(index, 1);
      if (index > 0) {
        gridApi.selection.toggleRowSelection($scope.data.surfaces[index - 1]);
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
        story: $scope.data.spaces[$scope.data.surfaces[surfaceIndex].space].story,
        area: null,
        construction: null
      });
    };
    $scope.data.duplicateSubsurface = function (selected) {
      var selectedSubsurface = selected.subsurface;

      $scope.data.subsurfaces.push({
        name: selectedSubsurface.name,
        space: selectedSubsurface.space,
        surface: selectedSubsurface.surface,
        type: selectedSubsurface.type,
        story: selectedSubsurface.story,
        area: selectedSubsurface.area,
        construction: selectedSubsurface.construction
      });
    };
    $scope.data.deleteSubsurface = function (selected, gridApi) {
      var index = $scope.data.subsurfaces.indexOf(selected.subsurface);
      $scope.data.subsurfaces.splice(index, 1);
      if (index > 0) {
        gridApi.selection.toggleRowSelection($scope.data.subsurfaces[index - 1]);
      } else {
        selected.subsurface = null;
      }
    };

    $scope.data.updateTotalExhaust = function (space) {
      space.total_exhaust = Math.round((space.exhaust_per_area * space.area) + (space.exhaust_air_changes_per_hour * space.floor_to_ceiling_height * space.area / 60) + space.exhaust_per_space);
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
      _.each(surfaces, function (surface) {
        surface.subsurfaces = [];
        spaces[surface.space].surfaces.push(surface);
      });
      _.each(subsurfaces, function (subsurface) {
        spaces[surfaces[subsurface.surface].space].surfaces[subsurface.surface].subsurfaces.push(subsurface);
      });
      console.log(spaces);

      function success(response) {
        toaster.pop('success', 'Spaces successfully saved');
      }

      function failure(response) {
        console.log("failure", response);
        toaster.pop('error', 'An error occurred while saving', response.statusText);
      }
    };

  }]);
