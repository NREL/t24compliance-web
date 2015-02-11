cbecc.controller('SpacesMainCtrl', ['$scope', '$modal', 'uiGridConstants', 'Shared', 'Enums', function ($scope, $modal, uiGridConstants, Shared, Enums) {
  $scope.selected = {
    space: null
  };

  $scope.applySettingsActive = false;

  // Spaces UI Grid
  $scope.spacesGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'floor_to_ceiling_height',
      secondLine: Shared.html('ft'),
      enableHiding: false,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        var storyIndex = null;
        var story = _.find($scope.data.stories, {id: row.entity.building_story_id});
        if (row.entity.conditioning_type == 'Plenum') {
          if (row.entity.floor_to_ceiling_height != (story.floor_to_floor_height - story.floor_to_ceiling_height)) {
            return 'modified-cell';
          }
        } else {
          if (row.entity.floor_to_ceiling_height != story.floor_to_ceiling_height) {
            return 'modified-cell';
          }
        }
      },
      cellEditableCondition: $scope.data.applySettingsCondition,
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'building_story_id',
      displayName: 'Story',
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapHash:grid.appScope.data.storiesHash',
      editDropdownOptionsArray: $scope.data.storiesArr,
      filters: Shared.enumFilter($scope.data.storiesHash),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      sortingAlgorithm: Shared.sort($scope.data.storiesHash)
    }, {
      name: 'area',
      secondLine: Shared.html('ft<sup>2</sup>'),
      type: 'number',
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'conditioning_type',
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.spaces_conditioning_type_enums,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'envelope_status',
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.spaces_envelope_status_enums,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'lighting_status',
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.spaces_lighting_status_enums,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'

    }],
    data: $scope.data.spaces,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (!$scope.applySettingsActive) {
          if (row.isSelected) {
            $scope.selected.space = row.entity;
          } else {
            // No rows selected
            $scope.selected.space = null;
          }
        }
      });
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        if (newValue != oldValue) {
          Shared.setModified();

          var spaceIndex = $scope.data.spaces.indexOf(rowEntity);
          if (colDef.name == 'name') {
            var unique = Shared.checkUnique($scope.data.spaces, newValue, spaceIndex);
            if (!unique) rowEntity.name = oldValue;
          } else if (colDef.name == 'floor_to_ceiling_height') {
            $scope.updateFloorToCeilingHeight(rowEntity, spaceIndex, newValue, oldValue);
          } else if (colDef.name == 'building_story_id') {
            $scope.updateBuildingStoryId(rowEntity, spaceIndex, newValue, oldValue);
          } else if (colDef.name == 'area') {
            $scope.updateArea(rowEntity, spaceIndex, newValue, oldValue);
          } else if (colDef.name == 'conditioning_type') {
            $scope.updateConditioningType(rowEntity, spaceIndex, newValue, oldValue);
          }
        }
      });
    }
  };

  $scope.updateFloorToCeilingHeight = function (rowEntity, spaceIndex, newValue, oldValue) {
    $scope.data.updateTotalExhaust(rowEntity);
    // Update default lighting system mounting height
    _.each($scope.data.lightingSystems, function (lightingSystem) {
      if (lightingSystem.space == spaceIndex && lightingSystem.luminaire_mounting_height == oldValue) {
        lightingSystem.luminaire_mounting_height = newValue;
      }
    });
  };
  $scope.updateBuildingStoryId = function (rowEntity, spaceIndex, newValue, oldValue) {
    // Update floor_to_ceiling_height if it is unchanged
    var oldStory = _.find($scope.data.stories, {id: oldValue});
    var newStory = _.find($scope.data.stories, {id: newValue});
    if (rowEntity.conditioning_type == 'Plenum') {
      if (rowEntity.floor_to_ceiling_height == (oldStory.floor_to_floor_height - oldStory.floor_to_ceiling_height)) {
        rowEntity.floor_to_ceiling_height = newStory.floor_to_floor_height - newStory.floor_to_ceiling_height;
      }
    } else {
      if (rowEntity.floor_to_ceiling_height == oldStory.floor_to_ceiling_height) {
        rowEntity.floor_to_ceiling_height = newStory.floor_to_ceiling_height;
        // Update default lighting system mounting height
        _.each($scope.data.lightingSystems, function (lightingSystem) {
          if (lightingSystem.space == spaceIndex && lightingSystem.luminaire_mounting_height == oldStory.floor_to_ceiling_height) {
            lightingSystem.luminaire_mounting_height = newStory.floor_to_ceiling_height;
          }
        });
      }
    }
    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);

    // Remove adjacent spaces
    _.each($scope.data.surfaces, function (surface) {
      if (surface.boundary == 'Interior' && surface.space == spaceIndex) {
        surface.adjacent_space_reference = null;
      }
    });
  };
  $scope.updateArea = function (rowEntity, spaceIndex, newValue, oldValue) {
    $scope.data.updateTotalExhaust(rowEntity);
    $scope.data.calculateLPD($scope.data.spaces.indexOf(rowEntity));
  };
  $scope.updateConditioningType = function (rowEntity, spaceIndex, newValue, oldValue) {
    var story = _.find($scope.data.stories, {id: rowEntity.building_story_id});
    if (newValue == 'Plenum') {
      if (rowEntity.floor_to_ceiling_height == story.floor_to_ceiling_height) {
        rowEntity.floor_to_ceiling_height = Math.max(story.floor_to_floor_height - story.floor_to_ceiling_height, 0);
      }

      rowEntity.space_function = 'Unoccupied-Exclude from Gross Floor Area';

      // Reset defaults
      var defaults = _.find($scope.data.spaceFunctionDefaults, {
        name: rowEntity.space_function
      });
      rowEntity.occupant_density = defaults.occupant_density;
      rowEntity.occupant_density_default = defaults.occupant_density;
      rowEntity.hot_water_heating_rate = defaults.hot_water_heating_rate;
      rowEntity.hot_water_heating_rate_default = defaults.hot_water_heating_rate;
      rowEntity.receptacle_power_density = defaults.receptacle_power_density;
      rowEntity.receptacle_power_density_default = defaults.receptacle_power_density;
      rowEntity.exhaust_per_area = defaults.exhaust_per_area;
      rowEntity.exhaust_per_area_default = defaults.exhaust_per_area;
      rowEntity.exhaust_air_changes_per_hour = defaults.exhaust_air_changes_per_hour;
      rowEntity.exhaust_air_changes_per_hour_default = defaults.exhaust_air_changes_per_hour;

      rowEntity.function_schedule_group = defaults.function_schedule_group == '- specify -' ? null : defaults.function_schedule_group;
      rowEntity.ventilation_per_person = defaults.ventilation_per_person;
      rowEntity.ventilation_per_area = defaults.ventilation_per_area;
      rowEntity.ventilation_air_changes_per_hour = defaults.ventilation_air_changes_per_hour;

      rowEntity.commercial_refrigeration_epd = defaults.commercial_refrigeration_epd;
      rowEntity.commercial_refrigeration_epd_default = defaults.commercial_refrigeration_epd;

      rowEntity.gas_equipment_power_density = defaults.gas_equipment_power_density;
      rowEntity.gas_equipment_power_density_default = defaults.gas_equipment_power_density;

      rowEntity.lighting_input_method = 'LPD';
      rowEntity.interior_lighting_power_density_regulated = defaults.interior_lighting_power_density_regulated;
      rowEntity.interior_lighting_power_density_regulated_default = defaults.interior_lighting_power_density_regulated;
      rowEntity.interior_lighting_power_density_non_regulated = defaults.interior_lighting_power_density_non_regulated;
      rowEntity.interior_lighting_power_density_non_regulated_default = defaults.interior_lighting_power_density_non_regulated;

      // Reset values
      rowEntity.exhaust_per_space = null;
      rowEntity.total_exhaust = Shared.calculateTotalExhaust(rowEntity);

      rowEntity.process_electrical_power_density = null;
      rowEntity.elevator_count = null;
      rowEntity.escalator_count = null;
      rowEntity.process_electrical_radiation_fraction = null;
      rowEntity.process_electrical_latent_fraction = null;
      rowEntity.process_electrical_lost_fraction = null;
      rowEntity.elevator_lost_fraction = null;
      rowEntity.escalator_lost_fraction = null;

      rowEntity.process_gas_power_density = null;
      rowEntity.process_gas_radiation_fraction = null;
      rowEntity.process_gas_latent_fraction = null;
      rowEntity.process_gas_lost_fraction = null;

      _.remove($scope.data.lightingSystems, {space: $scope.data.spaces.indexOf(rowEntity)});

      $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    } else if (oldValue == 'Plenum') {
      if (rowEntity.floor_to_ceiling_height == story.floor_to_floor_height - story.floor_to_ceiling_height) {
        rowEntity.floor_to_ceiling_height = story.floor_to_ceiling_height;
      }
      $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    }
  };

  // Buttons
  $scope.applySettings = function () {
    $scope.applySettingsActive = true;
    $scope.data.clearAll($scope.gridApi);
    $scope.spacesGridOptions.multiSelect = true;
  };

  $scope.confirmApplySettings = function () {
    var selectedRowEntity = angular.copy($scope.selected.space);
    var selectedSpaceIndex = $scope.data.spaces.indexOf($scope.selected.space);

    _.each($scope.gridApi.selection.getSelectedRows(), function (rowEntity) {
      var spaceIndex = $scope.data.spaces.indexOf(rowEntity);

      if (spaceIndex != selectedSpaceIndex) {
        Shared.setModified();

        rowEntity.floor_to_ceiling_height = $scope.selected.space.floor_to_ceiling_height;
        $scope.updateFloorToCeilingHeight(rowEntity, spaceIndex, $scope.selected.space.floor_to_ceiling_height, selectedRowEntity.floor_to_ceiling_height);

        rowEntity.building_story_id = $scope.selected.space.building_story_id;
        $scope.updateBuildingStoryId(rowEntity, spaceIndex, $scope.selected.space.building_story_id, selectedRowEntity.building_story_id);

        rowEntity.area = $scope.selected.space.area;
        $scope.updateArea(rowEntity, spaceIndex, $scope.selected.space.area, selectedRowEntity.area);

        rowEntity.conditioning_type = $scope.selected.space.conditioning_type;
        $scope.updateConditioningType(rowEntity, spaceIndex, $scope.selected.space.conditioning_type, selectedRowEntity.conditioning_type);

        rowEntity.envelope_status = $scope.selected.space.envelope_status;

        rowEntity.lighting_status = $scope.selected.space.lighting_status;

        $scope.data.updateTotalExhaust(rowEntity);
      }
    });
    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    $scope.resetApplySettings();
  };

  $scope.resetApplySettings = function () {
    $scope.selected.space = null;
    $scope.applySettingsActive = false;
    $scope.data.clearAll($scope.gridApi);
    $scope.spacesGridOptions.multiSelect = false;
  };

  // Modal Settings
  $scope.openSpaceCreatorModal = function () {
    var modalInstance = $modal.open({
      backdrop: 'static',
      controller: 'ModalSpaceCreatorCtrl',
      templateUrl: 'spaces/spaceCreator.html',
      windowClass: 'wide-modal',
      resolve: {
        params: function () {
          return {
            data: $scope.data
          };
        }
      }
    });

    modalInstance.result.then(function (spaceGroups) {
      Shared.setModified();

      _.each(spaceGroups, function (spaceGroup) {
        var config = spaceGroup.config;
        var walls = spaceGroup.walls;
        for (var i = 0; i < config.quantity; ++i) {
          $scope.data.addSpace({
            name: Shared.uniqueName($scope.data.spaces, _.template(config.name + ' <%= num %>'), i + 1),
            space_function: config.space_function,
            floor_to_ceiling_height: config.floor_to_ceiling_height,
            building_story_id: config.building_story_id,
            area: config.area,
            conditioning_type: config.conditioning_type,
            envelope_status: config.envelope_status,
            lighting_status: config.lighting_status
          });

          var spaceIndex = $scope.data.spaces.length - 1;
          for (var j = 0; j < walls.interior_walls; ++j) {
            $scope.data.addSurface('Wall', 'Interior', spaceIndex);
          }
          for (j = 0; j < walls.exterior_walls; ++j) {
            $scope.data.addSurface('Wall', 'Exterior', spaceIndex);
            for (var k = 0; k < walls.windows; ++k) {
              $scope.data.addSubsurface('Window', $scope.data.surfaces.length - 1);
            }
          }
        }
      });
    }, function () {
      // Modal canceled
    });
  };
}]);
