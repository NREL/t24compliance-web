controllers = angular.module('controllers')
controllers.controller("NavCtrl", [ '$scope', '$location',
	($scope, $location)->  
  
  	$scope.isActive = (viewLocation)-> 
  		viewLocation == $location.path()

])