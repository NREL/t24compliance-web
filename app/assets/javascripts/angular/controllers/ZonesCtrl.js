cbecc.controller('ZonesCtrl', [
  '$scope', '$location', 'toaster', 'Shared', 'Enums', 'data', 'stories', 'spaces', 'zones', function ($scope, $location, toaster, Shared, Enums, data, stories, spaces, zones) {

    $scope.data = {
      stories: stories,
      spaces: spaces,
      zones: zones
    };

    console.log("Spaces");
    console.log($scope.data.spaces);
    console.log("Zones");
    console.log($scope.data.zones);

    $scope.data.storiesArr = [];
    $scope.data.storiesHash = {};
    _.each($scope.data.stories, function (story) {
      $scope.data.storiesArr.push({
        id: story.id,
        value: story.name
      });
      $scope.data.storiesHash[story.id] = story.name;
    });

    $scope.tabs = [{
      heading: 'Create Zones',
      path: '/zones',
      route: 'requirebuilding.zones.main'
    }, {
      heading: 'Attach Spaces',
      path: '/zones/spaces',
      route: 'requirebuilding.zones.spaces'
    }, {
      heading: 'Attach Systems',
      path: '/zones/systems',
      route: 'requirebuilding.zones.systems'
    }, {
      heading: 'Attach Terminals',
      path: '/zones/terminals',
      route: 'requirebuilding.zones.terminals'
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
      updateActiveTab();
    });


    // Buttons
    $scope.data.selectAll = function (gridApi) {
      gridApi.selection.selectAllVisibleRows();
    };
    $scope.data.clearAll = function (gridApi) {
      gridApi.selection.clearSelectedRows();
    };

    $scope.data.addZone = function () {
      var zone = {
        name: "Zone " + ($scope.data.zones.length + 1),
        story: $scope.data.stories[0].id,
        type: Enums.enums.zones_type_enums[0]
      };

      $scope.data.zones.push(zone);
    };
    $scope.data.deleteZone = function (selected, gridApi) {
      var index = $scope.data.zones.indexOf(selected.zone);
      $scope.data.zones.splice(index, 1);
      if (index > 0) {
        gridApi.selection.toggleRowSelection($scope.data.zones[index - 1]);
      } else {
        selected.zone = null;
      }
    };

    // save
    $scope.submit = function () {
      console.log("submit");

      console.log($scope.data);

      console.log('saving zones');
      var params = Shared.defaultParams();
      params['data'] = $scope.data.zones;
      data.bulkSync('thermal_zones', params).then(success).catch(failure);

      function success(response) {
        toaster.pop('success', 'Thermal zones successfully saved');

        var params = Shared.defaultParams();
        params['data'] = $scope.data.spaces;
        data.bulkSync('spaces', params).then(success).catch(failure);

        function success(response) {
          toaster.pop('success', 'Spaces updated with thermal zone references');
          $location.path(Shared.zonesPath());

        }

        function failure(response) {
          toaster.pop('error', 'An error occurred while saving spaces', response.statusText);
        }
      }

      function failure(response) {
        console.log("failure", response);
        toaster.pop('error', 'An error occurred while saving zones', response.statusText);
      }
    };

  }]);
