cbecc.controller('SystemsCtrl', [
  '$scope', '$window', '$routeParams', '$resource', '$location', 'Shared', function ($scope, $window, $routeParams, $resource, $location, Shared) {
    //collapsible panels
    $scope.systemPanels = [{
      title: 'VAV Air Systems',
      name: 'VAV',
      open: true
    }, {
      title: 'PVAV Air Systems',
      name: 'PVAV'
    }, {
      title: 'PTAC Zone Systems',
      name: 'PTAC'
    }, {
      title: 'MAU Air Systems',
      name: 'MAU'
    }, {
      title: 'Exhaust Systems',
      name: 'Exhaust'
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

    //get systems by type


  }
]);
