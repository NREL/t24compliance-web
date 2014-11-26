controllers = angular.module('controllers')
controllers.controller('TestsCtrl', [ '$scope', '$routeParams', '$location', '$resource',
  ($scope,$routeParams,$location,$resource)->
    $scope.search = (keywords)->  $location.path("/").search('keywords',keywords)
    Test = $resource('/tests/:testId', { testId: "@id", format: 'json'})

    if $routeParams.keywords
      Test.query(keywords: $routeParams.keywords, (results)-> $scope.tests = results)
    else
      $scope.tests = []

    $scope.view = (testId)-> $location.path("/tests/#{testId}")

    $scope.newTest = -> $location.path("/tests/new")
    $scope.edit      = (testId)-> $location.path("/tests/#{testId}/edit")
])
