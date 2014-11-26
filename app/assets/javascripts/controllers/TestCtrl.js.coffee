controllers = angular.module('controllers')
controllers.controller("TestCtrl", [ '$scope', '$routeParams', '$resource', '$location', 'flash',
  ($scope,$routeParams,$resource,$location, flash)->  

    Test = $resource('/tests/:testId', { testId: "@id", format: 'json'},
      {
        'save':   {method:'PUT'},
        'create': {method:'POST'}
      }
    )

    if $routeParams.testId
      Test.get({testId: $routeParams.testId},
        ( (test)-> $scope.test = test ),
        ( (httpResponse)->
          $scope.test = null
          flash.error   = "There is no test with ID #{$routeParams.testId}"
        )
      )
    else
      $scope.test = {}

    $scope.back   = -> $location.path("/")
    $scope.edit   = -> $location.path("/tests/#{$scope.test.id}/edit")
    $scope.cancel = ->
      if $scope.test.id
        $location.path("/tests/#{$scope.test.id}")
      else
        $location.path("/")

    $scope.save = ->
      onError = (_httpResponse)-> flash.error = "Something went wrong"
      if $scope.test.id
        $scope.test.$save(
          ( ()-> $location.path("/tests/#{$scope.test.id}") ),
          onError)
      else
        Test.create($scope.test,
          ( (newTest)-> $location.path("/tests/#{newTest.id}") ),
          onError
        )

    $scope.delete = ->
      $scope.test.$delete()
      $scope.back()


])