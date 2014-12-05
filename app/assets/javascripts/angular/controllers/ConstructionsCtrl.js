cbecc.controller('ConstructionsCtrl', [
  '$scope', '$window', '$routeParams', '$resource', '$location', 'flash', function ($scope, $window, $routeParams, $resource, $location, flash) {

    $scope.data = [
      {
        "Category": "Concrete",
        "Standard Material Selection": "Concrete - 140 lb/ft3 -4 in",
        "R-Value": 0.3,
        "Thickness": 4.0,
        "Specific Heat": 0.22,
        "Density": 139.78,
        "Thermal Conductivity": 1.128,
        "Cavity Insulation R-Value": null,
        "Framing": "",
        "Configuration": "",
        "Depth": null
      },
      {
        "Category": "Composite",
        "Standard Material Selection": "",
        "R-Value": 10.0,
        "Thickness": 4.0,
        "Specific Heat": 0.22,
        "Density": 139.78,
        "Thermal Conductivity": null,
        "Cavity Insulation R-Value": 0.5,
        "Framing": "Wood",
        "Configuration": "Wall 24 inch OC",
        "Depth": 2
      },
      {
        "Category": "Wood",
        "Standard Material Selection": "Hardwood 1/2 inch",
        "R-Value": 0.43,
        "Thickness": 0.5,
        "Specific Heat": 0.39,
        "Density": 42.43,
        "Thermal Conductivity": .097,
        "Cavity Insulation R-Value": null,
        "Framing": "",
        "Configuration": "",
        "Depth": null
      }
    ];

  }
]);