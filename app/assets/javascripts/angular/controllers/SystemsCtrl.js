cbecc.controller('SystemsCtrl', [
  '$scope', '$window', '$routeParams', '$resource', '$location', 'Shared', function ($scope, $window, $routeParams, $resource, $location, Shared) {
    //collapsible panels
    $scope.systemPanels = [{
      title: 'VAV Air Systems',
      open: true
    }, {
      title: 'PVAV Air Systems'
    }, {
      title: 'PTAC Zone Systems'
    }, {
      title: 'MAU Air Systems'
    }, {
      title: 'Exhaust Systems'
    }];

    $scope.plantPanels = [{
      title: 'Service Hot Water'
    }, {
      title: 'Chilled Water Plant'
    }, {
      title: 'Hot Water Plant'
    }, {
      title: 'Condenser Plant'
    }];
  }
]);
