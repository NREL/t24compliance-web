cbecc.controller('ZonesCtrl', [
  '$scope', '$location', 'toaster', 'Shared', 'Enums', 'data', 'stories', 'spaces', 'zones', 'systems', 'terminals', function ($scope, $location, toaster, Shared, Enums, data, stories, spaces, zones, systems, terminals) {

    $scope.data = {
      stories: stories,
      spaces: spaces,
      zones: zones,
      systems: systems,
      exhausts: [],
      terminals: terminals
    };

    // pull exhaust systems out of systems (will be pushed back together before saving)
    $scope.data.exhausts = _.filter($scope.data.systems, {
      type: 'Exhaust'
    });
    $scope.data.non_exhaust_systems = _.filter($scope.data.systems, function (system) {
      return system.type !== 'Exhaust';
    });

    console.log('terminals:');
    console.log($scope.data.terminals);

    // add zone_id, zone_name to exhaust systems object
    _.each($scope.data.zones, function (zone) {
      if (zone.exhaust_system_reference) {
        console.log('Exhaust system reference is: ', '');
        _.each($scope.data.exhausts, function (system) {
          if (system.name === zone.exhaust_system_reference) {
            system.zone_id = zone.id;
            system.zone_name = zone.name;
            return false;
          }
        });

      }
    });
    console.log('adjusted exhaust systems (should have zone_id and zone_name)');
    console.log($scope.data.exhausts);

    // check zone primary_air_conditioning_system_reference field against available system names, clear any non-found system names
    _.each($scope.data.zones, function (zone) {
      if (zone.primary_air_conditioning_system_reference){
       var match =  _.find($scope.data.systems, {
         name: zone.primary_air_conditioning_system_reference
       });
       if (!match) {
         zone.primary_air_conditioning_system_reference = '';
       }
      }
    });

    // ZONES shouldn't span multiple stories, but we are not enforcing that here
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
      heading: 'Exhaust Systems',
      path: '/zones/exhausts',
      route: 'requirebuilding.zones.exhausts'
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
      var zone_name = selected.zone.name;
      console.log('Deleting zone: ', zone_name);
      var index = $scope.data.zones.indexOf(selected.zone);
      $scope.data.zones.splice(index, 1);
      if (index > 0) {
        gridApi.selection.toggleRowSelection($scope.data.zones[index - 1]);
      } else {
        selected.zone = null;
      }
      console.log('ZONE NAME: ', zone_name);
      // delete associated exhaust system (by zone name, start at end)
      _.eachRight($scope.data.exhausts, function(exhaust, ind){
         if (exhaust.zone_name == zone_name) $scope.data.exhausts.splice(ind, 1);
      });

      // remove thermal_zone_references to this zone
      _.each($scope.data.spaces, function (space) {
        if (space.thermal_zone_reference == zone_name) space.thermal_zone_reference = null;
      });

     // delete associated terminal (start at end)
      _.eachRight($scope.data.terminals, function (terminal, ind){
        if (terminal.zone_served_reference == zone_name) $scope.data.terminals.splice(ind, 1);
      });

    };

    // save
    $scope.submit = function () {
      console.log("submit");
      console.log($scope.data);
      //console.log('saving zones');
      //console.log($scope.data.zones);

      // add/update/delete exhaust system references and add to zone records (exhaust tab is not connected to zones data)
      _.each($scope.data.zones, function (zone) {
        var ref = _.find($scope.data.exhausts, {zone_name: zone.name });
        console.log("REF: ", ref);
        if (ref) {
          console.log("HI!");
          zone.exhaust_system_reference = ref.name;
        }
      });

      console.log("saving these zones:");
      console.log($scope.data.zones);

      // SAVE ZONES
      var params = Shared.defaultParams();
      params.data = $scope.data.zones;
      data.bulkSync('thermal_zones', params).then(success).catch(failure);

      function success(response) {
        toaster.pop('success', 'Thermal zones successfully saved');

        // IF SUCCESS, SAVE SPACES
        var params = Shared.defaultParams();
        params.data = $scope.data.spaces;
        data.bulkSync('spaces', params).then(success).catch(failure);

        function success(response) {
          toaster.pop('success', 'Spaces updated with thermal zone references');

          // IF SUCCESS, SAVE SYSTEMS
          var params = Shared.defaultParams();
          // push exhaust and non-exhaust systems back together
          systems = [];
          _.each($scope.data.non_exhaust_systems, function (system) {
            systems.push(system);
          });
          _.each($scope.data.exhausts, function (system) {
            systems.push(system);
          });
          console.log('ALL SYSTEMS BACK TOGETHER: ');
          console.log(systems);
          params.data = systems;
          data.bulkSync('zone_systems', params).then(success).catch(failure);

          function success(response) {
            toaster.pop('success', 'Exhaust systems successfully saved');
            var params = Shared.defaultParams();
            params.data = $scope.data.terminals;
            console.log("terminals to save:");
            console.log($scope.data.terminals);
            data.bulkSync('terminal_units', params).then(success).catch(failure);

            function success(response) {
              toaster.pop('success', 'Terminal units successfully saved');
            }

            function failure(response) {
              toaster.pop('error', 'An error occurred while saving terminal units', response.statusText);
            }
          }

          function failure(response) {
            toaster.pop('error', 'An error occurred while saving exhaust systems', response.statusText);
          }
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
