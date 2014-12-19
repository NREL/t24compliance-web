cbecc.controller('ZonesCtrl', [
  '$scope', '$window', '$routeParams', '$resource', '$location', 'Shared', function ($scope, $window, $routeParams, $resource, $location, Shared) {

    $scope.tabs = [{
      heading: 'Create Zones',
      path: '/zones',
      route: 'zones.main'
    }, {
      heading: 'Attach Spaces',
      path: '/zones/spaces',
      route: 'zones.spaces'
    }, {
      heading: 'Attach Systems',
      path: '/zones/systems',
      route: 'zones.systems'
    }, {
      heading: 'Attach Terminals',
      path: '/zones/terminals',
      route: 'zones.terminals'
    }];

    function updateActiveTab() {
      // Reset tabs if the main Spaces nav button is clicked
      $scope.tabs.filter(function (element) {
        if ($location.path() === element.path) element.active = true;
      });
    }

    updateActiveTab();
    $scope.$on('$locationChangeSuccess', function () {
      updateActiveTab();
    });

  }
]);
