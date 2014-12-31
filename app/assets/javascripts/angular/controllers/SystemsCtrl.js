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

    //TODO: get systems by type
    $scope.ptacs = [];
    $scope.ptac_fans = [];

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

    // PTAC fan UI Grid
    $scope.ptacFanGridOptions = {
      columnDefs: [{
        name: 'name',
        displayName: 'System Name'
      }, {
        name: 'fan_name',
        displayName: 'Fan Name'
      },{
        name: 'control_method',
        displayName: 'Control Method'
      }, {
        name: 'flow_efficiency',
        displayName: 'Flow Efficiency'
      }, {
        name: 'total_static_pressure',
        displayName: 'Total Static Pressure'
      }, {
        name: 'motor_position',
        displayName: 'Motor Position'
      }, {
        name: 'motor_hp',
        displayName: 'Motor HP'
      }, {
        name: 'motor_type',
        displayName: 'Motor Type'
      }, {
        name: 'motor_pole_count',
        displayName: 'Motor Pole Count'
      }, {
        name: 'motor_efficiency',
        displayName: 'Motor Efficiency'
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
    $scope.ptacGridOptions.data = $scope.ptac_fans;

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
