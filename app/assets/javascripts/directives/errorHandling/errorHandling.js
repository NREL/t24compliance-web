/**
 * Common error handling module, provides a directive for displaying field errors
 */

angular.module( 'common.errorHandling', ['templates'])

.directive('fieldError', function () {
  return {
    restrict: 'A',
    scope: {
      errors: '=',
      field: '@'
    },
    templateUrl: 'fieldError.html'
  };  
})
;