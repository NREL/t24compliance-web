cbecc.controller('SpacesCtrl', [
  '$scope', '$location', '$routeParams', '$resource', '$stateParams', 'uiGridConstants', 'Shared', 'stories', 'spaces', 'constructions', function ($scope, $location, $routeParams, $resource, $stateParams, uiGridConstants, Shared, stories, spaces, constructions) {
    $scope.data = {
      stories: stories,
      spaces: spaces,
      constructions: constructions,
      surfaces: [],
      subsurfaces: [],
      selectedSpace: null,
      selectedSurface: null,
      gridApiSpaces: {}
    };

    // Check for construction defaults
    if ($scope.data.constructions.length) {
      $scope.data.constructions = $scope.data.constructions[0];
    } else {
      $scope.data.constructions = null;
    }

    $scope.data.textFilter = {
      condition: uiGridConstants.filter.CONTAINS
    };

    $scope.data.numberFilter = [{
      condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
      placeholder: 'At least'
    }, {
      condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
      placeholder: 'No more than'
    }];

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
      // Reset row selection
      $scope.data.selectedSpace = null;
      $scope.data.selectedSurface = null;

      // Update active subtab
      updateActiveTab();
    });

    // Buttons
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

      $scope.data.spaces.push(space);
    };
    $scope.data.duplicateSpace = function () {
      $scope.data.spaces.push({
        name: "Space " + ($scope.data.spaces.length + 1),
        floor_to_ceiling_height: $scope.data.selectedSpace.floor_to_ceiling_height,
        story: $scope.data.selectedSpace.story,
        area: $scope.data.selectedSpace.area,
        conditioning_type: $scope.data.selectedSpace.conditioning_type,
        envelope_status: $scope.data.selectedSpace.envelope_status,
        lighting_status: $scope.data.selectedSpace.lighting_status,

        space_function: $scope.data.selectedSpace.space_function,
        occupant_density: $scope.data.selectedSpace.occupant_density,
        hot_water_heating_rate: $scope.data.selectedSpace.hot_water_heating_rate,
        receptacle_power_density: $scope.data.selectedSpace.receptacle_power_density
      });
    };
    $scope.data.deleteSpace = function () {
      var index = $scope.data.spaces.indexOf($scope.data.selectedSpace);
      $scope.data.spaces.splice(index, 1);
      if (index > 0) {
        $scope.data.gridApiSpaces.selection.toggleRowSelection($scope.data.spaces[index - 1]);
      } else {
        $scope.data.selectedSpace = null;
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
    $scope.data.restoreSpaceTypeDefaults = function () {
      _.each($scope.data.spaces, function (space) {
        space.occupant_density = space.occupant_density_default;
        space.hot_water_heating_rate = space.hot_water_heating_rate_default;
        space.receptacle_power_density = space.receptacle_power_density_default;
        $scope.data.gridApi.core.notifyDataChange($scope.data.gridApi.grid, uiGridConstants.dataChange.EDIT);
      });
    };
    $scope.data.modifiedSpaceTypeValues = function () {
      return !_.isEmpty(_.find($scope.data.spaces, function (space) {
        return (space.occupant_density !== space.occupant_density_default ||
        space.hot_water_heating_rate !== space.hot_water_heating_rate_default ||
        space.receptacle_power_density !== space.receptacle_power_density_default);
      }));
    };
    $scope.data.duplicateSurface = function () {
      // TODO
    };
    $scope.data.deleteSurface = function () {
      // TODO
    };

    // save
    $scope.submit = function () {
      console.log("submit");

      function success(response) {
        toaster.pop('success', 'Spaces successfully saved');
      }

      function failure(response) {
        console.log("failure", response);
        toaster.pop('error', 'An error occurred while saving', response.statusText);
      }

      // TODO Insert surfaces as children of spaces
    };

  }]);
