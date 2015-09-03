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

    (function() {
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

        $scope.addTabselectedHandler = function(tabId, handler) {
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

        $scope.isSelectingPicture = function() {
            //return $scope.activeTabIndex == 0;
            return $scope.isWaitForTake;
        }
        $scope.isCanvasInEdit = function() {
            return $scope.isPhotoTaken;

            return true;
            var inEditing = $scope.activeTabIndex != 0 && !$scope.inReview;
            console.log("in editing: " + inEditing);
            return inEditing;
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

                if (newTab.action) {
                    newTab.action();
                }
                newTab.onSelectedHanlders.forEach(function(f) {
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
        $scope.calculateFrameSize = calculateFrameSize;
    }());

    /* @region - camera */
    (function() {
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


                var size = $scope.calculateFrameSize(picture);
                $(picture).width(size.width);
                $(picture).height(size.height);
                w = size.width;
                h = size.height;
                picture.width = w;
                picture.height = h;
                console.log("init webcam with: " + picture.width + " - " + picture.height);

                angular.element($window).bind('resize', function() {
                    $scope.$apply(function() {
                        size = $scope.calculateFrameSize(picture);
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
                $scope.updateUploadedImageToWidget();
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
                    $scope.updateTakenImageToWidget();
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

            // call init()
            initWebcam();
            clearWebcam();
            registerVideoEvents();
        }
        $scope.initPictureHandler = initPictureHandler;
    }());
    /* @endregion - camera */

    /* @region - filter */
    (function() {
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
                    this.render(function(){
                        var picture = $("#take-picture-canvas")[0];
                        var dataURL = picture.toDataURL();
                        $scope.painter.addImage(dataURL);
                    });
                }
            });
        }

        $scope.updateUploadedImageToWidget = function(){
            var picture = $("#take-picture-canvas")[0];
            var dataURL = picture.toDataURL();
            $scope.painter.addImage(dataURL);
        }

        $scope.updateTakenImageToWidget = function(){
            var picture = $("#take-picture-canvas")[0];
            var dataURL = picture.toDataURL();
            $scope.painter.addImage(dataURL);
        }

        $scope.decidedPhoto = function() {
            $scope.selectTabWithIndex(1);
        }
    }());
    /* @endregion - filter */

    (function() {
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
    }());
    /* @endregion frame */

    /* @region stickers */
    (function() {
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
        }

        $scope.addSticker = function(index) {
            var sticker = $scope.stickers[index];
            $scope.painter.addSticker(sticker);
        }

        $scope.getStickers = function() {
            return $scope.stickers;
        }
    }());
    /* @endregion stickers */

    /* @region text setting */
    (function() {
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
            },
            changeTo: function(size) {
                this.value = size;
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
            },
            changeTo: function(val) {
                this.value = (val * 100).toFixed;
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
            },
            find: function(fontName) {
                for (var i = 0; i < this.fonts.length; i++) {
                    font = this.fonts[i];
                    family = font.family;
                    if (family.indexOf(fontName) != -1 ||
                        fontName.indexOf(family) != -1)
                        return font;

                }
                return this.value;
            },
            changeTo: function(fontName) {
                var newValue = this.find(fontName);
                this.value = newValue;
            }
        }
        $scope.fontFamily.fonts =
            [{

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
            }, {
                id: 6,
                lang: 'en',
                displayName: 'Playtime With Hot Toddies',
                family: 'Playtime With Hot Toddies',
            }, {
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
            }]
        $scope.fontFamily.value = $scope.fontFamily.fonts[1];
        $scope.selectFontFamily = function(font) {
            console.log("change to : " + font.displayName);
            $scope.fontFamily.value = font;
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
            select: function(color) {
                $scope.textColor.value = this.colors.indexOf(color);
            },
            activeClassFor: function(color) {
                if (this.colors.indexOf(color) == this.value) {
                    return 'active';
                } else {
                    return 'in-active';
                }
            },
            find: function(code) {
                for (var i = 0; i > this.colors.length; i++) {
                    var color = this.colors[i];
                    if (code == color.code)
                        return color;
                }
                return this.color();
            },
            findIndex: function(code) {
                for (var i = 0; i > this.colors.length; i++) {
                    var color = this.colors[i];
                    if (code == color.code)
                        return i;
                }
                return this.value;
            },
            changeTo: function(code) {
                var newIndex = this.findIndex(code);
                this.value = newIndex;
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
                    $scope.applyTextSetting();
                }, 1500);
            })
        }
        _.each(fontDataList, function(data){ fontDataWatch(data)});

        $scope.fontSetting = {
            lastChangeMessage: '',
            changed: false,
            isTyping: true
        }

        $scope.showTextSetting = function(text) {

            $scope.text = text;
            $scope.$apply(function() {
                $scope.fontSetting.isTyping = false;
                $scope.fontFamily.changeTo(text.fontFamily);
                $scope.textColor.changeTo(text.stroke);
                $scope.fontSize.changeTo(text.fontSize);
            });
        }

        $scope.hideTextSetting = function() {
            $scope.$apply(function() {
                $scope.fontSetting.isTyping = true;
            });
        }

        $scope.applyTextSetting = function() {
            if (!$scope.text) return;
            $scope.text.fontFamily = $scope.fontFamily.value.family;
            $scope.text.fontSize = $scope.fontSize.value;
            $scope.text.stroke = $scope.textColor.colorCode();
            $scope.canvas.renderAll();
        }


        $scope.doneSettingText = function() {
            $scope.hideTextSetting();
        }

        $scope.addNewText = function() {
            $scope.painter.addNewText();
        }
    }());
    /* @endregion text setting */


    /* @region preview tab */
    (function() {

        var previewTabId = 4;
        var previewFunc = function() {
            $scope.inReview = true;
            var _canvas = new fabric.Canvas('preview-content', {
                backgroundColor: 'green'
            });

            var jsonData = JSON.stringify($scope.canvas.toDatalessJSON());

        }
        $scope.addTabselectedHandler(previewTabId, previewFunc);
    }());
    /* @endregion preview */

    $scope.painter = {
        setupFrameSize: function() {
            var frame = $("#frame-wrapper")[0];
            var size = $scope.calculateFrameSize(frame);

            $(frame).width(size.width);
            $(frame).height(size.height);

            $scope.canvas.setDimensions({
                width: size.width,
                height: size.height
            });

            this.width = size.width;
            this.height = size.height;
            console.log("painter setup frame size: " + this.width + " x " + this.height);
        },
        initDrawing: function() {

            fabric.Object.prototype.transparentCorners = false;
            var canvas = $scope.canvas = this.__canvas = new fabric.Canvas('canvas-content');
            canvas.backgroundColor = "#333"
            canvas.selectionColor = 'rgba(0,255,0,0.3)';
            canvas.selectionBorderColor = 'red';
            canvas.selectionLineWidth = 5;

            canvas.renderAll();
            var animate = this.animate;
            this.setupFrameSize();
            angular.element($window).bind('resize', this.setupFrameSize);

            console.log("painter initDrawing done");
            this.setupEvents();
        },
        setupEvents: function() {
            var texts = this.texts;
            $scope.canvas.on('object:selected', function(e) {
                if (texts.indexOf(e.target) != -1) {
                    $scope.showTextSetting(e.target);
                }
            });

            $scope.canvas.on('selection:cleared', function(e) {
                $scope.hideTextSetting();
            });

        },
        createWiddeCanvas: function() {

        },

        loadBackgroundImage: function() {
            var backgroundUrl = $scope.product.template;
            $scope.canvas.setBackgroundImage(backgroundUrl, $scope.canvas.renderAll.bind($scope.canvas), {
                opacity: 1,
                angle: 0,
                left: 0,
                top: 0,
                originX: 'left',
                originY: 'top'
            });
        },
        createFixedGroup: function() {

        },
        setPositionForFixedGroup: function() {

        },

        newPosition: function() {
            var haft_w = this.width;
            var haft_h = this.height;
            var pos_x = (Math.random() * 240).toFixed() % haft_w;
            var pos_y = (Math.random() * 240).toFixed() % haft_h;
            return {
                x: pos_y,
                y: pos_y
            }
        },

        images: [],
        widgets: [],
        texts: [],

        addToGroup: function() {
            var widgets = this.widgets;
            var group = new fabric.Group(widgets, {
                left: 0,
                top: 0,
                angle: 0
            });
            $scope.canvas.add(group);
            $scope.canvas.renderAll();
        },

        addNewText: function() {
            var text = new fabric.IText('text');
            var newPosition = this.newPosition();

            this.texts.push(text.set({
                left: newPosition.x,
                top: newPosition.y,
            }));

            $scope.canvas.add(text);
            $scope.canvas.renderAll();
        },

        addSticker: function(sticker) {

            newPosition = this.newPosition();
            fabric.Image.fromURL(sticker.src, function(image) {
                $scope.canvas.add(image.set({
                    left: newPosition.x,
                    top: newPosition.y,
                    transparentCorners: true,
                    cornerSize: 10,
                    selectionColor: 'rgba(0,255,0,0.3)',
                    selectionBorderColor: 'red',
                    selectionLineWidth: 5
                }));
            })
            $scope.canvas.renderAll();
        },

        addImage: function(src){
            var isOnlyOne = true;
            if (isOnlyOne) {
                _.each(this.images, function(image){ 
                   $scope.canvas.remove(image);
                })
     
                var images = [];
                fabric.Image.fromURL(src, function(image){
                    $scope.canvas.add(image);
                    $scope.canvas.renderAll();
                    images.push(image);
                })
                this.images = images;
            }
        }
    }

    ionic.Platform.ready(function() {
        $scope.painter.initDrawing();
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



/*
Try this

$('#remove').click(function(){
    var object = canvas.getActiveObject();
    if (!object){
        alert('Please select the element to remove');
        return '';
    }
    canvas.remove(object);
});*/