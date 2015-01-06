cbecc.controller('SpacesCtrl', [
  '$scope', '$window', '$location', '$routeParams', '$resource', '$stateParams', 'uiGridConstants', 'Shared', 'stories', 'spaces', 'constructions', function ($scope, $window, $location, $routeParams, $resource, $stateParams, uiGridConstants, Shared, stories, spaces, constructions) {
    $scope.data = {
      stories: stories,
      spaces: spaces,
      constructions: constructions,
      surfaces: [],
      spacesGridOptions: {},
      settingsGridOptions: {},
      surfacesGridOptions: {},
      selectedSpace: null,
      gridApi: {},
      textFilter: {
        condition: uiGridConstants.filter.CONTAINS
      },
      numberFilter: [{
        condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
        placeholder: 'At least'
      }, {
        condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
        placeholder: 'No more than'
      }]
    };

    $scope.tabs = [{
      heading: 'Spaces',
      path: '/spaces',
      route: 'requirebuilding.spaces.main'
    }, {
      heading: 'Space Type Settings',
      path: '/spaces/settings',
      route: 'requirebuilding.spaces.settings'
    }, {
      heading: 'Surfaces: Walls, Floors, Ceilings, and Roofs',
      path: '/spaces/surfaces',
      route: 'requirebuilding.spaces.surfaces'
    }, {
      heading: 'Sub-surfaces: Windows, Doors, and Skylights',
      path: '/spaces/subsurfaces',
      route: 'requirebuilding.spaces.subsurfaces'
    }, {
      heading: 'Ventilation & Exhaust',
      path: '/spaces/ventilation',
      route: 'requirebuilding.spaces.ventilation'
    }, {
      heading: 'Loads',
      path: '/spaces/loads',
      route: 'requirebuilding.spaces.loads'
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

      // Update active subtab
      updateActiveTab();
    });

    // Buttons
    $scope.data.addSpace = function () {
      $scope.data.spaces.push({
        name: "Space " + ($scope.data.spaces.length + 1),
        floor_to_ceiling_height: 14,
        story: null,
        area: 400,
        conditioning_type: 'Directly Conditioned',
        envelope_status: 'New',
        lighting_status: 'New',

        space_function: 'Small Office',
        occupant_density: 10,
        hot_water_heating_rate: 0.18,
        receptacle_power_density: 1.5
      });
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
        $scope.data.gridApi.selection.toggleRowSelection($scope.data.spaces[index - 1]);
      } else {
        $scope.data.selectedSpace = null;
      }
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
    };

  }]);
