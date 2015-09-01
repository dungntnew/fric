angular.module('app.controllers', ['app.services', 'app.directives'])


.controller('AppCtrl', function($scope, $window, $timeout, $ionicLoading, $ionicPopup) {

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
    console.log("[app config] ratio: " + $scope.config.widthToHeight);
    console.log("[app config] Max Height: " + $scope.config.maxHeight + " px");

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

.controller('EditImageAppCtrl', function($scope, $window,
    $ionicTabsDelegate, $ionicModal, $timeout,
    $ionicSlideBoxDelegate, $ionicLoading, $ionicPopup) {

    /** register scope function  */
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

    $scope.showStickers = function() {
        $scope.showModal('templates/sticker-categories-popover.html');
    }

    /** register scope variable */
    $scope.actionName = '';
    $scope.activeTabIndex = 0;
    $scope.prevActiveTabIndex = -1;
    $scope.contentViews = [{
        id: 0,
        url: "templates/template1.html",
        name: "main-app-view",
    }];

    var actionNames = ['takePicture',
        'filter', 'frame',
        'sticker', 'text-setting'
    ];

    var tabContentViews = [{
        id: 0,
        name: "take photo",
        view: 0,
        actionIds: [0, 1],
        multipleTab: false,
        onSelectedHanlders: [],
        actionBarClass: "action-bar"
    }, {
        id: 1,
        name: "fames",
        view: 0,
        actionIds: [2],
        multipleTab: false,
        onSelectedHanlders: [],
        actionBarClass: "action-bar"
    }, {
        id: 2,
        name: "stickers",
        view: 0,
        actionIds: [3],
        multipleTab: false,
        onSelectedHanlders: [],
        actionBarClass: "action-bar"
    }, {
        id: 3,
        name: "text",
        view: 0,
        actionIds: [4],
        multipleTab: false,
        onSelectedHanlders: [],
        actionBarClass: "text-action-bar"
    }, {
        id: 4,
        name: "review",
        view: 0,
        actionIds: [],
        multipleTab: false,
        onSelectedHanlders: [],
        actionBarClass: "action-bar"
    }]

    $scope.actionBarClassName = "action-bar";
    var setDefaultActionForTab = function() {
        var activeTabIndex = $scope.activeTabIndex;
        var tab = tabContentViews[activeTabIndex];


        if (tab.actionIds.length > 0) {
            $scope.actionName = actionNames[tab.actionIds[0]];
            console.log("[current] action name -> " + $scope.actionName);
        }
    }

    var isValidActionName = function(actionName) {
        var activeTabIndex = $scope.activeTabIndex;
        var tab = tabContentViews[activeTabIndex];
        var index = actionNames.indexOf(actionName);


        if (index == -1) return false;

        return tab.actionIds.indexOf(index) >= 0;
    }

    this.addTabselectedHandler = function(tabId, handler) {
        $scope.tabData[tabId].onSelectedHanlders.push(handler);
    };

    $scope.changeToAction = function(newAction) {
        if (!isValidActionName(newAction)) {
            console.log("warning.. action: " + newAction + " is Invalid!!!!");
            return;
        }

        setTimeout(function() {
            $scope.$apply(function() {
                $scope.actionName = newAction;
            });
        })
    }

    this.shouldShowAction = function(actionName) {

        if ($scope.actionName == '') {
            setDefaultActionForTab();
        }
        return $scope.actionName == actionName;
    }
    $scope.shouldShowAction = this.shouldShowAction;


    $scope.showContentViewFor = function(tabIndex) {
        var viewId = tabContentViews[tabIndex].view
        $ionicSlideBoxDelegate.slide(viewId);
    }

    $scope.slideHasChanged = function(index) {
        var view = $scope.contentViews[index];
        console.log("content view changed to: " + view.name);
    }

    $scope.tabData = tabContentViews;

    $scope.frameWidth = 0;
    $scope.frameHeight = 0;
    $scope.selectTabWithIndex = function(index) {
        // handler if tab current tab
        var tab = tabContentViews[$scope.activeTabIndex];
        if ($scope.activeTabIndex != index || tab.multipleTab) {

            $scope.preActiveTabIndex = $scope.activeTabIndex;
            $scope.activeTabIndex = index;
            setDefaultActionForTab();
            $ionicTabsDelegate.select(index);
            $scope.showContentViewFor(index);

            var newTab = tabContentViews[$scope.activeTabIndex];
            $scope.actionBarClassName = newTab.actionBarClass;

            console.log($scope.actionBarClassName);

            if (tab.action) {
                tab.action();
            }
            tab.onSelectedHanlders.forEach(function(f) {
                if (f) f();
            });
        }
    }

    var calculateFrameSize = function(frame) {
        console.log("config in child: " + $scope.config);
        var config = $scope.config || {
            widthToHeight: 1,
            maxHeight: 425
        };

        var widthToHeight = config.widthToHeight;
        var maxHeight = config.maxHeight;

        var canvasRatio = $(frame).height() / $(frame).width();
        var newWidth = $window.innerWidth;
        var newHeight = $window.innerHeight;
        var newWidthToHeight = newWidth / newHeight;

        newHeight = newWidth / widthToHeight;
        if (newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = newHeight * widthToHeight;
        }

        console.log("frame size: " + newWidth + " x " + newHeight);
        size = {
            width: newWidth,
            height: newHeight
        }
        console.log(size.width + " = = " + size.height);
        return {
            width: newWidth,
            height: newHeight
        }
    };

    /* @region - camera */
    var initPictureHandler = function() {

        $scope.isWebcamReady = false;
        $scope.isPhotoTaken = false;
        $scope.isWaitForTake = false;
        $scope.isLastTaken = true; // Other is uploadPhoto

        var video, picture, input, ctx,
            isStreaming = false,
            snapshoot = false,
            webcamInterval = null,
            w, h;

        var isWebcamInitizalied = false;

        var validateWebcamInit = function() {
            if (!isWebcamInitizalied) {
                console.log("Please initWebcam before continue!..");
                return false;
            }
            return true;
        }

        var initWebcam = function() {

            // init canvas element - wait for document ready
            video = $('#take-picture-video')[0];
                picture = $('#take-picture-canvas')[0];
                input = $('#take-picture-input')[0];

            if (!video || !picture || !input) {
                return;
            }    
            ctx = picture.getContext('2d');


            var size = calculateFrameSize(picture);
            $(picture).width(size.width);
            $(picture).height(size.height);
            w = size.width;
            h = size.height;
            picture.width = w;
            picture.height = h;
            console.log("init webcam with: " + picture.width + " - " + picture.height);

            angular.element($window).bind('resize', function() {
                $scope.$apply(function() {
                    size = calculateFrameSize(picture);
                    $(picture).width(size.width);
                    $(picture).height(size.height);
                })
            });



            // init done
            isWebcamInitizalied = true;
        }


        var startRecord = function() {
            if (!validateWebcamInit())
                return;

            // Every 33 milliseconds copy the video image to the canvas
            webcamInterval = setInterval(function() {
                if (video.paused || video.ended) return;
                w = picture.width;
                h = picture.height;
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(video, 0, 0, w, h);
                if (snapshoot) takePhoto();
            }, 33);
        }

        var clearWebcam = function() {
            if (!validateWebcamInit())
                return;

            video.src = "";

            stopRecord();
            w = picture.width;
            h = picture.height;
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(video, 0, 0, w, h);
        }

        var stopRecord = function() {
            if (!validateWebcamInit())
                return;

            if (webcamInterval) {
                clearInterval(webcamInterval);
            }
        }

        // Cross browser
        var startWebcam = function() {
            if (!validateWebcamInit())
                return;

            if (navigator.getUserMedia) {
                // Request access to video only
                navigator.getUserMedia({
                        video: true,
                        audio: false
                    },
                    function(stream) {
                        // Cross browser checks
                        var url = window.URL || window.webkitURL;
                        video.src = url ? url.createObjectURL(stream) : stream;
                        // Set the video to play
                        video.play();
                    },
                    function(error) {
                        alert('Something went wrong. (error code ' + error.code + ')');
                        return;
                    }
                );
            } else {
                $scope.showAlert({
                    title: "警報！",
                    message: "カメラが 起動できません!"
                });
                return;
            }
        };

        var uploadPictureFinish = function() {
            if (!validateWebcamInit())
                return;

            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.isPhotoTaken = true;
                });
            })
            $(picture).removeAttr("data-caman-id");
            $scope.changeToAction("filter");
            $scope.hideProcessingLoading();
        }

        var loadDataURLToImage = function(dataURL, method, callback) {
            console.log("go to loadDataURLToImage");
            var image = new Image();
            w = picture.width;
            h = picture.height;
            console.log("pic w: " + w + " h: " + h);

            image.onload = function() {
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(image, 0, 0, w, h);
                if (callback) callback();
                uploadPictureFinish();

            }
            image.onerror = function() {
                $scope.showAlert({
                    title: "警報！",
                    message: (method + "が 起動できません!")
                });
                if (callback) callback();
            };
            image.src = dataURL;
        }



        var processUploadedFile = function(file) {

            if (!validateWebcamInit())
                return;

            try {

                var imgURL = window.URL.createObjectURL(file);
                loadDataURLToImage(imgURL, 'window.URL.createObjectURL', function(e) {
                    URL.revokeObjectURL(imgURL);
                });

            } catch (e) {
                try {
                    // Fallback if createObjectURL is not supported
                    var fileReader = new FileReader();
                    fileReader.onload = function(event) {
                        var imgURL = event.target.result;
                        loadDataURLToImage(imgURL, 'FileReader');
                    };
                    fileReader.readAsDataURL(file);
                } catch (e) {

                    $scope.showAlert({
                        title: "警報！",
                        message: "createObjectURL | FileReaderが 起動できません!"
                    });
                }
            }
        }
        var onFileSelect = function(e) {
            if (!validateWebcamInit())
                return;

            var file = e.target.files[0];
            if (!file || !/^image\//i.test(file.type)) {
                $scope.showAlert({
                    title: "警報！",
                    message: "Uploaded invalid file(empty or not a image)"
                });
                return;
            }
            processUploadedFile(file);
            $scope.showProcessingLoading();
        };



        var startUpload = function() {
            if (!validateWebcamInit())
                return;

            clearWebcam();
            stopRecord();
            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.isLastTaken = false;
                    $scope.isWaitForTake = false;
                    $scope.isPhotoTaken = false;
                })
            })

            if (window.File && window.FileReader && window.FormData) {
                if (window.addEventListener) {
                    input.addEventListener('change', onFileSelect, false);
                } else if (window.attachEvent) {
                    input.attachEvent("onchange", onFileSelect);
                }
            } else {
                $scope.showAlert({
                    title: "警報！",
                    message: "Your browser not support file upload!"
                });
            }
        }

        var registerVideoEvents = function() {
                        if (!validateWebcamInit())
                return;

            // Wait until the video stream can play
            video.addEventListener('canplay', function(e) {
                if (!validateWebcamInit())
                    return;

                if (!isStreaming) {
                    // calculateFrameSize();

                    // videoWidth isn't always set correctly in all browsers
                    // if (v.videoWidth > 0) {

                    //      h = v.videoHeight / (v.videoWidth / w);
                    // }
                    w = picture.width;
                    h = picture.height;

                    picture.setAttribute('width', w);
                    picture.setAttribute('height', h);
                    // Reverse the canvas image
                    ctx.translate(w, 0);
                    ctx.scale(-1, 1);
                    isStreaming = true;
                }
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.isWebcamReady = true;
                        $scope.isWaitForTake = true;
                        $scope.isPhotoTaken = false;
                        $scope.isLastTaken = true;
                    })
                })
            }, false);


            // Wait for the video to start to play
            video.addEventListener('play', function() {
                if (!validateWebcamInit())
                    return;
                startRecord();
            }, false);
        }


        var takePhoto = function() {

            console.log("do take...");
            if (!validateWebcamInit())
                return;

            var dataURL = picture.toDataURL();
            // r.src = dataURL;
            stopRecord();
            snapshoot = false;
            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.isWaitForTake = false;
                    $scope.isLastTaken = true;
                    $scope.isPhotoTaken = true;
                });
                $(picture).removeAttr("data-caman-id");
                $scope.changeToAction("filter");
            })
        }

        $scope.clearWebcam = clearWebcam;
        $scope.onFileSelect = onFileSelect;
        $scope.startUpload = startUpload;
        $scope.startWebcam = startWebcam;
        $scope.takePhoto = takePhoto;
        $scope.retakePhoto = function() {
            if (!validateWebcamInit())
                return;
            setTimeout(function() {

                if ($scope.isLastTaken) {
                    startRecord();
                }

                $scope.$apply(function() {
                    $scope.isWaitForTake = $scope.isLastTaken;
                    $scope.isPhotoTaken = false;
                });
                $scope.changeToAction("takePicture");
            })
        }

        $scope.decidedPhoto = function() {
            console.log("go to edit... ....");

        }

        // call init()
        initWebcam();
        clearWebcam();
        registerVideoEvents();
    }

    $scope.initPictureHandler = initPictureHandler;
    /* @endregion - camera */

    /* @region - filter */
    $scope.filterProcessing = false;
    Caman.Event.listen("processStart", function(job) {
        if (!$scope.filterProcessing) {
            $scope.filterProcessing = true;
            $scope.showProcessingLoading('処理中');
        }
    });

    Caman.Event.listen("processComplete", function(job) {

    });

    Caman.Event.listen("renderFinished", function(job) {
        $scope.filterProcessing = false;
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
            Caman(imageCanvas, function() {
                this.revert();
            });
            return;
        }

        $scope.activeFilterIndex = index;

        var effect = filterNames[index];


        Caman("#take-picture-canvas", function() {
            if (effect in this) {
                this.revert();
                this[effect]();
                this.render();
            }
        });
    }

    /* @endregion - filter */

    /* @region frame */
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
        /* @endregion frame */

    /* @region stickers */
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
        /* @endregion stickers */
        // will execute when device is ready, or immediately if the device is already ready.



    /* @region text setting */
    $scope.fontSize = {
        name: '大きさ',
        display: function() {
            return this.name + ' ' + this.value + ' pt';
        },
        watch: 'fontSize.value',
        timeoutId: null,
        min: 25,
        max: 75,
        step: 5,
        value: 35,
        valueText: function() {
            return this.value + 'pt';
        }
    }
    $scope.fontOpacity = {
        name: 'オパシティ',
        display: function() {
            return this.name + ' ' + this.valueText();
        },
        watch: 'fontOpacity.value',
        timeoutId: null,
        min: 0,
        max: 100,
        step: 10,
        value: 100,
        valueText: function() {
            return this.value + ' %';
        },
        valueFloat: function() {
            return this.value / 100;
        }
    }
    $scope.fontFamily = {
        name: 'フォント',
        fonts: [],
        value: null,
        timeoutId: null,
        watch: 'fontFamily.value.displayName',
        display: function() {
            return this.name + ' ' + this.value.displayName;
        },
        select: function(font) {
            this.value = font;
        }
    }
    $scope.fontFamily.fonts = [{

            id: 0,
            lang: 'jp',
            displayName: 'やさしさゴシック',
            family: '07YasashisaGothic',

        }, {
            id: 1,
            lang: 'jp',
            displayName: 'はななり明朝',
            family: 'HannariMincho',
        }, {
            id: 2,
            lang: 'en',
            displayName: 'Desyrel',
            family: 'Desyrel',
        }, {
            id: 3,
            lang: 'en',
            displayName: 'GoudyBookletter1911',
            family: 'GoudyBookletter1911',
        }, {
            id: 4,
            lang: 'en',

            displayName: 'Italianno',
            family: 'Italianno',
        }, {
            id: 5,
            lang: 'en',
            displayName: 'Oswald',
            family: 'Oswald Regular',
        },

        {
            id: 6,
            lang: 'en',
            displayName: 'Playtime With Hot Toddies',
            family: 'Playtime With Hot Toddies',
        },

        {
            id: 7,
            lang: 'en',
            displayName: 'Print Clearly',
            family: 'Print Clearly',
        }, {
            id: 8,
            lang: 'en',
            displayName: 'Qikki Reg',
            family: 'Qikki Reg',
        }, {
            id: 9,
            lang: 'en',
            displayName: 'Spin Cycle OT',
            family: 'Spin Cycle OT',
        }

    ]
    $scope.fontFamily.value = $scope.fontFamily.fonts[1];
    $scope.selectFontFamily = function(font) {
        console.log("change to : " + font.displayName);
        $scope.fontFamily.value = font;
    }



    $scope.fontSetting = {
        lastChangeMessage: '',
        changed: false
    }

    $scope.doneSettingText = function() {
        console.log("setting text ok");
    }


    $scope.textColor = {
        name: 'カラー',
        display: function() {
            return this.name + ' ' + this.colorName();
        },
        color: function() {
            return this.colors[this.value];
        },
        colorCode: function() {
            return this.color().code
        },
        colorName: function() {
            return this.color().name
        },
        styleColumn: function() {
            return 'col-' + Math.round(100 / this.colors.length);
        },
        select: function(color){
            $scope.textColor.value = this.colors.indexOf(color);
        },
        activeClassFor: function(color){
            if (this.colors.indexOf(color) == this.value){
                return 'active';
            }else {
                return 'in-active';
            }
        },

        colors: [],
        watch: 'textColor.value',
        timeoutId: null,
        min: 0,
        max: 10,
        step: 1,
        value: 2

    };

    $scope.textColor.colors = [{
            name: "ホワイト",
            code: "#fff"
        }, {
            name: "レッド",
            code: "#f00"
        }, {
            name: "ピンク",
            code: "#FF69B4"
        }, {
            name: "パープル",
            code: "#800080"
        }, {
            name: "ブルー",
            code: "#F0F8FF"
        }, {
            name: "ライトブルー",
            code: "#ADD8E6"
        }, {
            name: "グリーン",
            code: "#008000"
        }, {
            name: "イエロー",
            code: "#FFFF00"
        }, {
            name: "オレンジ",
            code: "#FFA500"
        }, {
            name: "ブラウン",
            code: "#A52A2A"
        },

        {
            name: "ブラック",
            code: "#000000"
        },
    ];
    $scope.textColor.max = $scope.textColor.colors.length - 1;

    var fontDataList = [$scope.fontSize, $scope.fontOpacity, $scope.fontFamily, $scope.textColor];

    var fontDataWatch = function(data) {
        $scope.$watch(data.watch, function() {

            var message = data.display();
            $scope.fontSetting.lastChangeMessage = message;
            $scope.fontSetting.changed = true;
            if (data.timeoutId !== null) {
                return;
            }

            timeoutId = $timeout(function() {
                $scope.fontSetting.changed = false;
                $timeout.cancel(data.timeoutId);
                data.timeoutId = null;

                // Now load data from server 
            }, 1500);
        })
    }

    fontDataList.forEach(function(data) {
        fontDataWatch(data);
    });
    /* @endregion text setting */
    /*--- Draw handler -- */
    /* @region -- setup frame size */
    var frameWrapper = $("#frame-wrapper")[0];
    var frameSize = calculateFrameSize(frameWrapper);

    angular.element($window).bind('resize', function() {
        $scope.$apply(function() {
            frameSize = calculateFrameSize(frameWrapper);
            $(frameWrapper).width(frameSize.width);
            $(frameWrapper).height(frameSize.height);
        })
    });
    /* @endregion -- setup frame size */

    var initDrawing = function() {
            console.log("initDrawing executing..");
            /* @region -- setup canvasContainer */
            fabric.Object.prototype.transparentCorners = false;
            var cc = $("#canvas-content")[0];
            console.log("found canvas: " + (cc ? "true" : "false"));
            var canvas = this.__canvas = new fabric.Canvas('canvas-content', {
                backgroundColor: 'white',
            });
            canvas.setDimensions({
                width: $scope.frameWidth,
                height: $scope.frameHeight
            });
            //canvas.setOverlayColor('rgba(255, 73, 64, 0.6)', canvas.renderAll.bind(canvas));


            canvas.on({
                'object:moving': onChange,
                'object:scaling': onChange,
                'object:rotating': onChange,
            });

            function onChange(options) {
                options.target.setCoords();
                canvas.forEachObject(function(obj) {
                    if (obj === options.target) return;
                    obj.setOpacity(options.target.intersectsWithObject(obj) ? 0.5 : 1);
                });
            }
            var rect = new fabric.Rect({
                width: 100,
                height: 100,
                left: 350,
                top: 250,
                angle: -10,
                fill: 'rgba(0,200,0,0.5)'
            });


            canvas.add(rect);
            canvas.renderAll();

            $scope.canvas = canvas;

        }
        /* @endregion -- setup canvasContainer */

    ionic.Platform.ready(function() {
        initDrawing();
    });

    // init picture handler (camera & uploader)
    $scope.initPictureHandler();

    // link button event for camera-upload button
    angular.element('#pool-picture-btn').bind('click', function(e) {
        $scope.startUpload();
        angular.element('#take-picture-input').trigger('click');
    });
    angular.element('#upload-picture-btn').bind('click', function(e) {
        $scope.startUpload();
        angular.element('#take-picture-input').trigger('click');
    });
    angular.element('#start-camera-btn').bind('click', function(e) {
        $scope.startWebcam();
    });
})

// .directive('textSetting', function() {

//     var tabId = 3;
//     var ctrl = function($scope) {
//         $scope.showTextSettingPanel = function() {
//             $scope.isTyping = false;
//         }
//     }

//     var link = function(scope, element, attrs, appCtrl) {
//         console.log(appCtrl);
//         appCtrl.addTabselectedHandler(tabId, function() {
//             scope.isTyping = true;
//         });

//     }
//     return {
//         require: '^appContent',
//         restrict: 'E',
//         transclude: true,
//         scope: {},
//         templateUrl: 'templates/text-setting.html',
//         controller: ctrl,
//         link: link
//     }
// })

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


.controller('TextSettingCtrl', function($scope, $timeout) {
    // don't be scared by the image value, its just datauri

})