<!DOCTYPE html>
<html ng-app="app">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="pragma" content="no-cache" />
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <title></title>

    <link href="lib/ionic/css/ionic.css" rel="stylesheet">
    <link href="css/style.css?v=4" rel="stylesheet">
    <link href="css/takephoto.css?v=4" rel="stylesheet">

    <!-- IF using Sass (run gulp sass first), then uncomment below and remove the CSS includes above
    <link href="css/ionic.app.css" rel="stylesheet">
    -->
   
    <!-- include underscore -->
    <script src="lib/underscore/underscore-min.js"></script>

     <!-- include jquery -->
    <script src="lib/jquery/dist/jquery.min.js"></script>
    
    <!-- ionic/angularjs js -->
    <script src="lib/ionic/js/ionic.bundle.js"></script>

    
    <!-- use for widget -->
   <script src="lib/fabric.js/dist/fabric.js"></script>

    <!-- use for instagram js filter -->
    <!-- your app's js -->

    <!-- use for image loader -->
    <script src="js/load-image.all.min.js"></script>
    
    <script src="js/eccube_hook.js?v2"></script>
    <script src="js/app.js?v=1"></script>
    <script src="js/services.js?v=1"></script>
    <script src="js/directives.js?v=1"></script>
    <script src="js/webcam.js?v=2"></script> 
    <script src="js/upload.js?v=3"></script> 
    <script src="js/controllers.js?v=11"></script>  
 
  </head>

   <body ng-controller="AppCtrl">
    
    <ion-nav-bar class="bar-assertive bar-header header-bar-color">
          <ion-nav-back-button class="button button-clear">
              <i class="button button-icon my-back-button"></i>
          </ion-nav-back-button>
    </ion-nav-bar>
    <ion-nav-view name="products"></ion-nav-view>
  </body>
</html>
