cbecc.factory('Shared', ['$log', '$q', '$templateCache', '$sce', '$window', '$modal', 'CacheFactory', 'usSpinnerService', 'toaster', 'uiGridConstants', function ($log, $q, $templateCache, $sce, $window, $modal, CacheFactory, usSpinnerService, toaster, uiGridConstants) {
  var service = {};
  var projectId = null;
  var buildingId = null;
  var simulationId = null;
  var modified = false;
  var fullscreen = false;
  var cache = CacheFactory('libraries', {
    storageMode: 'localStorage'
  });

  // Cache update timestamps - Change this if the datasets are modified by putting in a new epoch timestamp (w/milliseconds)
  var timestamps = {
    'constructions': 1431720942000,
    'door_lookups': 1431720942000,
    'fenestrations': 1431720942000,
    'space_function_defaults': 1431720942000
  };


  service.defaultParams = function () {
    return {
      project_id: service.getProjectId(),
      building_id: service.getBuildingId()
    };
  };

  service.setIds = function ($stateParams) {
    if ($stateParams.project_id) {
      service.setProjectId($stateParams.project_id);
    }
    if ($stateParams.building_id) {
      service.setBuildingId($stateParams.building_id);
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

  service.setSimulationId = function (value) {
    if (value != simulationId) {
      simulationId = value;
    }
  };

  service.getSimulationId = function () {
    return simulationId;
  };

  service.lookupBuilding = function (data, requireBuilding) {
    var deferred = $q.defer();

    var checkBuilding = function(data, requireBuilding, deferred) {
      if (!service.getBuildingId()) {
        data.list('buildings', service.defaultParams()).then(
          function (response) {
            if (response.length && response[0].hasOwnProperty('id')) {
              service.setBuildingId(response[0].id);
              deferred.resolve('success');
            } else {
              if (requireBuilding) {
                deferred.reject('No building ID');
              } else {
                deferred.resolve('Unable to look up building but building not required.');
              }
            }
          },
          function (response) {
            if (requireBuilding) {
              deferred.reject('No building ID');
            } else {
              // Verify that project id is valid
              data.show('projects', {id: service.getProjectId()}).then(function (response) {
                deferred.resolve('Error looking up building but building not required.');
              }, function (response) {
                deferred.reject('Invalid project ID');
              });
            }
          });
      } else {
        deferred.resolve('Building ID already set');
      }
    };

    if (!service.getProjectId()) {
      deferred.reject('No project ID');
    } else {
      if (!service.getSimulationId()) {
        data.show('projects', {id: service.getProjectId()}).then(function (response) {
          service.setSimulationId(response.simulation_id);
          checkBuilding(data, requireBuilding, deferred);
        }, function (response) {
          deferred.reject('Error looking up simulation ID');
        });
      } else {
        checkBuilding(data, requireBuilding, deferred);
      }
    }
    return deferred.promise;
  };

  service.projectPath = function () {
    var path = '/';
    if (projectId) {
      path += 'projects/' + projectId;
    }
    return path;
  };

  service.buildingPath = function () {
    var path = '';
    if (projectId) {
      path = '/projects/' + projectId + '/buildings';
      if (buildingId) {
        path += '/' + buildingId;
      }
    } else {
      path = '/buildings'; //can't actually navigate here without project id...
    }
    return path;
  };

  service.constructionsPath = function () {
    if (projectId && buildingId) {
      return '/projects/' + projectId + '/buildings/' + buildingId + '/constructions';
    } else {
      //shouldn't be able to get to this
      return '/constructions';
    }
  };

  service.spacesPath = function () {
    if (projectId && buildingId) {
      return '/projects/' + projectId + '/buildings/' + buildingId + '/spaces';
    } else {
      //shouldn't be able to get to this
      return '/spaces';
    }
  };

  service.systemsPath = function () {
    if (projectId && buildingId) {
      return '/projects/' + projectId + '/buildings/' + buildingId + '/systems';
    } else {
      //shouldn't be able to get to this
      return '/systems';
    }
  };

  service.zonesPath = function () {
    if (projectId && buildingId) {
      return '/projects/' + projectId + '/buildings/' + buildingId + '/zones';
    } else {
      //shouldn't be able to get to this
      return '/zones';
    }
  };

  service.reviewPath = function () {
    if (projectId && buildingId) {
      return '/projects/' + projectId + '/buildings/' + buildingId + '/review';
    } else {
      //shouldn't be able to get to this
      return '/review';
    }
  };

  service.compliancePath = function () {
    if (projectId && buildingId) {
      return '/projects/' + projectId + '/buildings/' + buildingId + '/compliance';
    } else {
      //shouldn't be able to get to this
      return '/compliance';
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
    var modalInstance = $modal.open({
      templateUrl: 'project/modified.html',
      controller: 'ModalModifiedCtrl'
    });

    return modalInstance.result;
  };

  service.setFullscreen = function (bool) {
    if (fullscreen != bool) fullscreen = bool;
  };

  service.isFullscreen = function () {
    return fullscreen;
  };

  service.existsInCache = function (key) {
    var info = cache.info(key);
    if (info) {
      //$log.debug('Cache Info for ' + key, info);

      // Force cache refresh
      if (info.created < timestamps[key]) return false;

      return !info.isExpired;
    }
    return false;
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

  service.checkUnique = function (data, name, rowIndex) {
    var unique = _.isEmpty(_.filter(data, function (row, index) {
      return rowIndex != index && row.name == name;
    }));
    if (!unique && rowIndex != null) toaster.warning('Name must be unique', '"' + name + '" already exists.');
    return unique;
  };

  service.uniqueName = function (data, template, num) {
    if (num === undefined) num = data.length + 1;
    while (!service.checkUnique(data, template({num: num}))) num++;
    return template({num: num});
  };

  // Contains All condition, split by spaces
  service.textFilter = function () {
    return [{
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
    }];
  };

  service.enumFilter = function (input) {
    return [{
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
    }];
  };

  service.exactFilter = function (input) {
    return [{
      condition: uiGridConstants.filter.EXACT,
      noTerm: true,
      term: input
    }];
  };

  service.notFilter = function (input) {
    return [{
      condition: uiGridConstants.filter.NOT_EQUAL,
      noTerm: true,
      term: input
    }];
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

  service.fixPrecision = function (input) {
    return parseFloat(input.toPrecision(12));
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

  service.updateExhaustSystems = function (zones, spaces, exhausts) {
    $log.debug('UPDATING EXHAUST SYSTEMS');
    // first add/update zone_id, zone_name to exhaust systems object (if not there already)
    _.each(zones, function (zone) {
      $log.debug('Zone:', zone);
      if (zone.exhaust_system_reference) {
        $log.debug('Exhaust system reference:', zone.exhaust_system_reference);
        _.each(exhausts, function (system) {
          if (system.name === zone.exhaust_system_reference) {
            system.zone_id = zone.id;
            system.zone_name = zone.name;
            return false;
          }
        });
      }
    });
    $log.debug('data.exhausts:', exhausts);

    // go through all conditioned zones and see if they are attached to a space with exhaust
    var exhaustZonesArr = [];
    _.each(_.filter(zones, {type: 'Conditioned'}), function (zone) {
      _.each(_.filter(spaces, {thermal_zone_reference: zone.name}), function (space) {
        if (service.calculateTotalExhaust(space) > 0) {
          //$log.debug('TOTAL EXHAUST FOR ', space.name, ': ', Shared.calculateTotalExhaust(space) );
          exhaustZonesArr.push(zone);
          // break when 1 space is found
          return false;
        }
      });
    });
    $log.debug('Exhaust zones array:', exhaustZonesArr);
    var match;
    // delete old exhaust systems
    _.eachRight(exhausts, function (exhaust, index) {
      match = _.find(exhaustZonesArr, {name: exhaust.zone_name});
      if (!match) {
        // update system reference on zone
        _.each(_.filter(zones, {exhaust_system_reference: exhaust.name}), function (zone) {
          zone.exhaust_system_reference = null;
        });
        // delete if saved zone doesn't match current exhaust zones
        $log.debug('Deleting exhaust at index', index);
        exhausts.splice(index, 1);
      }
    });

    // add missing new exhaust systems
    _.each(exhaustZonesArr, function (zone) {
      match = _.find(exhausts, {zone_name: zone.name});
      if (!match) {
        $log.debug('NO MATCH FOR zone id:', zone.id);
        // add to array
        exhausts.push({
          zone_id: zone.id,
          zone_name: zone.name,
          name: zone.name + ' Exhaust System',
          type: 'Exhaust',
          fan: {
            name: zone.name + ' Exhaust Fan'
          }
        });
      }
    });

    $log.debug('Final exhausts:', exhausts);
  };


  $templateCache.put('ui-grid/cbeccHeaderCell', '<div ng-class="{ \'sortable\': sortable }"><div class="ui-grid-vertical-bar">&nbsp;</div><div class="ui-grid-cell-contents" col-index="renderIndex"><span>{{ col.displayName CUSTOM_FILTERS }}</span> <span ui-grid-visible="!col.colDef.enableCellEdit && col.colDef.displayName != \'Construction\' && col.colDef.displayName != \'Luminaire\'" class="fa fa-lock"></span> <span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">&nbsp;</span></div><div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)"><i class="ui-grid-icon-angle-down">&nbsp;</i></div><div ng-if="grid.options.enableFiltering && col.enableFiltering" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" ng-attr-placeholder="{{colFilter.placeholder || \'\'}}"><div class="ui-grid-filter-button" ng-click="colFilter.term = null"><i class="ui-grid-icon-cancel" ng-show="!!colFilter.term">&nbsp;</i><!-- use !! because angular interprets \'f\' as false --></div></div></div>');
  $templateCache.put('ui-grid/cbeccHeaderCellWithUnits', '<div ng-class="{ \'sortable\': sortable }"><div class="ui-grid-vertical-bar">&nbsp;</div><div class="ui-grid-cell-contents" col-index="renderIndex"><span>{{ col.displayName CUSTOM_FILTERS }}</span> <span ui-grid-visible="!col.colDef.enableCellEdit && col.colDef.displayName != \'Construction\' && col.colDef.displayName != \'Luminaire\'" class="fa fa-lock"></span> <span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">&nbsp;</span><br><small ng-bind-html="col.colDef.secondLine"></small></div><div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)"><i class="ui-grid-icon-angle-down">&nbsp;</i></div><div ng-if="grid.options.enableFiltering && col.enableFiltering" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" ng-attr-placeholder="{{colFilter.placeholder || \'\'}}"><div class="ui-grid-filter-button" ng-click="colFilter.term = null"><i class="ui-grid-icon-cancel" ng-show="!!colFilter.term">&nbsp;</i><!-- use !! because angular interprets \'f\' as false --></div></div></div>');
  $templateCache.put('ui-grid/cbeccConstructionCell', '<div class="ui-grid-cell-contents"><span class="glyphicon glyphicon-edit pull-right edit" ui-grid-visible=\"col.colDef.allowConstructionEdit\" aria-hidden="true" ng-click="grid.appScope.changeConstruction(row.entity)"></span><span>{{COL_FIELD CUSTOM_FILTERS}}</span></div>');
  $templateCache.put('ui-grid/cbeccLuminaireCell', '<div class="ui-grid-cell-contents"><span class="glyphicon glyphicon-edit pull-right edit" ui-grid-visible=\"col.colDef.allowLuminaireEdit\" aria-hidden="true" ng-click="grid.appScope.changeLuminaire(row.entity)"></span><span>{{COL_FIELD CUSTOM_FILTERS}}</span></div>');

  return service;
}]);
