cbecc.controller('SpacesLightingCtrl', ['$scope', '$modal', function ($scope, $modal) {
  $scope.selected = {
    space: null
  };

  $scope.applySettingsActive = false;

  $scope.editableCondition = function ($scope) {
    while (!$scope.hasOwnProperty('applySettingsActive')) {
      $scope = $scope.$parent;
    }
    return !$scope.applySettingsActive;
  };

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
