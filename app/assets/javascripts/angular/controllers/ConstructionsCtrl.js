cbecc.controller('ConstructionsCtrl', [
  '$scope', '$window', '$routeParams', '$resource', '$location', 'flash', '$modal', 'Construction', function ($scope, $window, $routeParams, $resource, $location, flash, $modal, Construction) {
    $scope.gridOptions = {
      data: 'data',
      enableRowHeaderSelection: true,
      enableRowSelection: true,
      multiSelect: false
    };

    //use Construction.index() to retrieve all constructions
    //use Construction.show(id) to retrieve a construction by id

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

    //collapsible panels
    $scope.panels = [
      {
        "title": "Exterior Wall Construction",
        "open": true
      },
      {
        "title": "Interior Wall Construction"
      },
      {
        "title": "Roof Construction"
      },
      {
        "title": "Window Construction"
      },
      {
        "title": "Skylight Construction"
      },
      {
        "title": "Raised Floor Construction"
      },
      {
        "title": "Slab-on-grade Construction"
      }
    ];

    $scope.gridOptions.onRegisterApi = function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (row.isSelected) {
          console.log(row.entity);
        } else {
          // No rows selected
        }
      });
    };

    // Modal Settings
    $scope.items = ['item1', 'item2', 'item3'];
    $scope.openLibraryModal = function (index) {

      var modalInstance = $modal.open({
        templateUrl: 'constructions/library.html',
        controller: 'ModalConstructionsLibraryCtrl',
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.panels[index].selected = selectedItem;
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };
  }
]);

cbecc.controller('ModalConstructionsLibraryCtrl', function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
