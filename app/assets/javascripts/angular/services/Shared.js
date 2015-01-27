cbecc.factory('Shared', ['$log', '$q', '$templateCache', '$sce', '$window', 'DSCacheFactory', 'usSpinnerService', 'uiGridConstants', function ($log, $q, $templateCache, $sce, $window, DSCacheFactory, usSpinnerService, uiGridConstants) {
  var service = {};
  var projectId = null;
  var buildingId = null;
  var modified = false;
  var cache = DSCacheFactory('libraries', {
    storageMode: 'localStorage',
    maxAge: 604800000 // 1 week
  });

  service.defaultParams = function () {
    return {
      project_id: this.getProjectId(),
      building_id: this.getBuildingId()
    };
  };

  service.setIds = function ($stateParams) {
    if ($stateParams.project_id) {
      this.setProjectId($stateParams.project_id);
    }
    if ($stateParams.building_id) {
      this.setBuildingId($stateParams.building_id);
    }
  };
  service.setProjectId = function (value) {
    if (value != projectId) {
      projectId = value;
    }
  };

  service.getProjectId = function () {
    return projectId;
  };

  service.setBuildingId = function (value) {
    if (value != buildingId) {
      buildingId = value;
    }
  };

  service.getBuildingId = function () {
    return buildingId;
  };

  service.lookupBuilding = function ($q, data, requireBuilding) {
    var deferred = $q.defer();
    var scope = this;
    if (!this.getProjectId()) {
      deferred.reject('No project ID');
    } else {
      if (!this.getBuildingId()) {
        data.list('buildings', this.defaultParams()).then(
          function (response) {
            if (response.length > 0 && response[0].hasOwnProperty('id')) {
              scope.setBuildingId(response[0].id);
              deferred.resolve("success");
            } else {
              if (requireBuilding) {
                deferred.reject("No building ID");
              } else {
                deferred.resolve("Unable to look up building but building not required.");
              }
            }
          },
          function (response) {
            if (requireBuilding) {
              deferred.reject("No building ID");
            } else {
              deferred.resolve("Error looking up building but building not required.");
            }
          });
      } else {
        deferred.resolve('Building ID already set');
      }
    }
    return deferred.promise;
  };

  service.projectPath = function () {
    var path = "/projects";
    if (projectId) {
      path += "/" + projectId;
    }
    return path;
  };

  service.buildingPath = function () {
    var path = "";
    if (projectId) {
      path = "/projects/" + projectId + "/buildings";
      if (buildingId) {
        path += "/" + buildingId;
      }
    } else {
      path = "/buildings"; //can't actually navigate here without project id...
    }
    return path;
  };

  service.constructionsPath = function () {
    if (projectId && buildingId) {
      return "/projects/" + projectId + "/buildings/" + buildingId + "/constructions";
    } else {
      //shouldn't be able to get to this
      return "/constructions";
    }
  };

  service.spacesPath = function () {
    if (projectId && buildingId) {
      return "/projects/" + projectId + "/buildings/" + buildingId + "/spaces";
    } else {
      //shouldn't be able to get to this
      return "/spaces";
    }
  };

  service.systemsPath = function () {
    if (projectId && buildingId) {
      return "/projects/" + projectId + "/buildings/" + buildingId + "/systems";
    } else {
      //shouldn't be able to get to this
      return "/systems";
    }
  };

  service.zonesPath = function () {
    if (projectId && buildingId) {
      return "/projects/" + projectId + "/buildings/" + buildingId + "/zones";
    } else {
      //shouldn't be able to get to this
      return "/zones";
    }
  };

  service.reviewPath = function () {
    if (projectId && buildingId) {
      return "/projects/" + projectId + "/buildings/" + buildingId + "/review";
    } else {
      //shouldn't be able to get to this
      return "/review";
    }
  };

  service.compliancePath = function () {
    if (projectId && buildingId) {
      return "/projects/" + projectId + "/buildings/" + buildingId + "/compliance";
    } else {
      //shouldn't be able to get to this
      return "/compliance";
    }
  };

  service.startSpinner = function () {
    usSpinnerService.spin('spinner');
  };

  service.stopSpinner = function () {
    usSpinnerService.stop('spinner');
  };

  service.setModified = function () {
    if (!modified) {
      $window.onbeforeunload = function () {
        return 'You have unsaved changes.';
      };
      modified = true;
    }
  };

  service.resetModified = function () {
    if (modified) {
      $window.onbeforeunload = null;
      modified = false;
    }
  };

  service.isModified = function () {
    return modified;
  };

  service.showModifiedDialog = function () {
    return confirm('You have unsaved changes.  Are you sure you want to navigate away?');
  };

  service.existsInCache = function (key) {
    var info = cache.info(key);
    return info !== undefined && !info.isExpired;
  };

  service.loadFromCache = function (key) {
    if (!service.existsInCache(key)) {
      return null;
    }
    //var start = new Date().getTime();
    var decompressed = LZString.decompressFromUTF16(cache.get(key));
    //var end = new Date().getTime();
    //$log.debug('Decompressed ' + key + ' in ' + (end - start) + ' ms');
    return JSON.parse(decompressed);
  };

  service.saveToCache = function (key, value) {
    // Test compression algorithms
    /*var start = new Date().getTime();
     var str = JSON.stringify(value);
     $log.debug(key + ' stringify.length: ' + str.length);
     var end = new Date().getTime();
     $log.debug('    Execution time: ' + (end-start) + ' ms');

     start = new Date().getTime();
     $log.debug(key + ' compress.length: ' + LZString.compress(str).length);
     end = new Date().getTime();
     $log.debug('    Execution time: ' + (end-start) + ' ms');

     start = new Date().getTime();
     $log.debug(key + ' compressToUTF16.length: ' + LZString.compressToUTF16(str).length);
     end = new Date().getTime();
     $log.debug('    Execution time: ' + (end-start) + ' ms');

     start = new Date().getTime();
     $log.debug(key + ' compressToUint8Array.length: ' + LZString.compressToUint8Array(str).length);
     end = new Date().getTime();
     $log.debug('    Execution time: ' + (end-start) + ' ms');*/

    var compressed = LZString.compressToUTF16(JSON.stringify(value));
    cache.put(key, compressed);
  };

  // Contains All condition, split by spaces
  service.textFilter = function () {
    return {
      condition: function (searchTerm, cellValue) {
        if (searchTerm == 'null') return _.isEmpty(cellValue);
        if (cellValue == null) return false;
        var terms = _.uniq(searchTerm.toLowerCase().split(/ +/));
        var value = cellValue.toLowerCase();
        return _.every(terms, function (term) {
          var regex = new RegExp(term);
          return regex.test(value);
        });
      }
    };
  };

  service.enumFilter = function (input) {
    return {
      condition: function (searchTerm, cellValue) {
        if (cellValue == null) return false;
        var terms = _.uniq(searchTerm.toLowerCase().split(/ +/));
        var value = input[cellValue];
        if (input instanceof Array) {
          value = value.value;
        }
        value = value.toLowerCase();
        return _.every(terms, function (term) {
          var regex = new RegExp(term);
          return regex.test(value);
        });
      }
    };
  };

  service.numberFilter = function () {
    return [{
      condition: function (searchTerm, cellValue) {
        var term = searchTerm.replace(/[^\d.-]/g, '');
        if (term.length) {
          term = Number(term);
          if (isNaN(term)) term = 0;
          if (cellValue == null) return false;
          return cellValue >= term;
        }
        return true;
      },
      placeholder: 'At least'
    }, {
      condition: function (searchTerm, cellValue) {
        var term = searchTerm.replace(/[^\d.-]/g, '');
        if (term.length) {
          term = Number(term);
          if (isNaN(term)) term = 0;
          if (cellValue == null) return false;
          return cellValue <= term;
        }
        return true;
      },
      placeholder: 'No more than'
    }];
  };

  service.sort = function (input) {
    return function (a, b) {
      if (a == b) {
        return 0;
      }
      if (a == null) {
        return 1;
      } else if (b == null) {
        return -1;
      }
      var strA = input[a];
      var strB = input[b];
      if (input instanceof Array) {
        strA = strA.value;
        strB = strB.value;
      }
      return strA < strB ? -1 : 1;
    };
  };

  service.html = function (input) {
    return $sce.trustAsHtml(input);
  };

  service.calculateTotalExhaust = function (space) {
    var perArea = (space.exhaust_per_area * space.area) || 0;
    var perVolume = (space.exhaust_air_changes_per_hour * space.floor_to_ceiling_height * space.area / 60) || 0;
    var perSpace = space.exhaust_per_space || 0;
    return Math.round(perArea + perVolume + perSpace);
  };

  $templateCache.put('ui-grid/cbeccHeaderCell', '<div ng-class="{ \'sortable\': sortable }"><div class="ui-grid-vertical-bar">&nbsp;</div><div class="ui-grid-cell-contents" col-index="renderIndex"><span>{{ col.displayName CUSTOM_FILTERS }}</span> <span ui-grid-visible="!col.colDef.enableCellEdit && col.colDef.displayName != \'Construction\' && col.colDef.displayName != \'Luminaire\'" class="fa fa-lock"></span> <span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">&nbsp;</span></div><div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)"><i class="ui-grid-icon-angle-down">&nbsp;</i></div><div ng-if="grid.options.enableFiltering && col.enableFiltering" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" ng-attr-placeholder="{{colFilter.placeholder || \'\'}}"><div class="ui-grid-filter-button" ng-click="colFilter.term = null"><i class="ui-grid-icon-cancel" ng-show="!!colFilter.term">&nbsp;</i><!-- use !! because angular interprets \'f\' as false --></div></div></div>');
  $templateCache.put('ui-grid/cbeccHeaderCellWithUnits', '<div ng-class="{ \'sortable\': sortable }"><div class="ui-grid-vertical-bar">&nbsp;</div><div class="ui-grid-cell-contents" col-index="renderIndex"><span>{{ col.displayName CUSTOM_FILTERS }}</span> <span ui-grid-visible="!col.colDef.enableCellEdit && col.colDef.displayName != \'Construction\' && col.colDef.displayName != \'Luminaire\'" class="fa fa-lock"></span> <span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">&nbsp;</span><br><small ng-bind-html="col.colDef.secondLine"></small></div><div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)"><i class="ui-grid-icon-angle-down">&nbsp;</i></div><div ng-if="grid.options.enableFiltering && col.enableFiltering" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" ng-attr-placeholder="{{colFilter.placeholder || \'\'}}"><div class="ui-grid-filter-button" ng-click="colFilter.term = null"><i class="ui-grid-icon-cancel" ng-show="!!colFilter.term">&nbsp;</i><!-- use !! because angular interprets \'f\' as false --></div></div></div>');
  $templateCache.put('ui-grid/cbeccConstructionCell', '<div class="ui-grid-cell-contents"><span class="glyphicon glyphicon-edit pull-right edit" ui-grid-visible=\"col.colDef.allowConstructionEdit\" aria-hidden="true" ng-click="grid.appScope.changeConstruction(row.entity)"></span><span>{{COL_FIELD CUSTOM_FILTERS}}</span></div>');
  $templateCache.put('ui-grid/cbeccLuminaireCell', '<div class="ui-grid-cell-contents"><span class="glyphicon glyphicon-edit pull-right edit" ui-grid-visible=\"col.colDef.allowLuminaireEdit\" aria-hidden="true" ng-click="grid.appScope.changeLuminaire(row.entity)"></span><span>{{COL_FIELD CUSTOM_FILTERS}}</span></div>');

  return service;
}]);
