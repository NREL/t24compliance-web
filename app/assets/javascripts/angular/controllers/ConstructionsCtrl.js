cbecc.controller('ConstructionsCtrl', [
  '$scope', '$location', 'toaster', 'ConstructionDefaults', 'Shared', 'ConstructionLibrary', 'constData', 'doorData', 'fenData', 'defaults', function ($scope, $location, toaster, ConstructionDefaults, Shared, ConstructionLibrary, constData, doorData, fenData, defaults) {
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
        enableSorting: false
      };

      panel.gridOptions = {
        columnDefs: [{
          name: 'name',
          displayName: 'Layer'
        }, {
          name: 'code_category'
        }],
        enableColumnMenus: false,
        enableSorting: false
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
        enableSorting: false
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
        enableSorting: false
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


    // Modals
    $scope.openConstructionLibraryModal = function (index, rowEntity) {
      ConstructionLibrary.openConstructionLibraryModal($scope.panels[index].title, rowEntity).then(function (selectedConstruction) {
        $scope.panels[index].selected = selectedConstruction;
        $scope.panels[index].constructionGridOptions.data = [selectedConstruction];
        $scope.panels[index].gridOptions.data = selectedConstruction.layers;
      });
    };
    $scope.openDoorLibraryModal = function (index, rowEntity) {
      ConstructionLibrary.openDoorLibraryModal($scope.doorPanels[index].title, rowEntity).then(function (selectedDoor) {
        $scope.doorPanels[index].selected = selectedDoor;
        $scope.doorPanels[index].doorGridOptions.data = [selectedDoor];
      });
    };
    $scope.openFenLibraryModal = function (index, rowEntity) {
      ConstructionLibrary.openFenLibraryModal($scope.fenPanels[index].title, rowEntity).then(function (selectedFen) {
        $scope.fenPanels[index].selected = selectedFen;
        $scope.fenPanels[index].fenGridOptions.data = [selectedFen];
      });
    };


    // save (constructions, doors, and fenestrations saved in same record)
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
