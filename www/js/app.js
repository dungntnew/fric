var app = angular.module('app', ['ionic', 'ngAnimate', 'app.controllers', 'app.services'])

app.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(5);

  // note that you can also chain configs
  $ionicConfigProvider.backButton.text('').icon('ion-chevron-left');
  $ionicConfigProvider.backButton.previousTitleText(false);
});


app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('products', {
    url: '/products',
    views: {
      'products': {
        templateUrl: 'templates/products.html',
        controller: 'ProductListCtrl'
      }
    }
  })
  .state('product-detail', {
    url: '/products/:productId',
    views: {
      'products': {
        templateUrl: 'templates/product-detail.html',
        controller: 'ProductDetailCtrl'
      }
    }
  })


  $urlRouterProvider.otherwise("/products");
})