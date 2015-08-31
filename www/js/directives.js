/*globals angular:true*/
var app = angular.module('app.directives', [])


.directive('drawContent', function() {
  return {
    restrict: 'AEC',
    templateUrl: 'draw-content.html'
  };
})