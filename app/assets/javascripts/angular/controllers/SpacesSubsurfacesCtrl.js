cbecc.controller('SpacesSubsurfacesCtrl', ['$scope', 'uiGridConstants', 'Shared', function ($scope, uiGridConstants, Shared) {
  $scope.selected = {
    subsurface: null
  };

  $scope.applySettingsActive = false;

  $scope.editableCondition = function ($scope) {
    while (!$scope.hasOwnProperty('applySettingsActive')) {
      $scope = $scope.$parent;
    }
    return !$scope.applySettingsActive;
  };

  $scope.spacesArr = [];
  $scope.spacesHash = {};
  _.each($scope.data.spaces, function (space, index) {
    $scope.spacesArr.push({
      id: index,
      value: space.name
    });
    $scope.spacesHash[index] = space.name;
  });

  $scope.surfacesArr = [];
  $scope.surfacesHash = {};
  _.each($scope.data.surfaces, function (surface, index) {
    $scope.surfacesArr.push({
      id: index,
      value: surface.name
    });
    $scope.surfacesHash[index] = surface.name;
  });

  // Subsurfaces UI Grid
  $scope.subsurfacesGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Subsurface Name',
      enableHiding: false,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'space',
      displayName: 'Space Name',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapSpaces:this',
      editDropdownOptionsArray: $scope.spacesArr,
      filter: Shared.enumFilter($scope.spacesHash),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      sortingAlgorithm: Shared.sort($scope.spacesArr)
    }, {
      name: 'surface',
      displayName: 'Surface Name',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapSurfaces:this',
      editDropdownOptionsArray: $scope.surfacesArr,
      filter: Shared.enumFilter($scope.surfacesHash),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      sortingAlgorithm: Shared.sort($scope.surfacesArr)
    }, {
      name: 'type',
      displayName: 'Subsurface Type',
      enableCellEdit: false,
      enableHiding: false,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'building_story_id',
      displayName: 'Story',
      enableCellEdit: false,
      cellFilter: 'mapStories:this',
      enableHiding: false,
      filter: Shared.enumFilter($scope.data.storiesHash),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'area',
      secondLine: Shared.html('ft'),
      enableHiding: false,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'construction',
      enableHiding: false,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }],
    data: $scope.data.subsurfaces,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (row.isSelected) {
          $scope.selected.subsurface = row.entity;
        } else {
          // No rows selected
          $scope.selected.subsurface = null;
        }
      });
    }
  };

  // Buttons
  $scope.applySettings = function () {
    $scope.applySettingsActive = true;
    $scope.data.clearAll($scope.gridApi);
    $scope.subsurfacesGridOptions.multiSelect = true;

    $scope.subsurfacesGridOptions.columnDefs[3].enableFiltering = false;
    $scope.subsurfacesGridOptions.columnDefs[3].filter.noTerm = true;
    $scope.subsurfacesGridOptions.columnDefs[3].filter.term = $scope.selected.subsurface.type;
    $scope.gridApi.core.notifyDataChange($scope.gridApi.grid, uiGridConstants.dataChange.COLUMN);
  };

  $scope.confirmApplySettings = function () {
    var replacement = {
      area: $scope.selected.subsurface.area,
      construction: $scope.selected.subsurface.construction
    };
    var rows = $scope.gridApi.selection.getSelectedRows();
    _.each(rows, function (row) {
      _.merge(row, replacement);
    });
    $scope.gridApi.core.notifyDataChange($scope.gridApi.grid, uiGridConstants.dataChange.EDIT);
    $scope.resetApplySettings();
  };

  $scope.resetApplySettings = function () {
    $scope.selected.subsurface = null;
    $scope.applySettingsActive = false;
    $scope.data.clearAll($scope.gridApi);
    $scope.subsurfacesGridOptions.multiSelect = false;

    $scope.subsurfacesGridOptions.columnDefs[3].enableFiltering = true;
    $scope.subsurfacesGridOptions.columnDefs[3].filter.noTerm = false;
    $scope.subsurfacesGridOptions.columnDefs[3].filter.term = '';
    $scope.gridApi.core.notifyDataChange($scope.gridApi.grid, uiGridConstants.dataChange.COLUMN);
  };

}]);
