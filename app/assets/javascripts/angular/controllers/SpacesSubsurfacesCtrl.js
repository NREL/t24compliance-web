cbecc.controller('SpacesSubsurfacesCtrl', ['$scope', '$sce', 'uiGridConstants', 'Shared', function ($scope, $sce, uiGridConstants, Shared) {
  $scope.selectedSubsurface = null;

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

  // Update stories if they were modified on the Spaces subtab
  _.each($scope.data.surfaces, function (surface, index) {
    if (surface.story != $scope.data.spaces[surface.space].story) {
      surface.story = $scope.data.spaces[surface.space].story;
    }
  });

  // Subsurfaces UI Grid
  $scope.subsurfacesGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Subsurface Name',
      enableHiding: false,
      filter: angular.copy($scope.data.textFilter),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'space',
      displayName: 'Space Name',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapSpaces:this',
      editDropdownOptionsArray: $scope.spacesArr,
      filter: {
        condition: function (searchTerm, cellValue) {
          var haystack = $scope.spacesHash[cellValue];
          return _.contains(haystack.toLowerCase(), searchTerm.toLowerCase());
        }
      },
      headerCellTemplate: 'ui-grid/customHeaderCell',
      sortingAlgorithm: Shared.sort($scope.spacesArr)
    }, {
      name: 'surface',
      displayName: 'Surface Name',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapSurfaces:this',
      editDropdownOptionsArray: $scope.surfacesArr,
      filter: {
        condition: function (searchTerm, cellValue) {
          var haystack = $scope.data.surfacesHash[cellValue];
          return _.contains(haystack.toLowerCase(), searchTerm.toLowerCase());
        }
      },
      headerCellTemplate: 'ui-grid/customHeaderCell',
      sortingAlgorithm: Shared.sort($scope.data.surfacesArr)
    }, {
      name: 'subsurface_type',
      enableCellEdit: false,
      enableHiding: false,
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'story',
      enableCellEdit: false,
      cellFilter: 'mapStories:this',
      enableHiding: false,
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'area',
      secondLine: $sce.trustAsHtml('ft'),
      enableHiding: false,
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'construction',
      enableHiding: false,
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }],
    data: $scope.data.subsurfaces,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.data.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (row.isSelected) {
          $scope.selectedSubsurface = row.entity;
        } else {
          // No rows selected
          $scope.selectedSubsurface = null;
        }
      });
    }
  };

  // Buttons
  $scope.addSubsurface = function (type) {
    /*var spaceIndex = 0;

    var name = $scope.spacesHash[spaceIndex] + ' ' + type;
    var surfaceType = type;

    if (type == 'Wall' || type == 'Floor') {
      var len = _.filter($scope.data.surfaces, function (surface) {
        return surface.space == spaceIndex && surface.type == type;
      }).length;
      name += ' ' + (len + 1);
      surfaceType = boundary + ' ' + surfaceType;
    }
    $scope.data.surfaces.push({
      name: name,
      space: spaceIndex,
      type: type,
      boundary: boundary,
      surface_type: surfaceType,
      story: $scope.data.spaces[spaceIndex].story,
      area: null,
      azimuth: null,
      construction: null,
      adjacent_space: null,
      tilt: null,
      wall_height: null,
      exposed_perimeter: null
    });*/
  };
  $scope.duplicateSubsurface = function () {

  };
  $scope.deleteSubsurface = function () {

  };

}]);
