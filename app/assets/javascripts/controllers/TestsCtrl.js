var controllers;

controllers = angular.module('controllers');

controllers.controller('TestsCtrl', [
  '$scope', '$routeParams', '$location', '$resource', function($scope, $routeParams, $location, $resource) {
    var Test;
    $scope.search = function(keywords) {
      return $location.path("/").search('keywords', keywords);
    };
    Test = $resource('/tests/:testId', {
      testId: "@id",
      format: 'json'
    });
    if ($routeParams.keywords) {
      Test.query({
        keywords: $routeParams.keywords
      }, function(results) {
        return $scope.tests = results;
      });
    } else {
      $scope.tests = [];
    }
    $scope.view = function(testId) {
      return $location.path("/tests/" + testId);
    };
    $scope.newTest = function() {
      return $location.path("/tests/new");
    };
    return $scope.edit = function(testId) {
      return $location.path("/tests/" + testId + "/edit");
    };
  }
]);
