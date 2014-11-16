queue = angular.module('queue',[
  'templates',
  'ngRoute',
  'ngResource',
  'controllers',
])

queue.config([ '$routeProvider',
  ($routeProvider)->
    $routeProvider
    .when('/',
      templateUrl: "index.html"
      controller: 'RecipesController'
    )
])

controllers = angular.module('controllers',[])
controllers.controller("SimulationsController", [ '$scope', '$routeParams', '$location', '$resource',
 ($scope,$routeParams,$location,$resource)->
    $scope.search = (keywords)->  $location.path("/").search('keywords',keywords)
    Simulation = $resource('/simulations/:simulationId', { simulationId: "@id", format: 'json' })

    if $routeParams.keywords
      keywords = $routeParams.keywords.toLowerCase()
      Simulation.query(keywords: $routeParams.keywords, (results)-> $scope.simulations = results)
    else
      $scope.simulations = []
])

