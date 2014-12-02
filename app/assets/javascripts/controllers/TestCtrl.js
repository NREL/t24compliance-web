var controllers;

controllers = angular.module('controllers');

controllers.controller("TestCtrl", [
  '$scope', '$routeParams', '$resource', '$location', 'flash', function($scope, $routeParams, $resource, $location, flash) {
    var Test;
    Test = $resource('/tests/:testId', {
      testId: "@id",
      format: 'json'
    }, {
      'save': {
        method: 'PUT'
      },
      'create': {
        method: 'POST'
      }
    });
    if ($routeParams.testId) {
      Test.get({
        testId: $routeParams.testId
      }, (function(test) {
        return $scope.test = test;
      }), (function(httpResponse) {
        $scope.test = null;
        return flash.error = "There is no test with ID " + $routeParams.testId;
      }));
    } else {
      $scope.test = {};
    }
    $scope.back = function() {
      return $location.path("/");
    };
    $scope.edit = function() {
      return $location.path("/tests/" + $scope.test.id + "/edit");
    };
    $scope.cancel = function() {
      if ($scope.test.id) {
        return $location.path("/tests/" + $scope.test.id);
      } else {
        return $location.path("/");
      }
    };
    $scope.save = function() {
      var onError;
      console.log('hi! ');
      onError = function(_httpResponse) {
        $scope.errors = _httpResponse.data;
        return flash.error = "Something went wrong";
      };
      console.log($scope.errors);
      if ($scope.test.id) {
        return $scope.test.$save((function() {
          return $location.path("/tests/" + $scope.test.id);
        }), onError);
      } else {
        return Test.create($scope.test, (function(newTest) {
          return $location.path("/tests/" + newTest.id);
        }), onError);
      }
    };
    return $scope["delete"] = function() {
      var onError;
      onError = function(_httpResponse) {
        return flash.error = _httpResponse.data;
      };
      return $scope.test.$delete((function() {
        return $scope.back();
      }), onError);
    };
  }
]);