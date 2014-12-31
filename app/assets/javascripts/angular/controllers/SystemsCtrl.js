cbecc.controller('SystemsCtrl', [
  '$scope', '$window', '$routeParams', '$resource', '$location', 'Shared', function ($scope, $window, $routeParams, $resource, $location, Shared) {
    //collapsible panels
    $scope.systemPanels = [{
      title: 'VAV Air Systems',
      name: 'VAV',
      open: true
    }, {
      title: 'PVAV Air Systems',
      name: 'PVAV'
    }, {
      title: 'PTAC Zone Systems',
      name: 'PTAC'
    }, {
      title: 'MAU Air Systems',
      name: 'MAU'
    }, {
      title: 'Exhaust Systems',
      name: 'Exhaust'
    }];

    $scope.plantPanels = [{
      title: 'Service Hot Water'
    }, {
      title: 'Chilled Water Plant'
    }, {
      title: 'Hot Water Plant'
    }, {
      title: 'Condenser Plant'
    }];

    function initTabs() {
      tabClasses = {};
      tabClasses['ptac']  = ["default","default","default","default","default"];
    }

    $scope.getTabClass = function (panelName, tabNum) {
      return "btn btn-" + tabClasses[panelName][tabNum];
    };

    $scope.setActiveTab = function (panelName, tabNum) {
      initTabs();
      tabClasses[panelName][tabNum] = "primary";
    };

    $scope.isActiveTab = function (panelName, tabNum){
      if (tabClasses[panelName][tabNum] === 'primary') {
        return true;
      }
      else {
        return false;
      }
    };

    //Initialize
    initTabs();
    $scope.setActiveTab('ptac', 0);

    //get systems by type
    $scope.ptacs = [];

    // PTAC general UI Grid
    $scope.ptacGridOptions = {
      columnDefs: [{
        name: 'name',
        displayName: 'System Name'
      }, {
        name: 'status',
        displayName: 'Status'
      }, {
        name: 'fan_control',
        displayName: 'Fan Control Ration'
      }],
      enableCellEditOnFocus: true,
      enableColumnMenus: false,
      enableRowHeaderSelection: true,
      enableRowSelection: true,
      enableSorting: false,
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
      }
    };
    $scope.ptacGridOptions.data = $scope.ptacs;


    //add functions
    $scope.addPTAC = function () {
      $scope.ptacs.push({
          name: "PTAC " + ($scope.ptacs.length + 1),
          status: 'New',
          fan_control: 'Constant Volume'
      });
    };
    // Buttons
    $scope.addStory = function () {
      $scope.stories.push({
        name: "Story " + ($scope.stories.length + 1),
        z: 0,
        floor_to_floor_height: 14,
        floor_to_ceiling_height: 10
      });
    };

  }
]);
