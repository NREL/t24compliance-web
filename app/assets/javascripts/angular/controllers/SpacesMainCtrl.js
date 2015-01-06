cbecc.controller('SpacesMainCtrl', ['$scope', '$modal', 'uiGridConstants', function ($scope, $modal, uiGridConstants) {
  // Initialize Spaces UI Grid
  if (_.isEmpty($scope.data.spacesGridOptions)) {
    $scope.data.spacesGridOptions = {
      columnDefs: [{
        name: 'name',
        displayName: 'Space Name',
        enableHiding: false,
        filter: {
          condition: uiGridConstants.filter.CONTAINS
        }
      }, {
        name: 'floor_to_ceiling_height',
        enableHiding: false
      }, {
        name: 'story',
        enableHiding: false
      }, {
        name: 'area',
        enableHiding: false
      }, {
        name: 'conditioning_type',
        enableHiding: false
      }, {
        name: 'envelope_status',
        enableHiding: false
      }, {
        name: 'lighting_status',
        enableHiding: false
      }],
      data: $scope.data.spaces,
      enableCellEditOnFocus: true,
      enableFiltering: true,
      enableRowHeaderSelection: true,
      enableRowSelection: true,
      multiSelect: false,
      onRegisterApi: function (gridApi) {
        $scope.data.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          if (row.isSelected) {
            $scope.data.selectedSpace = row.entity;
          } else {
            // No rows selected
            $scope.data.selectedSpace = null;
          }
        });
      }
    };
  }

  // Modal Settings
  $scope.openSpaceCreatorModal = function () {
    var modalInstance = $modal.open({
      backdrop: 'static',
      controller: 'ModalSpaceCreatorCtrl',
      templateUrl: 'spaces/spaceCreator.html',
      windowClass: 'wide-modal'
    });

    modalInstance.result.then(function (spaceGroups) {
      console.log(spaceGroups);
      _.each(spaceGroups, function (spaceGroup) {
        for (var i = 0; i < spaceGroup.quantity; ++i) {
          $scope.data.spaces.push({
            name: spaceGroup.name + ' ' + (i + 1),
            floor_to_ceiling_height: spaceGroup.floor_to_ceiling_height,
            story: spaceGroup.story,
            area: spaceGroup.area,
            conditioning_type: spaceGroup.conditioning_type,
            envelope_status: spaceGroup.envelope_status,
            lighting_status: spaceGroup.lighting_status
          });
        }
      });
    }, function () {
      // Modal canceled
    });
  };
}]);

cbecc.controller('ModalSpaceCreatorCtrl', [
  '$scope', '$window', '$modalInstance', 'uiGridConstants', function ($scope, $window, $modalInstance, uiGridConstants) {
    $scope.spaceGroups = [];

    $scope.spaceFunctions = [];
    _.each($window.enums.spaces_space_function_enums, function (val, index) {
      $scope.spaceFunctions.push({
        id: index,
        value: val
      });
    });

    $scope.gridOptions = {
      columnDefs: [{
        name: 'quantity',
        displayName: '# of Spaces of This Type'
      }, {
        name: 'name',
        displayName: 'Name + 1,2,3...'
      }, {
        name: 'space_function',
        displayName: 'Space Type or Function',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        cellFilter: 'mapEnums:"spaces_space_function_enums"',
        editDropdownOptionsArray: $scope.spaceFunctions
      }, {
        name: 'floor_to_ceiling_height'
      }, {
        name: 'story',
        width: 71
      }, {
        name: 'area',
        displayName: 'Area (ft2)',
        width: 98
      }, {
        name: 'conditioning_type'
      }, {
        name: 'envelope_status'
      }, {
        name: 'lighting_status'
      }],
      data: [{
        quantity: 20,
        name: 'Small Office',
        space_type_or_function: 0,
        floor_to_ceiling_height: 10,
        area: 250,
        story: 1,
        conditioning_type: 'Directly Conditioned',
        envelope_status: 'New',
        lighting_status: 'New'
      }],
      enableCellEditOnFocus: true,
      enableColumnMenus: false,
      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableSorting: false,
      enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER
    };

    $scope.wallGridOptions = {
      columnDefs: [{
        name: 'external_walls',
        displayName: '# of External Walls'
      }, {
        name: 'windows',
        displayName: '# of Windows on External Walls'
      }, {
        name: 'internal_walls',
        displayName: '# of Internal Walls'
      }],
      data: [{
        external_walls: 1,
        windows: 1,
        internal_walls: 3
      }],
      enableCellEditOnFocus: true,
      enableColumnMenus: false,
      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableSorting: false,
      enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER
    };

    $scope.addSpaceGroup = function () {
      $scope.spaceGroups.push({
        gridOptions: angular.copy($scope.gridOptions),
        wallGridOptions: angular.copy($scope.wallGridOptions)
      });
    };

    $scope.addSpaceGroup();

    $scope.removeSpaceGroup = function (index) {
      $scope.spaceGroups.splice(index, 1);
    };

    $scope.ok = function () {
      var data = [];
      for (var i = 0; i < $scope.spaceGroups.length; ++i) {
        data.push({
          spaceGroup: $scope.spaceGroups[i].gridOptions.data[0],
          walls: $scope.spaceGroups[i].wallGridOptions.data[0]
        });
      }
      $modalInstance.close(data);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
