cbecc.controller('ConstructionsCtrl', [
  '$scope', '$location', '$modal', 'uiGridConstants', 'toaster', 'ConstructionDefaults', 'Shared', 'constData', 'doorData', 'fenData', 'defaults', function ($scope, $location, $modal, uiGridConstants, toaster, ConstructionDefaults, Shared, constData, doorData, fenData, defaults) {
    Shared.stopSpinner();

    // construction data
    $scope.constData = constData;
    $scope.doorData = doorData;
    $scope.fenData = fenData;

    // retrieve saved defaults (if any)
    $scope.defaults = defaults[0] || {};

    // retrieve each saved default record from ids
    function getSelected(data, id) {
      return _.find(data, {
        id: id
      });
    }

    //collapsible panels
    $scope.panels = [{
      title: 'Exterior Wall Construction',
      name: 'exterior_wall'
    }, {
      title: 'Interior Wall Construction',
      name: 'interior_wall'
    }, {
      title: 'Underground Wall Construction',
      name: 'underground_wall'
    }, {
      title: 'Roof Construction',
      name: 'roof'
    }, {
      title: 'Interior Floor Construction',
      name: 'interior_floor'
    }, {
      title: 'Exterior Floor Construction',
      name: 'exterior_floor'
    }, {
      title: 'Underground Floor Construction',
      name: 'underground_floor'
    }];

    $scope.panels.forEach(function (panel) {
      panel.constructionGridOptions = {
        columnDefs: [{
          name: 'name',
          minWidth: 400
        }, {
          name: 'type'
        }, {
          name: 'framing_configuration',
          maxWidth: 218,
          visible: panel.name != 'underground_floor'
        }, {
          name: 'framing_size',
          maxWidth: 159,
          visible: panel.name != 'underground_floor'
        }, {
          name: 'cavity_insulation_r_value',
          visible: panel.name != 'underground_floor'
        }, {
          name: 'continuous_insulation_r_value',
          visible: panel.name != 'underground_floor'
        }, {
          name: 'continuous_insulation_material_name',
          minWidth: 300,
          visible: panel.name != 'underground_floor'
        }, {
          name: 'slab_type',
          visible: panel.name == 'underground_floor'
        }, {
          name: 'slab_insulation_orientation',
          visible: panel.name == 'underground_floor'
        }, {
          name: 'slab_insulation_thermal_resistance',
          visible: panel.name == 'underground_floor'
        }],
        enableColumnMenus: false,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
        enableSorting: false,
        enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER
      };

      panel.gridOptions = {
        columnDefs: [{
          name: 'name',
          displayName: 'Layer'
        }, {
          name: 'code_category'
        }],
        enableColumnMenus: false,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
        enableSorting: false,
        enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER
      };

      // retrieve selected and layers
      var sel = getSelected($scope.constData, $scope.defaults[panel.name]);
      if (sel) {
        panel.selected = sel;
        panel.constructionGridOptions.data = [sel];
        panel.gridOptions.data = sel.layers;
        panel.open = true;
      } else {
        panel.open = false;
      }
    });


    $scope.doorPanels = [{
      title: 'Door Construction',
      name: 'door'
    }];

    $scope.doorPanels.forEach(function (panel) {
      panel.doorGridOptions = {
        columnDefs: [{
          name: 'name'
        }, {
          name: 'type'
        }, {
          name: 'certification_method'
        }, {
          name: 'u_factor'
        }, {
          name: 'open'
        }],
        enableColumnMenus: false,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
        enableSorting: false,
        enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER
      };

      // retrieve selected
      var sel = getSelected($scope.doorData, $scope.defaults[panel.name]);
      if (sel) {
        panel.selected = sel;
        panel.doorGridOptions.data = [sel];
        panel.open = true;
      } else {
        panel.open = false;
      }
    });


    $scope.fenPanels = [{
      title: 'Window Construction',
      name: 'window'
    }, {
      title: 'Skylight Construction',
      name: 'skylight'
    }];

    $scope.fenPanels.forEach(function (panel) {
      panel.fenGridOptions = {
        columnDefs: [{
          name: 'name'
        }, {
          name: 'fenestration_framing',
          displayName: 'Frame Type'
        }, {
          name: 'fenestration_panes',
          displayName: 'Panes'
        }, {
          name: 'fenestration_product_type',
          displayName: 'Product Type',
          visible: panel.name == 'window'
        }, {
          name: 'glazing_tint',
          visible: panel.name == 'window'
        }, {
          name: 'u_factor'
        }, {
          name: 'shgc',
          displayName: 'Solar Heat Gain Coefficient',
          visible: panel.name == 'window'
        }, {
          name: 'skylight_curb',
          visible: panel.name == 'skylight'
        }],
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


    // Buttons
    $scope.expandAll = function () {
      _.each(['panels', 'doorPanels', 'fenPanels'], function (panelType) {
        _.each($scope[panelType], function (panel) {
          panel.open = true;
        });
      });
    };
    $scope.collapseAll = function () {
      _.each(['panels', 'doorPanels', 'fenPanels'], function (panelType) {
        _.each($scope[panelType], function (panel) {
          panel.open = false;
        });
      });
    };


    // Modal Settings
    $scope.openLibraryModal = function (index, rowEntity) {
      var modalInstance = $modal.open({
        backdrop: 'static',
        controller: 'ModalConstructionLibraryCtrl',
        templateUrl: 'constructions/library.html',
        windowClass: 'wide-modal',
        resolve: {
          params: function () {
            return {
              data: $scope.constData,
              rowEntity: rowEntity,
              panel: $scope.panels[index]
            };
          }
        }
      });

      modalInstance.result.then(function (selectedConstruction) {
        $scope.panels[index].selected = selectedConstruction;
        $scope.panels[index].constructionGridOptions.data = [selectedConstruction];
        $scope.panels[index].gridOptions.data = selectedConstruction.layers;
      }, function () {
        // Modal canceled
      });
    };

    // Modal Settings
    $scope.openDoorLibraryModal = function (index, rowEntity) {
      var modalInstance = $modal.open({
        backdrop: 'static',
        controller: 'ModalDoorLibraryCtrl',
        templateUrl: 'constructions/door_library.html',
        windowClass: 'wide-modal',
        resolve: {
          params: function () {
            return {
              data: $scope.doorData,
              rowEntity: rowEntity,
              panel: $scope.doorPanels[index]
            };
          }
        }
      });

      modalInstance.result.then(function (selectedDoor) {
        $scope.doorPanels[index].selected = selectedDoor;
        $scope.doorPanels[index].doorGridOptions.data = [selectedDoor];
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
              panel: $scope.fenPanels[index]
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


    // save (constructions, doors, and fenestrations saved in same record
    $scope.submit = function () {
      console.log("submit");

      function success(response) {
        toaster.pop('success', 'Construction defaults successfully saved');
      }

      function failure(response) {
        console.log("failure", response);
        toaster.pop('error', 'An error occurred while saving', response.statusText);
      }

      var construction_defaults = {};
      $scope.panels.forEach(function (panel) {
        construction_defaults[panel.name] = panel.selected ? panel.selected.id : null;
      });
      $scope.doorPanels.forEach(function (panel) {
        construction_defaults[panel.name] = panel.selected ? panel.selected.id : null;
      });
      $scope.fenPanels.forEach(function (panel) {
        construction_defaults[panel.name] = panel.selected ? panel.selected.id : null;
      });

      ConstructionDefaults.createUpdate({
        project_id: Shared.getProjectId()
      }, construction_defaults, success, failure);


    };

    // Remove Buttons
    $scope.removeConstruction = function (index) {
      $scope.panels[index].selected = null;
      $scope.panels[index].gridOptions.data = [];
    };

    $scope.removeDoor = function (index) {
      $scope.doorPanels[index].selected = null;
      $scope.doorPanels[index].doorGridOptions.data = [];
    };

    $scope.removeFenestration = function (index) {
      $scope.fenPanels[index].selected = null;
      $scope.fenPanels[index].fenGridOptions.data = [];
    };
  }]);

cbecc.controller('ModalConstructionLibraryCtrl', [
  '$scope', '$modalInstance', '$interval', 'uiGridConstants', 'Shared', 'params', function ($scope, $modalInstance, $interval, uiGridConstants, Shared, params) {
    $scope.data = params.data;
    $scope.title = params.panel.title;
    $scope.layerData = [];
    $scope.selected = null;

    if (params.panel.name == 'exterior_wall') {
      $scope.type = 'ExteriorWall';
    } else if (params.panel.name == 'interior_wall') {
      $scope.type = 'InteriorWall';
    } else if (params.panel.name == 'underground_wall') {
      $scope.type = 'UndergroundWall';
    } else if (params.panel.name == 'roof') {
      $scope.type = 'ExteriorRoof';
    } else if (params.panel.name == 'interior_floor') {
      $scope.type = 'InteriorFloor';
    } else if (params.panel.name == 'exterior_floor') {
      $scope.type = 'ExteriorFloor';
    } else if (params.panel.name == 'underground_floor') {
      $scope.type = 'UndergroundFloor';
    }

    $scope.constructionsGridOptions = {
      columnDefs: [{
        name: 'name',
        enableHiding: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
        minWidth: 400
      }, {
        name: 'compatible_surface_type',
        enableFiltering: false,
        filter: {
          condition: uiGridConstants.filter.EXACT,
          noTerm: true,
          term: $scope.type
        },
        visible: false
      }, {
        name: 'type',
        enableHiding: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
      }, {
        name: 'framing_configuration',
        enableHiding: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
        maxWidth: 218,
        visible: $scope.type != 'UndergroundFloor'
      }, {
        name: 'framing_size',
        enableHiding: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
        maxWidth: 159,
        visible: $scope.type != 'UndergroundFloor'
      }, {
        name: 'cavity_insulation_r_value',
        secondLine: Shared.html('ft<sup>2</sup> &deg;F hr / Btu'),
        enableHiding: false,
        filters: Shared.numberFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
        visible: $scope.type != 'UndergroundFloor'
      }, {
        name: 'continuous_insulation_r_value',
        secondLine: Shared.html('ft<sup>2</sup> &deg;F hr / Btu'),
        enableHiding: false,
        filters: Shared.numberFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
        visible: $scope.type != 'UndergroundFloor'
      }, {
        name: 'continuous_insulation_material_name',
        enableHiding: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
        minWidth: 300,
        visible: $scope.type != 'UndergroundFloor'
      }, {
        name: 'slab_type',
        enableHiding: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
        visible: $scope.type == 'UndergroundFloor'
      }, {
        name: 'slab_insulation_orientation',
        enableHiding: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
        visible: $scope.type == 'UndergroundFloor'
      }, {
        name: 'slab_insulation_thermal_resistance',
        secondLine: Shared.html('ft<sup>2</sup> &deg;F hr / Btu'),
        cellFilter: 'parseRValue',
        enableHiding: false,
        filters: [{
          condition: function (searchTerm, cellValue) {
            var term = searchTerm.replace(/[^\d.-]/g, '');
            if (term.length) {
              term = Number(term);
              if (isNaN(term)) term = 0;
              if (cellValue === null) return false;
              var rValue = Number(cellValue.replace('_', '.').replace(/[^\d.]/g, ''));
              return rValue >= term;
            }
            return true;
          },
          placeholder: 'At least'
        }, {
          condition: function (searchTerm, cellValue) {
            var term = searchTerm.replace(/[^\d.-]/g, '');
            if (term.length) {
              term = Number(term);
              if (isNaN(term)) term = 0;
              if (cellValue === null) return false;
              var rValue = Number(cellValue.replace('_', '.').replace(/[^\d.]/g, ''));
              return rValue <= term;
            }
            return true;
          },
          placeholder: 'No more than'
        }],
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
        visible: $scope.type == 'UndergroundFloor'
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
        if (typeof (params.rowEntity) !== 'undefined' && params.rowEntity) {
          $interval(function () {
            $scope.gridApi.selection.selectRow(params.rowEntity);
          }, 0, 1);
        }
      }
    };

    $scope.layersGridOptions = {
      columnDefs: [{
        name: 'name',
        displayName: 'Layer'
      }, {
        name: 'code_category'
      }],
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
  }]);

cbecc.controller('ModalDoorLibraryCtrl', [
  '$scope', '$modalInstance', '$interval', 'uiGridConstants', 'Shared', 'params', function ($scope, $modalInstance, $interval, uiGridConstants, Shared, params) {
    $scope.data = params.data;
    $scope.title = params.panel.title;
    $scope.selected = null;

    $scope.doorGridOptions = {
      columnDefs: [{
        name: 'name',
        enableHiding: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
        minWidth: 400
      }, {
        name: 'type',
        enableHiding: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
      }, {
        name: 'certification_method',
        enableHiding: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
      }, {
        name: 'u_factor',
        secondLine: Shared.html('Btu / (ft<sup>2</sup> &deg;F hr)'),
        enableHiding: false,
        filters: Shared.numberFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
      }, {
        name: 'open',
        enableHiding: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
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
        if (typeof (params.rowEntity) !== 'undefined' && params.rowEntity) {
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
  }]);

cbecc.controller('ModalFenestrationLibraryCtrl', [
  '$scope', '$modalInstance', '$interval', 'uiGridConstants', 'Shared', 'params', function ($scope, $modalInstance, $interval, uiGridConstants, Shared, params) {
    $scope.data = params.data;
    $scope.title = params.panel.title;
    $scope.selected = null;

    if (params.panel.name == 'window') {
      $scope.type = 'VerticalFenestration';
    } else if (params.panel.name == 'skylight') {
      $scope.type = 'Skylight';
    }

    $scope.fenestrationGridOptions = {
      columnDefs: [{
        name: 'name',
        enableHiding: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
        minWidth: 400
      }, {
        name: 'fenestration_type',
        enableFiltering: false,
        filter: {
          condition: uiGridConstants.filter.EXACT,
          noTerm: true,
          term: $scope.type
        },
        visible: false
      }, {
        name: 'fenestration_framing',
        displayName: 'Frame Type',
        enableHiding: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
      }, {
        name: 'fenestration_panes',
        displayName: 'Panes',
        enableHiding: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
      }, {
        name: 'fenestration_product_type',
        displayName: 'Product Type',
        enableHiding: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
        visible: $scope.type == 'VerticalFenestration'
      }, {
        name: 'glazing_tint',
        enableHiding: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
        visible: $scope.type == 'VerticalFenestration'
      }, {
        name: 'u_factor',
        secondLine: Shared.html('Btu / (ft<sup>2</sup> &deg;F hr)'),
        enableHiding: false,
        filters: Shared.numberFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
      }, {
        name: 'shgc',
        displayName: 'Solar Heat Gain Coefficient',
        secondLine: Shared.html('frac.'),
        enableHiding: false,
        filters: Shared.numberFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
        visible: $scope.type == 'VerticalFenestration'
      }, {
        name: 'skylight_curb',
        enableHiding: false,
        filter: Shared.textFilter(),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
        visible: $scope.type == 'Skylight'
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
        if (typeof (params.rowEntity) !== 'undefined' && params.rowEntity) {
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
  }]);
