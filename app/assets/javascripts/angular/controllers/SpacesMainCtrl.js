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
        _.each($scope.data.storiesArr, function (story, index) {
          if (story.id == row.entity.building_story_id) {
            storyIndex = index;
            return false;
          }
        });
        if (row.entity.floor_to_ceiling_height != $scope.data.stories[storyIndex].floor_to_ceiling_height) {
          return 'modified-cell';
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
            $scope.data.updateTotalExhaust(rowEntity);
            // Update default lighting system mounting height
            _.each($scope.data.lightingSystems, function (lightingSystem) {
              if (lightingSystem.space == spaceIndex && lightingSystem.luminaire_mounting_height == oldValue) {
                lightingSystem.luminaire_mounting_height = newValue;
              }
            });
          } else if (colDef.name == 'area') {
            $scope.data.updateTotalExhaust(rowEntity);
            $scope.data.calculateLPD($scope.data.spaces.indexOf(rowEntity));
          } else if (colDef.name == 'building_story_id') {
            // Update floor_to_ceiling_height if it is unchanged
            var oldStoryIndex = null;
            var newStoryIndex = null;
            _.each($scope.data.storiesArr, function (story, index) {
              if (story.id == oldValue) oldStoryIndex = index;
              if (story.id == newValue) newStoryIndex = index;
            });
            if (rowEntity.floor_to_ceiling_height == $scope.data.stories[oldStoryIndex].floor_to_ceiling_height) {
              rowEntity.floor_to_ceiling_height = $scope.data.stories[newStoryIndex].floor_to_ceiling_height;
              // Update default lighting system mounting height
              _.each($scope.data.lightingSystems, function (lightingSystem) {
                if (lightingSystem.space == spaceIndex && lightingSystem.luminaire_mounting_height == $scope.data.stories[oldStoryIndex].floor_to_ceiling_height) {
                  lightingSystem.luminaire_mounting_height = $scope.data.stories[newStoryIndex].floor_to_ceiling_height;
                }
              });
            }
            gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);

            // Remove adjacent spaces
            _.each($scope.data.surfaces, function (surface) {
              if (surface.boundary == 'Interior' && surface.space == spaceIndex) {
                surface.adjacent_space_reference = null;
              }
            });
          }
        }
      });
    }
  };

  // Buttons
  $scope.applySettings = function () {
    $scope.applySettingsActive = true;
    $scope.data.clearAll($scope.gridApi);
    $scope.spacesGridOptions.multiSelect = true;
  };

  $scope.confirmApplySettings = function () {
    Shared.setModified();

    var replacement = {
      floor_to_ceiling_height: $scope.selected.space.floor_to_ceiling_height,
      building_story_id: $scope.selected.space.building_story_id,
      area: $scope.selected.space.area,
      conditioning_type: $scope.selected.space.conditioning_type,
      envelope_status: $scope.selected.space.envelope_status,
      lighting_status: $scope.selected.space.lighting_status
    };
    var rows = $scope.gridApi.selection.getSelectedRows();
    _.each(rows, function (row) {
      _.merge(row, replacement);
      $scope.data.updateTotalExhaust(row);
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
            name: config.name + ' ' + (i + 1),
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
