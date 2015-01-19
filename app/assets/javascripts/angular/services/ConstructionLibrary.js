cbecc.factory('ConstructionLibrary', ['$q', '$modal', 'data', function ($q, $modal, data) {
  var service = {
    constData: data.list('constructions'),
    doorData: data.list('door_lookups'),
    fenData: data.list('fenestrations')
  };

  service.openConstructionLibraryModal = function (type, rowEntity) {
    var deferred = $q.defer();

    var modalInstance = $modal.open({
      backdrop: 'static',
      controller: 'ModalConstructionLibraryCtrl',
      templateUrl: 'constructions/const_library.html',
      windowClass: 'wide-modal',
      resolve: {
        params: function () {
          return {
            data: service.constData,
            rowEntity: rowEntity,
            type: type
          };
        }
      }
    });

    modalInstance.result.then(function (selectedConstruction) {
      deferred.resolve(selectedConstruction);
    }, function () {
      // Modal canceled
      deferred.reject();
    });
    return deferred.promise;
  };

  service.openDoorLibraryModal = function (type, rowEntity) {
    var deferred = $q.defer();

    var modalInstance = $modal.open({
      backdrop: 'static',
      controller: 'ModalDoorLibraryCtrl',
      templateUrl: 'constructions/door_library.html',
      windowClass: 'wide-modal',
      resolve: {
        params: function () {
          return {
            data: service.doorData,
            rowEntity: rowEntity,
            type: type
          };
        }
      }
    });

    modalInstance.result.then(function (selectedDoor) {
      deferred.resolve(selectedDoor);
    }, function () {
      // Modal canceled
      deferred.reject();
    });
    return deferred.promise;
  };

  service.openFenLibraryModal = function (type, rowEntity) {
    var deferred = $q.defer();

    var modalInstance = $modal.open({
      backdrop: 'static',
      controller: 'ModalFenestrationLibraryCtrl',
      templateUrl: 'constructions/fen_library.html',
      windowClass: 'wide-modal',
      resolve: {
        params: function () {
          return {
            data: service.fenData,
            rowEntity: rowEntity,
            type: type
          };
        }
      }
    });

    modalInstance.result.then(function (selectedFen) {
      deferred.resolve(selectedFen);
    }, function () {
      // Modal canceled
      deferred.reject();
    });
    return deferred.promise;
  };

  return service;
}]);
