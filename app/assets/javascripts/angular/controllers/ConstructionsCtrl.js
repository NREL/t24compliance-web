cbecc.controller('ConstructionsCtrl', [
  '$scope', '$window', '$routeParams', '$resource', '$location', 'flash', '$modal', 'uiGridConstants', 'Construction', 'ConstructionDefaults', 'Shared', function ($scope, $window, $routeParams, $resource, $location, flash, $modal, uiGridConstants, Construction, ConstructionDefaults, Shared) {
    //use Construction.index() to retrieve all constructions
    //use Construction.show(id) to retrieve a construction by id
    $scope.data = Construction.index();

    //retrieve saved defaults (if any)
    $scope.defaults = ConstructionDefaults.index({project_id: Shared.getProjectId()});

    //collapsible panels
    $scope.panels = [{
      title: "Exterior Wall Construction",
      name: 'external_wall',
      open: true
    }, {
      title: "Interior Wall Construction",
      name: 'internal_wall'
    }, {
      title: "Roof Construction",
      name: 'roof'
    }, {
      title: "Window Construction",
      name: 'window'
    }, {
      title: "Skylight Construction",
      name: 'skylight'
    }, {
      title: "Raised Floor Construction",
      name: 'raised_floor'
    }, {
      title: "Slab-on-grade Construction",
      name: 'slab_on_grade'
    }];
    $scope.panels.forEach(function (panel) {
      panel.gridOptions = {
        columnDefs: [{name: 'name', displayName: 'Layer'}, {name: 'code_category'}],
        enableColumnMenus: false,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
        enableSorting: false,
        enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED
      };
    });

    // Modal Settings
    $scope.openLibraryModal = function (index, rowEntity) {
      var modalInstance = $modal.open({
        backdrop: 'static',
        controller: 'ModalConstructionsLibraryCtrl',
        templateUrl: 'constructions/library.html',
        windowClass: 'wide-modal',
        resolve: {
          params: function () {
            return {
              data: $scope.data,
              rowEntity: rowEntity,
              title: $scope.panels[index].title
            };
          }
        }
      });

      modalInstance.result.then(function (selectedConstruction) {
        $scope.panels[index].selected = selectedConstruction;
        $scope.panels[index].gridOptions.data = selectedConstruction.layers;
      }, function () {
        // Modal canceled
      });
    };

    // save
    $scope.submit = function () {
      console.log("submit");

      $scope.panels.forEach(function (panel) {



      });

    };

    // Remove Button
    $scope.removeConstruction = function (index) {
      $scope.panels[index].selected = null;
      $scope.panels[index].gridOptions.data = [];
    };
  }
]);

cbecc.controller('ModalConstructionsLibraryCtrl', [
  '$scope', '$modalInstance', '$interval', 'Construction', 'uiGridConstants', 'params', function ($scope, $modalInstance, $interval, Construction, uiGridConstants, params) {
    $scope.data = params.data;
    $scope.title = params.title;
    $scope.layerData = [];
    $scope.selected = null;

    $scope.constructionsGridOptions = {
      columnDefs: [{
        name: 'name',
        enableHiding: false,
        filter: {
          condition: uiGridConstants.filter.CONTAINS
        },
        minWidth: 400
      }, {
        name: 'type',
        enableHiding: false,
        filter: {
          condition: uiGridConstants.filter.CONTAINS
        }
      }, {
        name: 'framing_configuration',
        enableHiding: false,
        filter: {
          condition: uiGridConstants.filter.CONTAINS
        },
        maxWidth: 218
      }, {
        name: 'framing_size',
        enableHiding: false,
        filter: {
          condition: uiGridConstants.filter.CONTAINS
        },
        maxWidth: 159
      }, {
        name: 'cavity_insulation_r_value',
        enableHiding: false,
        filters: [{
          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
          placeholder: 'At least'
        }, {
          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
          placeholder: 'No more than'
        }]
      }, {
        name: 'continuous_insulation_r_value',
        enableHiding: false,
        filters: [{
          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
          placeholder: 'At least'
        }, {
          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
          placeholder: 'No more than'
        }]
      }, {
        name: 'continuous_insulation_material_name',
        enableHiding: false,
        filter: {
          condition: uiGridConstants.filter.CONTAINS
        },
        minWidth: 300
      }],
      data: 'data',
      enableFiltering: true,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      multiSelect: false,
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          if (row.isSelected) {
            $scope.selected = row.entity;
            $scope.layerData = row.entity.layers;
          } else {
            // No rows selected
            $scope.selected = null;
            $scope.layerData = [];
          }
        });
        if (typeof(params.rowEntity) !== 'undefined' && params.rowEntity) {
          $interval(function () {
            $scope.gridApi.selection.selectRow(params.rowEntity);
          }, 0, 1);
        }
      }
    };

    $scope.layersGridOptions = {
      columnDefs: [{name: 'name', displayName: 'Layer'}, {name: 'code_category'}],
      data: 'layerData',
      enableColumnMenus: false,
      enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
      enableSorting: false,
      enableVerticalScrollbar: uiGridConstants.scrollbars.ALWAYS
    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]);
