cbecc.controller('SpacesLightingCtrl', ['$scope', '$modal', function ($scope, $modal) {
  $scope.selected = {
    space: null
  };

  $scope.applySettingsActive = false;

  // Modal Settings
  $scope.openLuminaireCreatorModal = function () {
    var modalInstance = $modal.open({
      backdrop: 'static',
      controller: 'ModalLuminaireCreatorCtrl',
      templateUrl: 'spaces/luminaireCreator.html',
      windowClass: 'wide-modal'
    });

    modalInstance.result.then(function (data) {
      console.log(data);
    }, function () {
      // Modal canceled
    });
  };

}]);
