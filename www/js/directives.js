/*globals angular:true*/
var app = angular.module('app.directives', [])

app.directive('fileButton', function() {
    return {
        link: function(scope, element, attributes) {

            var el = angular.element(element)
            var button = el.children()[0]

            el.css({
                position: 'relative',
                overflow: 'hidden',
                width: button.offsetWidth,
                height: button.offsetHeight
            })

            var fileInput = angular.element('<input type="file" multiple />')
            fileInput.css({
                position: 'absolute',
                top: 0,
                left: 0,
                'z-index': '2',
                width: '100%',
                height: '100%',
                opacity: '0',
                cursor: 'pointer'
            })

            el.append(fileInput)
        }
    }
})

.directive('bindingEvents', ['$document', function($document)  {
    console.log("call =>>>>>>>>>>");
    return {
      restrict: 'A',
      link: function(scope, element) {
        
        var triggerButton = document.getElementById('upload-picture-btn');
        var input = document.getElementById('take-picture-input');
        
        triggerButton.width = 10000;
        cope.$apply();
        
        triggerButton.bind('click', function(e) {
            
            setTimeout(function(){

                console.log("trigger");
                angular.element(input).triggerHandler('click');
                input.src="img.png";

                scope.$apply();
            }, 10);
            
        });
      }
    };
}])

.directive('myDraggable', ['$document', function($document) {
  return {
    link: function(scope, element, attr) {
      var startX = 0, startY = 0, x = 0, y = 0;

      element.css({
       position: 'relative',
       border: '1px solid red',
       backgroundColor: 'lightgrey',
       cursor: 'pointer'
      });

      element.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        startX = event.pageX - x;
        startY = event.pageY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        y = event.pageY - startY;
        x = event.pageX - startX;
        element.css({
          top: y + 'px',
          left:  x + 'px'
        });
      }

      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }
    }
  };
}]);