controllers = angular.module('controllers')
controllers.controller('TestCtrl', [ '$scope', '$routeParams', '$location', '$resource',
  ($scope,$routeParams,$location,$resource)->
    $scope.search = (keywords)->  $location.path("/").search('keywords',keywords)
    Project = $resource('/test/:projectId', { projectId: "@id", format: 'json' })

    if $routeParams.keywords
      Project.query(keywords: $routeParams.keywords, (results)-> $scope.projects = results)
    else
      $scope.projects = []
])