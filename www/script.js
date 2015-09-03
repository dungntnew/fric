(function(angular) {
  'use strict';
angular.module('docsTabsExample', [])
  .controller('AppCtrl', function($scope){
       $scope.data = {};
       $scope.data.site_name = "Hello Directive";

  })
  .directive('appContent', function(){
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        title: '@'
      },
      link: function(scope, element, attrs, tabsCtrl) {
          console.log("ok");

                  var camera_btn = angular.element('#upload-picture-btn');
        console.log(camera_btn);
 camera_btn.bind('click', function(e){

            console.log("toxxxxxxxooll");

                    angular.element('#take-picture-input').trigger('click');
            // init uploader
            ///scope.startWebcam();
        });


       // $('#upload-picture-btn').bind('click', function(){
       //    alert("Gooog");
       // });
       
      },
      templateUrl: 'app-content.html'
    };
  })

  .directive('myTabs', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: function($scope) {
        var panes = $scope.panes = [];

        $scope.select = function(pane) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          pane.selected = true;
        };

        this.addPane = function(pane) {
          if (panes.length === 0) {
            $scope.select(pane);
          }
          panes.push(pane);
        };
      },
      templateUrl: 'my-tabs.html'
    };
  })
  .directive('myPane', function() {
    return {
      require: '^myTabs',
      restrict: 'E',
      transclude: true,
      scope: {
        title: '@'
      },
      controller: function($scope){
          $scope.setName = function(){
           
            setTimeout(function(){
              $scope.$apply(function(){
                 //$scope.data.site_name = "Hello ^^^^^^^";
                 console.log("setu ok");
              })
            })
          }
      },
      link: function(scope, element, attrs, tabsCtrl) {
        tabsCtrl.addPane(scope);
      },
      templateUrl: 'my-pane.html'
    };
  });
})(window.angular);