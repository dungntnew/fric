angular.module('app.controllers', ['app.services', 'app.webcam', 'app.directives'])


.controller('AppCtrl', function($scope, $window, $timeout, $ionicLoading, $ionicPopup) {

    ionic.Platform.ready(function() {
        // will execute when device is ready, or immediately if the device is already ready.
    });

    // config device type
    $scope.isInitialized = false;
    $scope.isMobile = function() {
        if ($scope.isInitialized) {
            return $scope.isMobileDevice;
        }

        var deviceInformation = ionic.Platform.device();
        var isWebView = ionic.Platform.isWebView();
        var isIPad = ionic.Platform.isIPad();
        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();
        var isWindowsPhone = ionic.Platform.isWindowsPhone();
        var currentPlatform = ionic.Platform.platform();
        var currentPlatformVersion = ionic.Platform.version();
        var isMobileDevice = isIPad || isIOS || isAndroid || isWindowsPhone;
        $scope.isInitialized = true;
        $scope.isMobileDevice = isMobileDevice;

        // console.log("isWebView: " + isWebView);
        // console.log("isIOS: " + isIOS);
        // console.log("currentPlatform: " + currentPlatform);
        // console.log("detected isMobile => " + $scope.isMobileDevice);
        return $scope.isMobileDevice;
    }

    // config rendering size
    $scope.config = $scope.config || {}
    $scope.config.widthToHeight = 4 / 3;
    $scope.config.maxHeight = 425;

    // detect brower support camera
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    window.URL = window.URL || window.webkitURL;
    //ionic.Platform.exitApp(); // stops the app

    $scope.calculateDimensions = function(gesture) {
        $scope.w = $window.innerWidth;
        $scope.h = $window.innerHeight;
    }
    $scope.calculateDimensions();

    angular.element($window).bind('resize', function() {
        $scope.$apply(function() {
            $scope.calculateDimensions();
        })
    });


    // Setup the loader
    $ionicLoading.show({
        template: '<p class="item-icon-left">Loading stuff...<ion-spinner icon="lines"/></p',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    // Set a timeout to clear loader, 
    // however you would actually call the $ionicLoading.hide(); 
    // method whenever everything is ready or loaded.
    $timeout(function() {
        $ionicLoading.hide();
        $scope.stooges = [{
            name: 'Moe'
        }, {
            name: 'Larry'
        }, {
            name: 'Curly'
        }];
    }, 0);


    // util dialog
    // A confirm dialog
    $scope.showConfirm = function(data, callback) {
        var data = data || {
            title: "ご確認してください！",
            message: "進めますか？"
        }

        var confirmPopup = $ionicPopup.confirm({
            title: data.title,
            template: data.message
        });

        confirmPopup.then(function(res) {
            if (res) {
                console.log('You are sure');
            } else {
                console.log('You are not sure');
            }
            if (callback) callback(res);
        });
    };

    // An alert dialog
    $scope.showAlert = function(data, callback) {
        var data = data || {
            title: "注意！",
            message: "------"
        }

        var alertPopup = $ionicPopup.alert({
            title: data.title,
            template: data.message
        });
        alertPopup.then(function(res) {
            console.log('Thank you for not eating my delicious ice cream cone');
            if (callback) callback(res);
        });
    };

    // show processing loading
    $scope.showProcessingLoading = function(message) {
        message = message || '少々お待ちください！';
        var template = '<p>' + message + '</p>';
        $ionicLoading.show({
            template: template,
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });   
    }

    $scope.hideProcessingLoading = function() {
        $ionicLoading.hide();
    }

})

.controller('StartupCtrl', ['$scope', function($scope) {}])

.controller('ProductListCtrl', function($scope, Products) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.products = Products.all();
})

.controller('ProductDetailCtrl', function($scope, $stateParams, Products) {
    $scope.product = Products.get($stateParams.productId);
})

.controller('AppContentCtrl', function($scope, $ionicTabsDelegate, $ionicModal, $ionicSlideBoxDelegate) {

    /** register scope function  */
    $scope.showStickers = function() {
        $scope.showModal('templates/sticker-categories-popover.html');
    }

    $scope.showModal = function(templateUrl) {

        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }

    $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove()
    };

    /** register scope variable */
    $scope.actionName = '';
    $scope.activeTabIndex = 0;
    $scope.prevActiveTabIndex = -1;
    $scope.contentViews = [{
        id: 0,
        url: "templates/template1.html",
        name: "main-app-view",
    }];

    var actionNames = ['takePicture', 'filter', 'frame', 'sticker'];

    var tabContentViews = [{
        id: 0,
        name: "take photo",
        view: 0,
        actionIds: [0, 1]
    }, {
        id: 1,
        name: "fames",
        view: 0,
        actionIds: [2]
    }, {
        id: 2,
        name: "stickers",
        view: 0,
        action: $scope.showStickers,
        actionIds: [3]
    }, {
        id: 3,
        name: "text",
        view: 0,
        actionIds: []
    }, {
        id: 4,
        name: "review",
        view: 0,
        actionIds: []
    }]

    var setDefaultActionForTab = function() {
        var activeTabIndex = $scope.activeTabIndex;
        var tab = tabContentViews[activeTabIndex];

        if (tab.actionIds.length > 0) {
            $scope.actionName = actionNames[tab.actionIds[0]]; 
        }
    }

    var isValidActionName = function(actionName) {
        var activeTabIndex = $scope.activeTabIndex;
        var tab = tabContentViews[activeTabIndex];  
        var index = actionNames.indexOf(actionName);
       

        if (index == -1) return false;

        return tab.actionIds.indexOf(index) >= 0;
    }

    $scope.changeToAction = function(newAction) {
        if (!isValidActionName(newAction)){
            console.log("warning.. action: " + newAction + " is Invalid!!!!");
            return;
        }

        setTimeout(function(){
            $scope.$apply(function(){
                $scope.actionName = newAction;
            });
        })
        console.log("action is changed to : " + newAction);
    }

    $scope.shouldShowAction = function(actionName){
        
        if ($scope.actionName == '') {
            setDefaultActionForTab();
        }
        return $scope.actionName == actionName;
    }

    $scope.showContentViewFor = function(tabIndex) {
        var viewId = tabContentViews[tabIndex].view
        $ionicSlideBoxDelegate.slide(viewId);
    }

    $scope.slideHasChanged = function(index) {
        var view = $scope.contentViews[index];
        console.log("content view changed to: " + view.name);

    }

    $scope.selectTabWithIndex = function(index) {
        // handler if tab current tab
        if ($scope.activeTabIndex != index) {
            var tab = tabContentViews[index];
            console.log("tab changed to: " + tab.name);
            $scope.preActiveTabIndex = $scope.activeTabIndex;
            $scope.activeTabIndex = index;
            setDefaultActionForTab();
            $ionicTabsDelegate.select(index);
            $scope.showContentViewFor(index);

            if (tab.action) {
                tab.action();
            }
        }
    }
})

.controller('StickerActionCtrl', function($scope) {

    $scope.stickerCategories = [];
    var stickerCategoriesNames = [
        'コメント', 'マーク1', 'マーク2',
        '仮装', '数字'
    ];

    for (var i = 0; i < 5; i++) {
        var category = {
            id: i,
            name: stickerCategoriesNames[i],
            src: 'img/assets/stickers/categories/' + (i + 1) + '.png',
            stickers: []
        };

        for (var j = 0; j < 10; j++) {
            category.stickers.push({
                id: j,
                name: 'sticker-' + (i + 1) + '-' + (j + 1),
                src: 'img/assets/stickers/thumbnails/' + (i + 1) + '/' + (j + 1) + '.png'
            });
        }

        $scope.stickerCategories.push(category);
    }

    $scope.activeStickerCategoryIndex = 0;
    $scope.category = $scope.stickerCategories[0];
    $scope.stickers = $scope.category.stickers;

    $scope.selectCategory = function(index) {
        $scope.activeStickerCategoryIndex = index;
        $scope.category = $scope.stickerCategories[index];
        $scope.stickers = $scope.category.stickers;

        $scope.stickers.forEach(function(e) {
            //console.log("add -> " + e.name);
        });
    }

    $scope.addSticker = function(index) {
        console.log("addSticker: " + $scope.stickers[index].name);
    }

    $scope.getStickers = function() {
        $scope.stickers.forEach(function(e) {
            // console.log(e.name);
        });
        return $scope.stickers;
    }
})

.controller('FrameActionCtrl', function($scope) {

    $scope.activeFrameIndex = -1;
    $scope.frames = [];
    for (var i = 0; i < 5; i++) {
        $scope.frames.push({
            id: i,
            name: 'frame-' + (i + 1),
            src: 'img/assets/frames/thumbnails/' + (i + 1) + '.png'
        });
    }

    $scope.applyFrame = function(index) {
        $scope.activeFrameIndex = index;
    }
})

.controller('FilterActionCtrl', function($scope) {
    $scope.filterProcessing = false;
    Caman.Event.listen("processStart", function(job) {
        if (!$scope.filterProcessing ) {
             $scope.filterProcessing  = true;
             $scope.showProcessingLoading('filtering');
        }
    });

    Caman.Event.listen("processComplete", function(job) {
        
    });

    Caman.Event.listen("renderFinished", function(job){
        $scope.filterProcessing  = false;
        $scope.hideProcessingLoading();
    });

    $scope.availableFilterNames = ["vintage",
        "lomo", "clarity", "sinCity",
        "sunrise", "crossProcess", "orangePeel",
        "love", "grungy", "jarques", "pinhole",
        "oldBoot", "glowingSun", "hazyDays",
        "herMajesty", "nostalgia",
        "hemingway", "concentrate"
    ]

    $scope.activeFilterIndex = -1;
    filterDisplayNames = ['lo_fi', 'mayfair', 'valencia', 'walden', 'xpro'];
    filterNames = ['vintage', 'lomo', 'sinCity', 'love', 'sunrise', 'clarity']
    $scope.filters = [];

    for (var i = 0; i < filterDisplayNames.length; i++) {
        $scope.filters.push({
            id: i,
            name: filterDisplayNames[i],
            filter: filterNames[i],
            src: 'img/assets/filters/' + (i + 1) + '.png'
        });
    }

    $scope.applyFilter = function(index) {
        var imageCanvas = $("#take-picture-canvas")[0];
        var metadata_id = $(imageCanvas).attr('data-caman-id'); 

        // ignore filter 
        if (metadata_id && $scope.activeFilterIndex == index) {
            $scope.activeFilterIndex = -1;
            Caman(imageCanvas, function(){
                this.revert();
            });
           return;
        }

        $scope.activeFilterIndex = index;
        
        var effect = filterNames[index];
        

        Caman("#take-picture-canvas", function() {
            // If such an effect exists, use it:
            //this.reloadCanvasData();
            if (effect in this) {
                this.revert();
                this[effect]();
                this.render();
            }
        });
    }
})


.controller('TakePictureActionCtrl', function($scope, SharedService) {

    $scope.takePicture = function() {
        SharedService.prepForBroadcast("startWebcam");
    }

    $scope.$on('handleBroadcast', function() {
        $scope.message = SharedService.message;
    });

    $scope.uploadPicture = function() {
        SharedService.prepForBroadcast("startUpload");
    }

    $scope.poolPicture = function() {
        SharedService.prepForBroadcast("startUpload");
    }

})

.controller('DrawAppCtrl', function($scope, $itemId) {
    // don't be scared by the image value, its just datauri

    var canvas = new fabric.Canvas('c');

    canvas.add(new fabric.IText('Tap and Type', {
        fontFamily: 'arial black',
        left: 100,
        top: 100,
    }));

    fabric.Image.fromURL('img/ionic.png', function(img) {

        canvas.add(img).setActiveObject(img);
    });

})

.controller('ExCtrl', ['$scope', function($scope) {}]);