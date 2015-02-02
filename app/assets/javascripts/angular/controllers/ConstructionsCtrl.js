cbecc.controller('ConstructionsCtrl', ['$scope', '$log', '$location', 'toaster', 'uiGridConstants', 'ConstructionDefaults', 'Shared', 'data', 'ConstructionLibrary', 'constData', 'doorData', 'fenData', 'defaults', 'spaces', function ($scope, $log, $location, toaster, uiGridConstants, ConstructionDefaults, Shared, data, ConstructionLibrary, constData, doorData, fenData, defaults, spaces) {
  // construction data
  $scope.constData = constData;
  $scope.doorData = doorData;
  $scope.fenData = fenData;
  $scope.spaces = spaces;
  $scope.spacesModified = false;

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

  // Load saved spaces
  _.each($scope.spaces, function (space, spaceIndex) {
    space.surfaces = [];
    _.each(['interior_walls', 'exterior_walls', 'underground_walls', 'interior_floors', 'exterior_floors', 'underground_floors', 'roofs'], function (surfaceType) {
      _.each(space[surfaceType], function (surface) {
        surface.subsurfaces = [];
        _.each(['doors', 'skylights', 'windows'], function (subsurfaceType) {
          _.each(surface[subsurfaceType], function (subsurface) {
            surface.subsurfaces.push(subsurface);
          });
          delete surface[subsurfaceType];
        });
        if (surfaceType == 'interior_floors') {
          surface.type = 'Floor';
          surface.boundary = 'Interior';
        } else if (surfaceType == 'exterior_floors') {
          surface.type = 'Floor';
          surface.boundary = 'Exterior';
        } else if (surfaceType == 'underground_floors') {
          surface.type = 'Floor';
          surface.boundary = 'Underground';
        } else if (surfaceType == 'interior_walls') {
          surface.type = 'Wall';
          surface.boundary = 'Interior';
        } else if (surfaceType == 'exterior_walls') {
          surface.type = 'Wall';
          surface.boundary = 'Exterior';
        } else if (surfaceType == 'underground_walls') {
          surface.type = 'Wall';
          surface.boundary = 'Underground';
        } else if (surfaceType == 'roofs') {
          surface.type = 'Roof';
          surface.boundary = null;
        }
        space.surfaces.push(surface);
      });
      delete space[surfaceType];
    });
  });

  _.each($scope.panels, function (panel) {
    panel.constructionGridOptions = {
      columnDefs: [{
        name: 'name',
        width: 400
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
      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableSorting: false
    };

    // retrieve selected and layers
    var sel = getSelected($scope.constData, $scope.defaults[panel.name]);
    if (sel) {
      panel.selected = sel;
      panel.constructionGridOptions.data = [sel];
      panel.gridOptions.data = sel.layers;
    }
  });


  $scope.doorPanels = [{
    title: 'Door Construction',
    name: 'door'
  }];

  _.each($scope.doorPanels, function (panel) {
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
    }
  });


  $scope.fenPanels = [{
    title: 'Window Construction',
    name: 'window'
  }, {
    title: 'Skylight Construction',
    name: 'skylight'
  }];

  _.each($scope.fenPanels, function (panel) {
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

  $scope.changeMatchingSurfaces = function (type, oldValue, newValue) {
    _.each($scope.spaces, function (space) {
      _.each(space.surfaces, function (surface) {
        if (type == surface.surface_type) {
          if (surface.construction_library_id == oldValue || surface.construction_library_id == null) {
            $scope.spacesModified = true;
            surface.construction_library_id = newValue;
          }
        }
      });
    });
  };

  $scope.changeMatchingSubsurfaces = function (type, oldValue, newValue) {
    _.each($scope.spaces, function (space) {
      _.each(space.surfaces, function (surface) {
        _.each(surface.subsurfaces, function (subsurface) {
          if (type == subsurface.type) {
            if (subsurface.construction_library_id == oldValue || subsurface.construction_library_id == null) {
              $scope.spacesModified = true;
              subsurface.construction_library_id = newValue;
            }
          }
        });
      });
    });
  };

  // Modals
  $scope.openConstructionLibraryModal = function (index, rowEntity) {
    var panel = $scope.panels[index];
    var oldValue = panel.selected ? panel.selected.id : null;
    ConstructionLibrary.openConstructionLibraryModal(panel.title, rowEntity).then(function (selectedConstruction) {
      if (selectedConstruction.id != oldValue) {
        Shared.setModified();

        panel.selected = selectedConstruction;
        panel.constructionGridOptions.data = [selectedConstruction];
        panel.gridOptions.data = selectedConstruction.layers;

        $scope.changeMatchingSurfaces(panel.title.substring(0, panel.title.length - 13), oldValue, selectedConstruction.id);
      }
    });
  };
  $scope.openDoorLibraryModal = function (index, rowEntity) {
    var panel = $scope.doorPanels[index];
    var oldValue = panel.selected ? panel.selected.id : null;
    ConstructionLibrary.openDoorLibraryModal(panel.title, rowEntity).then(function (selectedDoor) {
      if (selectedDoor.id != oldValue) {
        Shared.setModified();

        panel.selected = selectedDoor;
        panel.doorGridOptions.data = [selectedDoor];

        $scope.changeMatchingSubsurfaces(panel.title.substring(0, panel.title.length - 13), oldValue, selectedDoor.id);
      }
    });
  };
  $scope.openFenLibraryModal = function (index, rowEntity) {
    var panel = $scope.fenPanels[index];
    var oldValue = panel.selected ? panel.selected.id : null;
    ConstructionLibrary.openFenLibraryModal(panel.title, rowEntity).then(function (selectedFen) {
      if (selectedFen.id != oldValue) {
        Shared.setModified();

        panel.selected = selectedFen;
        panel.fenGridOptions.data = [selectedFen];

        $scope.changeMatchingSubsurfaces(panel.title.substring(0, panel.title.length - 13), oldValue, selectedFen.id);
      }
    });
  };

  // Remove Buttons
  $scope.removeConstruction = function (index) {
    var panel = $scope.panels[index];
    var oldValue = panel.selected.id;
    $scope.panels[index].selected = null;
    $scope.panels[index].gridOptions.data = [];
    $scope.changeMatchingSurfaces(panel.title.substring(0, panel.title.length - 13), oldValue, null);
  };

  $scope.removeDoor = function (index) {
    var panel = $scope.doorPanels[index];
    var oldValue = panel.selected.id;
    $scope.doorPanels[index].selected = null;
    $scope.doorPanels[index].doorGridOptions.data = [];
    $scope.changeMatchingSubsurfaces(panel.title.substring(0, panel.title.length - 13), oldValue, null);
  };

  $scope.removeFenestration = function (index) {
    var panel = $scope.fenPanels[index];
    var oldValue = panel.selected.id;
    $scope.fenPanels[index].selected = null;
    $scope.fenPanels[index].fenGridOptions.data = [];
    $scope.changeMatchingSubsurfaces(panel.title.substring(0, panel.title.length - 13), oldValue, null);
  };

  // save (constructions, doors, and fenestrations saved in same record)
  $scope.submit = function () {
    $log.debug('Submitting constructions');

    function success(response) {
      Shared.resetModified();
      toaster.pop('success', 'Construction defaults successfully saved');

      if ($scope.spacesModified) {
        $log.debug('Submitting spaces');

        var params = Shared.defaultParams();
        params.data = $scope.spaces;
        data.bulkSync('spaces', params).then(success).catch(failure);

        function success(response) {
          $scope.spacesModified = false;
          toaster.pop('success', 'Space construction defaults successfully updated');
        }

        function failure(response) {
          $log.error('Failure submitting spaces', response);
          toaster.pop('error', 'An error occurred while updating space construction defaults', response.statusText);
        }
      }
    }

    function failure(response) {
      $log.error('Failure submitting constructions', response);
      toaster.pop('error', 'An error occurred while saving', response.statusText);
    }

    var construction_defaults = {};
    _.each($scope.panels, function (panel) {
      construction_defaults[panel.name] = panel.selected ? panel.selected.id : null;
    });
    _.each($scope.doorPanels, function (panel) {
      construction_defaults[panel.name] = panel.selected ? panel.selected.id : null;
    });
    _.each($scope.fenPanels, function (panel) {
      construction_defaults[panel.name] = panel.selected ? panel.selected.id : null;
    });

    ConstructionDefaults.createUpdate({
      project_id: Shared.getProjectId()
    }, construction_defaults, success, failure);


  };
}]);
