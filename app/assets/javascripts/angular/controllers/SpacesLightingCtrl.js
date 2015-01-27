cbecc.controller('SpacesLightingCtrl', ['$scope', '$q', '$modal', 'uiGridConstants', 'Shared', 'Enums', function ($scope, $q, $modal, uiGridConstants, Shared, Enums) {
  $scope.selected = {
    space: null,
    lightingSystem: null
  };

  $scope.applySettingsActive = false;

  $scope.showLightingSystems = !_.isEmpty(_.find($scope.data.spaces, function (space) {
    return space.lighting_input_method == 'Luminaires';
  }));

  $scope.spacesArr = [];
  $scope.spacesHash = {};
  _.each($scope.data.spaces, function (space, index) {
    $scope.spacesArr.push({
      id: index,
      value: space.name,
      surfaces: []
    });
    $scope.spacesHash[index] = space.name;
  });

  // LPD UI Grid
  $scope.lpdGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableCellEdit: false,
      enableHiding: false,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      filter: Shared.textFilter()
    }, {
      name: 'lighting_input_method',
      enableHiding: false,
      cellEditableCondition: function ($scope) {
        if ($scope.grid.appScope.applySettingsActive) return false;
        return !_.contains(['High-Rise Residential Living Spaces', 'Hotel/Motel Guest Room'], $scope.row.entity.space_function);
      },
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: $scope.data.lightingInputMethodsArr,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      filter: Shared.textFilter()
    }, {
      name: 'interior_lighting_power_density_regulated',
      displayName: 'Regulated LPD',
      secondLine: Shared.html('W / ft<sup>2</sup>'),
      enableHiding: false,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.lighting_input_method == 'Luminaires' || _.contains(['High-Rise Residential Living Spaces', 'Hotel/Motel Guest Room'], row.entity.space_function)) {
          return 'disabled-cell';
        } else if (row.entity.interior_lighting_power_density_regulated != row.entity.interior_lighting_power_density_regulated_default) {
          return 'modified-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        if ($scope.grid.appScope.applySettingsActive) return false;
        return !($scope.row.entity.lighting_input_method == 'Luminaires' || _.contains(['High-Rise Residential Living Spaces', 'Hotel/Motel Guest Room'], $scope.row.entity.space_function));
      },
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'interior_lighting_power_density_non_regulated',
      displayName: 'Unregulated LPD',
      secondLine: Shared.html('W / ft<sup>2</sup>'),
      enableHiding: false,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.lighting_input_method == 'Luminaires' || _.contains(['High-Rise Residential Living Spaces', 'Hotel/Motel Guest Room'], row.entity.space_function)) {
          return 'disabled-cell';
        } else if (row.entity.interior_lighting_power_density_non_regulated != row.entity.interior_lighting_power_density_non_regulated_default) {
          return 'modified-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        if ($scope.grid.appScope.applySettingsActive) return false;
        return !($scope.row.entity.lighting_input_method == 'Luminaires' || _.contains(['High-Rise Residential Living Spaces', 'Hotel/Motel Guest Room'], $scope.row.entity.space_function));
      },
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      type: 'number',
      filters: Shared.numberFilter()
    }],
    data: $scope.data.spaces,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.lpdGridApi = gridApi;
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

          if (colDef.name == 'lighting_input_method') {
            if (newValue == 'Luminaires') {
              rowEntity.interior_lighting_power_density_regulated = 0;
              rowEntity.interior_lighting_power_density_non_regulated = 0;
              $scope.showLightingSystems = true;
            } else if (newValue == 'LPD') {
              rowEntity.interior_lighting_power_density_regulated = rowEntity.interior_lighting_power_density_regulated_default;
              rowEntity.interior_lighting_power_density_non_regulated = rowEntity.interior_lighting_power_density_non_regulated_default;
              _.remove($scope.data.lightingSystems, {space: $scope.data.spaces.indexOf(rowEntity)});
              $scope.lpdGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);

              $scope.showLightingSystems = !_.isEmpty(_.find($scope.data.spaces, function (space) {
                return space.lighting_input_method == 'Luminaires';
              }));
            }

            var spaceOptions = $scope.data.spacesWithLuminaires();
            _.each($scope.data.lightingSystems, function (lightingSystem) {
              lightingSystem.spaceOptions = spaceOptions;
            });
          }
        }
      });
    }
  };

  // Luminaire UI Grid
  $scope.luminaireGridOptions = {
    columnDefs: [{
      name: 'space',
      displayName: 'Space Name',
      enableHiding: false,
      cellFilter: 'mapHash:grid.appScope.spacesHash',
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownRowEntityOptionsArrayPath: 'spaceOptions',
      filter: Shared.enumFilter($scope.spacesHash),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      sortingAlgorithm: Shared.sort($scope.spacesArr)
    }, {
      field: 'luminaire_reference[0]',
      displayName: 'Luminaire',
      allowLuminaireEdit: true,
      cellFilter: 'mapHash:grid.appScope.data.lumHash',
      cellTemplate: 'ui-grid/cbeccLuminaireCell',
      enableCellEdit: false,
      enableHiding: false,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.luminaire_reference[0] == null) {
          return 'required-cell msg-select-a-luminaire';
        }
      },
      filter: Shared.enumFilter($scope.data.lumHash),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      sortingAlgorithm: Shared.sort($scope.data.lumHash)
    }, {
      field: 'luminaire_count[0]',
      displayName: 'Quantity',
      enableHiding: false,
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      type: 'number'
    }, {
      name: 'status',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.interior_lighting_systems_status_enums,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'power_regulated',
      displayName: 'Regulated',
      enableHiding: false,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      type: 'boolean'
    }, {
      name: 'non_regulated_exclusion',
      displayName: 'Exclusion Type',
      enableHiding: false,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.power_regulated) {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        if ($scope.grid.appScope.applySettingsActive) return false;
        return !$scope.row.entity.power_regulated;
      },
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.interior_lighting_systems_non_regulated_exclusion_enums,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'luminaire_mounting_height',
      secondLine: Shared.html('ft'),
      displayName: 'Mounting Height',
      enableHiding: false,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.luminaire_mounting_height != $scope.data.spaces[row.entity.space].floor_to_ceiling_height) {
          return 'modified-cell';
        }
      },
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'power_adjustment_factor_credit_type',
      displayName: 'Lighting Controls',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.interior_lighting_systems_power_adjustment_factor_credit_type_enums,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'power',
      secondLine: Shared.html('W'),
      enableCellEdit: false,
      enableHiding: false,
      cellClass: 'border-left-cell',
      headerCellClass: 'border-left-cell',
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }],
    data: $scope.data.lightingSystems,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.luminaireGridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (!$scope.applySettingsActive) {
          if (row.isSelected) {
            $scope.selected.lightingSystem = row.entity;
          } else {
            // No rows selected
            $scope.selected.lightingSystem = null;
          }
        }
      });
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        if (newValue != oldValue) {
          Shared.setModified();

          if (colDef.name == 'space') {
            $scope.data.calculateLPD(oldValue);
            $scope.data.calculateLPD(newValue);
          } else if (colDef.name == 'power_regulated') {
            if (newValue) {
              rowEntity.non_regulated_exclusion = null;
            } else {
              rowEntity.non_regulated_exclusion = Enums.enums.interior_lighting_systems_non_regulated_exclusion_enums[0];
            }
            $scope.data.calculateLPD(rowEntity.space);
          } else if (colDef.name == 'luminaire_count[0]') {
            var luminaire = $scope.data.luminaires[rowEntity.luminaire_reference[0]];
            if (luminaire) rowEntity.power = luminaire.power * newValue;
            $scope.data.calculateLPD(rowEntity.space);
          }
        }
      });
    }
  };

  // Modal Settings
  $scope.openLuminaireEditorModal = function (luminaireIndex) {
    var deferred = $q.defer();

    var modalInstance = $modal.open({
      backdrop: 'static',
      controller: 'ModalLuminaireEditorCtrl',
      templateUrl: 'spaces/luminaireEditor.html',
      windowClass: 'wide-modal',
      resolve: {
        params: function () {
          return {
            data: $scope.data,
            luminaireIndex: luminaireIndex,
            luminaireGridApi: $scope.luminaireGridApi
          };
        }
      }
    });

    modalInstance.result.then(function (row) {
      deferred.resolve(row);
    }, function () {
      // Modal canceled
      deferred.reject();
    });
    return deferred.promise;
  };

  // Buttons
  $scope.applySettings = function () {
    // TODO
    $scope.applySettingsActive = true;
  };

  $scope.confirmApplySettings = function () {
    Shared.setModified();

    // TODO
  };

  $scope.resetApplySettings = function () {
    // TODO
    $scope.applySettingsActive = false;
  };

  $scope.changeLuminaire = function (selectedLightingSystem) {
    var luminaireIndex = selectedLightingSystem.luminaire_reference[0] || null;
    $scope.openLuminaireEditorModal(luminaireIndex).then(function (row) {
      Shared.setModified();
      
      selectedLightingSystem.luminaire_reference[0] = row;
      selectedLightingSystem.power = $scope.data.luminaires[row].power * selectedLightingSystem.luminaire_count[0];
      $scope.data.calculateLPD(selectedLightingSystem.space);
      $scope.luminaireGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    });
  };

}]);
