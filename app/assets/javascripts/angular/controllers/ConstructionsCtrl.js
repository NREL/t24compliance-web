cbecc.controller('ConstructionsCtrl', [
  '$scope', '$window', '$routeParams', '$resource', '$location', '$modal', 'uiGridConstants', 'toaster', 'ConstructionDefaults', 'Shared', 'constData', 'fenData', 'defaults', function ($scope, $window, $routeParams, $resource, $location, $modal, uiGridConstants, toaster, ConstructionDefaults, Shared, constData, fenData, defaults) {
    Shared.stopSpinner();

    // construction data
    $scope.data = constData;
    $scope.fenData = fenData;

    // retrieve saved defaults (if any)
    $scope.defaults = defaults[0] || {};

    // retrieve each saved default record from ids
    function getSelected(the_data, the_id) {
      return _.find(the_data, {'id': the_id});
    }

    //collapsible panels
    $scope.panels = [{
      title: "Exterior Wall Construction",
      name: 'exterior_wall'
    }, {
      title: "Interior Wall Construction",
      name: 'interior_wall'
    }, {
      title: "Underground Wall Construction",
      name: 'underground_wall'
    }, {
      title: "Roof Construction",
      name: 'roof'
    }, {
      title: "Door Construction",
      name: 'door'
    }, {
      title: "Interior Floor Construction",
      name: 'interior_floor'
    }, {
      title: "Exterior Floor Construction",
      name: 'exterior_floor'
    }, {
      title: "Underground Floor Construction",
      name: 'underground_floor'
    }];

    $scope.panels.forEach(function (panel) {
      panel.gridOptions = {
        columnDefs: [{name: 'name', displayName: 'Layer'}, {name: 'code_category'}],
        enableColumnMenus: false,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
        enableSorting: false,
        enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER
      };

      // retrieve selected and layers
      var sel = getSelected($scope.data, $scope.defaults[panel.name]);
      if (sel) {
        panel.selected = sel;
        panel.gridOptions.data = sel.layers;
        panel.open = true;
      } else {
        panel.open = false;
      }
    });


    $scope.fenPanels = [{
      title: "Window Construction",
      name: 'window'
    }, {
      title: "Skylight Construction",
      name: 'skylight'
    }];

    $scope.fenPanels.forEach(function (panel) {
      panel.fenGridOptions = {
        columnDefs: [
          {name: 'name'},
          {name: 'type'},
          {name: 'certification_method'},
          {name: 'u_factor'},
          {name: 'solar_heat_gain_coefficient'},
          {name: 'visible_transmittance'},
          {name: 'number_of_panes'},
          {name: 'frame_type'},
          {name: 'divider_type'},
          {name: 'tint'},
          {name: 'gas_fill'},
          {name: 'low_emissivity_coating'}],
        enableColumnMenus: false,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
        enableSorting: false,
        enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER
      };

      // retrieve selected
      var sel = getSelected($scope.fenData, $scope.defaults[panel.name]);
      if (sel) {
        panel.selected = sel;
        panel.fenGridOptions.data = [sel];
        panel.open = true;
      } else {
        panel.open = false;
      }
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

    // Modal Settings
    $scope.openFenLibraryModal = function (index, rowEntity) {
      var modalInstance = $modal.open({
        backdrop: 'static',
        controller: 'ModalFenestrationLibraryCtrl',
        templateUrl: 'constructions/fen_library.html',
        windowClass: 'wide-modal',
        resolve: {
          params: function () {
            return {
              data: $scope.fenData,
              rowEntity: rowEntity,
              title: $scope.fenPanels[index].title
            };
          }
        }
      });

      modalInstance.result.then(function (selectedFen) {
        $scope.fenPanels[index].selected = selectedFen;
        $scope.fenPanels[index].fenGridOptions.data = [selectedFen];
      }, function () {
        // Modal canceled
      });
    };


    // save (constructions and fenestrations saved in same record
    $scope.submit = function () {
      console.log("submit");

      function success(response) {
        toaster.pop('success', 'Construction defaults successfully saved');

        $location.path(Shared.constructionsPath());

      }

      function failure(response) {
        console.log("failure", response);
        toaster.pop('error', 'An error occurred while saving', response.statusText);
      }

      var construction_defaults = {};
      $scope.panels.forEach(function (panel) {
        construction_defaults[panel.name] = panel.selected ? panel.selected.id : null;
      });
      $scope.fenPanels.forEach(function (panel) {
        construction_defaults[panel.name] = panel.selected ? panel.selected.id : null;
      });

      ConstructionDefaults.createUpdate({project_id: Shared.getProjectId()}, construction_defaults, success, failure);


    };

    // Remove Buttons
    $scope.removeConstruction = function (index) {
      $scope.panels[index].selected = null;
      $scope.panels[index].gridOptions.data = [];
    };

    $scope.removeFenestration = function (index) {
      $scope.fenPanels[index].selected = null;
      $scope.fenPanels[index].fenGridOptions.data = [];
    };
  }
]);

cbecc.controller('ModalConstructionsLibraryCtrl', [
  '$scope', '$modalInstance', '$interval', 'uiGridConstants', 'params', function ($scope, $modalInstance, $interval, uiGridConstants, params) {
    $scope.data = params.data;
    $scope.title = params.title;
    $scope.layerData = [];
    $scope.selected = null;

    var textFilter = {condition: uiGridConstants.filter.CONTAINS};
    var numberFilter = [{
      condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
      placeholder: 'At least'
    }, {
      condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
      placeholder: 'No more than'
    }];

    $scope.constructionsGridOptions = {
      columnDefs: [{
        name: 'name',
        enableHiding: false,
        filter: angular.copy(textFilter),
        minWidth: 400
      }, {
        name: 'type',
        enableHiding: false,
        filter: angular.copy(textFilter)
      }, {
        name: 'framing_configuration',
        enableHiding: false,
        filter: angular.copy(textFilter),
        maxWidth: 218
      }, {
        name: 'framing_size',
        enableHiding: false,
        filter: angular.copy(textFilter),
        maxWidth: 159
      }, {
        name: 'cavity_insulation_r_value',
        enableHiding: false,
        filters: angular.copy(numberFilter)
      }, {
        name: 'continuous_insulation_r_value',
        enableHiding: false,
        filters: angular.copy(numberFilter)
      }, {
        name: 'continuous_insulation_material_name',
        enableHiding: false,
        filter: angular.copy(textFilter),
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
      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableSorting: false,
      enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER
    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]);

cbecc.controller('ModalFenestrationLibraryCtrl', [
  '$scope', '$modalInstance', '$interval', 'Fenestration', 'uiGridConstants', 'params', function ($scope, $modalInstance, $interval, Fenestration, uiGridConstants, params) {
    $scope.data = params.data;
    $scope.title = params.title;
    $scope.selected = null;

    var textFilter = {condition: uiGridConstants.filter.CONTAINS};
    var numberFilter = [{
      condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
      placeholder: 'At least'
    }, {
      condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
      placeholder: 'No more than'
    }];

    $scope.fenestrationGridOptions = {
      columnDefs: [{
        name: 'name',
        enableHiding: false,
        filter: angular.copy(textFilter),
        minWidth: 400
      }, {
        name: 'type',
        enableHiding: false,
        filter: angular.copy(textFilter)
      }, {
        name: 'certification_method',
        enableHiding: false,
        filter: angular.copy(textFilter),
        maxWidth: 218
      }, {
        name: 'u_factor',
        enableHiding: false,
        filters: angular.copy(numberFilter)
      }, {
        name: 'solar_heat_gain_coefficient',
        enableHiding: false,
        filters: angular.copy(numberFilter)
      }, {
        name: 'visible_transmittance',
        enableHiding: false,
        filters: angular.copy(numberFilter)
      }, {
        name: 'number_of_panes',
        enableHiding: false,
        filters: angular.copy(numberFilter)
      }, {
        name: 'frame_type',
        enableHiding: false,
        filter: angular.copy(textFilter),
        minWidth: 300
      }, {
        name: 'divider_type',
        enableHiding: false,
        filter: angular.copy(textFilter),
        minWidth: 300
      }, {
        name: 'tint',
        enableHiding: false,
        filter: angular.copy(textFilter)
      }, {
        name: 'gas_fill',
        enableHiding: false,
        filter: angular.copy(textFilter)
      }, {
        name: 'low_emissivity_coating',
        enableHiding: false,
        filter: angular.copy(textFilter)
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
          } else {
            // No rows selected
            $scope.selected = null;
          }
        });
        if (typeof(params.rowEntity) !== 'undefined' && params.rowEntity) {
          $interval(function () {
            $scope.gridApi.selection.selectRow(params.rowEntity);
          }, 0, 1);
        }
      }
    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]);

