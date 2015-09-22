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
        return $scope.isMobileDevice;
    }

    // config rendering size
    $scope.config = $scope.config || {}
    $scope.config.widthToHeight = 320 / 240;
    $scope.config.contentHeight = 480; // height of content image ( should be 1/2 of printHeight)
    $scope.config.maxViewContentHeight = 320; // height of content when view in app(css only)

    $scope.config.printHeight = 960; // height of paper when print  
    $scope.config.maxPreviewHeight = 420; //print pager when view in app(css only)
    $scope.config.crossOrigin = ''; // other : 'Anonymous'
    $scope.config.multiplier = 1; // value multiplier using for export dataURL


    //console.log("[app config] widthToHeight: " + $scope.config.widthToHeight);
    //console.log("[app config] maxViewContentHeight: " + $scope.config.maxViewContentHeight + " px");
    //console.log("[app config] maxPreviewHeight: " + $scope.config.maxPreviewHeight + " px");
    //console.log("[app config] printHeight: " + $scope.config.printHeight + " px");
    //console.log("[app config] contentHeight: " + $scope.config.contentHeight + " px");

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
        data.title = '<img class="confirm-title" src="img/assets/btn/notice.png"/>';

        var alertPopup = $ionicPopup.show({
            title: data.title,
            template: data.message,
            buttons:[{
                text: '',
                type: 'button-confirm'
            }]
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
    $scope.products = Products.all();
})

.controller('ProductDetailCtrl', function($scope, $stateParams, Products) {
    $scope.product = Products.get($stateParams.productId);
})

.controller('EditImageAppCtrl', function($scope, $window,
    $ionicTabsDelegate, $ionicModal, $timeout,
    $ionicSlideBoxDelegate, $ionicLoading, $ionicPopup) {

    (function() {
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
            actionId: 0,
            multipleTab: false,
            onSelectedHanlders: [],
            onDesectedHandlers: [],
            actionBarClass: "action-bar",
            inActiveClass: 'tab-icon-camera',
            activeClass: 'tab-icon-camera-active'
        }, {
            id: 1,
            name: "fames",
            view: 0,
            actionId: 2,
            actionIds: [2],
            multipleTab: false,
            onSelectedHanlders: [],
            onDesectedHandlers: [],
            actionBarClass: "action-bar",
            inActiveClass: 'tab-icon-frame',
            activeClass: 'tab-icon-frame-active'
        }, {
            id: 2,
            name: "stickers",
            view: 0,
            actionId: 3,
            actionIds: [3],
            multipleTab: true,
            onSelectedHanlders: [],
            onDesectedHandlers: [],
            actionBarClass: "action-bar",
            inActiveClass: 'tab-icon-sticker',
            activeClass: 'tab-icon-sticker-active'
        }, {
            id: 3,
            name: "text",
            view: 0,
            actionId: 4,
            actionIds: [4],
            multipleTab: true,
            onSelectedHanlders: [],
            onDesectedHandlers: [],
            actionBarClass: "text-action-bar",
            inActiveClass: 'tab-icon-text',
            activeClass: 'tab-icon-text-active'
        }, {
            id: 4,
            name: "review",
            view: 0,
            actionId: null,
            actionIds: [],
            multipleTab: false,
            onSelectedHanlders: [],
            onDesectedHandlers: [],
            inActiveClass: 'tab-icon-review',
            activeClass: 'tab-icon-review-active',
            actionBarClass: "review-action-bar"
        }]

        $scope.actionBarClassName = "action-bar";
        var setDefaultActionForTab = function() {
            var activeTabIndex = $scope.activeTabIndex;
            var tab = tabContentViews[activeTabIndex];


            if (tab.actionIds.length > 0) {
                if (!tab.actionId) tab.actionId = tab.actionIds[0];
                $scope.actionName = actionNames[tab.actionId];
                //console.log("[current] action name -> " + $scope.actionName);
            }
        }

        $scope.addTabselectedHandler = function(tabId, handler) {
            $scope.tabData[tabId].onSelectedHanlders.push(handler);
        };
         $scope.addTabDeselectedHandler = function(tabId, handler) {
            $scope.tabData[tabId].onDesectedHandlers.push(handler);
        };

        $scope.changeToAction = function(newAction) {
            var activeTabIndex = $scope.activeTabIndex;
            var tab = tabContentViews[activeTabIndex];
            var index = actionNames.indexOf(newAction);


            if (index == -1) return false;
            if (tab.actionIds.indexOf(index) == -1) return false;

            tab.actionId = index;
            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.actionName = newAction;
                });
            })
        }

        this.shouldShowAction = function(actionName, tabIndex) {
            if ($scope.actionName == '') {
                setDefaultActionForTab();
            }
            return $scope.actionName == actionName && $scope.activeTabIndex == tabIndex;
        }
        $scope.shouldShowAction = this.shouldShowAction;


        $scope.showContentViewFor = function(tabIndex) {
            var viewId = tabContentViews[tabIndex].view
            $ionicSlideBoxDelegate.slide(viewId);
        }

        $scope.isSelectOther = function() {
            return ($scope.pictureLoaded && !$scope.isWaitReselect)
                   && 
                   ($scope.activeTabIndex == 0 || $scope.activeTabIndex == 1);
        }

        $scope.shouldShowTakePictureToolBars = function() {
            
            return (!$scope.pictureLoaded  || $scope.isWaitReselect)
                   && 
                   ($scope.activeTabIndex == 0 || $scope.activeTabIndex == 1);
        }

        $scope.shouldShowPreviewToolBars = function() {
            return $scope.activeTabIndex == 4;
        }
        $scope.shouldShowWidgetToolBars = function() {
            return !$scope.usingWebcam &&
                $scope.painter.shouldShowWidgetToolBars();
        }

        $scope.textSettingIsActive = false;
        $scope.shouldShowAddTextButton = function() {
            return !$scope.textSettingIsActive && $scope.activeTabIndex == 3;
        }

        $scope.shouldShowTextSettingBar = function() {
            return $scope.textSettingIsActive && $scope.activeTabIndex == 3;
        }


        $scope.shouldShowPreview = function() {
            return $scope.activeTabIndex == 4;
        }

        $scope.shouldShowHistory = function() {
            return $scope.activeTabIndex == 4 
                   ||
                   $scope.history.remainStep() > 0;
        }

        $scope.slideHasChanged = function(index) {
            var view = $scope.contentViews[index];
        }

        $scope.tabData = tabContentViews;
        $scope.frameWidth = 0;
        $scope.frameHeight = 0;
        $scope.tabIconWithIndex = function(index) {
            var tab = tabContentViews[index];
            var cl = $scope.activeTabIndex != index ? tab.inActiveClass : tab.activeClass;
            return cl;

        }

        $scope.selectTabWithIndex = function(index, ignoreAction, onSelectedFunc) {

            // handler if tab current tab
            var tab = tabContentViews[$scope.activeTabIndex];

            if ($scope.activeTabIndex != index || tab.multipleTab) {

                tab.onDesectedHandlers.forEach(function(f) {
                    if (f) f();
                });

                $scope.preActiveTabIndex = $scope.activeTabIndex;
                $scope.activeTabIndex = index;
                setDefaultActionForTab();
                $ionicTabsDelegate.select(index);
                $scope.showContentViewFor(index);

                var newTab = tabContentViews[$scope.activeTabIndex];
                $scope.actionBarClassName = newTab.actionBarClass;
                
                if (ignoreAction) {
                    if (onSelectedFunc) onSelectedFunc();
                    return;
                }

                if (newTab.action) {
                    newTab.action();
                }
                newTab.onSelectedHanlders.forEach(function(f) {
                    if (f) f();
                });

                if (!ignoreAction && onSelectedFunc) onSelectedFunc();
            }
        }

        $scope.isWaitForConfirmScreeen = false;
        var handleScreenSize = function(w, h) {
            if (h <= 0) return;
            //if (!$scope.isMobile()) return;

            if (w / h > 1 && $scope.isMobile()) {
                if ($scope.isWaitForConfirmScreeen) {
                    return;
                }
                $scope.isWaitForConfirmScreeen = true;
                $scope.showAlert({
                    title: "注意！",
                    message: "Please rotate screen now!!!"
                }, function() {
                    $scope.isWaitForConfirmScreeen = false;
                })
            }
        }

        var calculateFrameSize = function(frame, config, name) {

            var widthToHeight = config.widthToHeight;
            var maxHeight = config.maxHeight;
            //console.log("[" + name + "] widthToHeight: " + widthToHeight + " - maxHeight: " + maxHeight);

            var canvasRatio = $(frame).height() / $(frame).width();
            var newWidth = $window.innerWidth;
            var newHeight = $window.innerHeight;
            handleScreenSize(newWidth, newHeight);
            var newWidthToHeight = newWidth / newHeight;

            newHeight = newWidth / widthToHeight;
            if (newHeight > maxHeight) {
                newHeight = maxHeight;
                newWidth = newHeight * widthToHeight;
            }

            return {
                width: newWidth,
                height: newHeight
            }
        };
        $scope.calculateFrameSize = calculateFrameSize;
    }());

    /* @region - camera */
    (function() {
        $scope.webcam = webcamHandler;
    }());
    /* @endregion - camera */

    /* @region upload picture */
    (function() {
        $scope.uploader = uploaderHandler;
    }());
    /* @endregion upload picture */


    /* @region - filter */
    (function() {

            /*== create filter object ==*/
            Filter = {};

            // process with canvas TAG
            Filter.process = function(canvas, effect, callback) {
                // extract pixels data from canvas input
                var width = canvas.width;
                var height = canvas.height;
                var context = canvas.getContext('2d');
                var pixels = context.getImageData(0, 0,
                    width, height);

                // send the pixels to a worker thread
                var worker = new Worker('js/worker.js');
                var obj = {
                    pixels: pixels,
                    effects: effect
                };
                worker.postMessage(obj);

                // get message from the worker thread
                worker.onmessage = function(e) {
                    // debug
                    if (typeof e.data === "string") {
                        // console.log("Worker: " + e.data);
                        return;
                    }
                    
                    // create result canvas
                    var out = document.createElement('canvas');
                    out.width = width;
                    out.height = height;
                    // put pixels to new canvas
                    context = out.getContext("2d");
                    context.putImageData(e.data.pixels, 0, 0);
                    var dataURL = out.toDataURL();
                    if (callback) callback(out, dataURL);
                };
                return;
            };
            /*== end == */

            $scope.activeFilterIndex = -1;
            filterDisplayNames = ['lo_fi', 'mayfair', 'valencia', 'walden', 'xpro'];
            filterNames = ['lofi', 'mayfair', 'valencia', 'walden', 'xpro2'];
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
                $scope.showProcessingLoading('処理中');
                setTimeout(function() {
                    var canvas = $("#take-picture-canvas")[0];
                    var effect = filterNames[index];
                    var data = $(canvas).data('data-filter-name');

                    // ignore filter 
                    if (data === effect) {
                        $scope.activeFilterIndex = -1;

                        // revert back to raw image canvas
                        var dataURL = canvas.toDataURL();
                        $scope.painter.addImage(dataURL, function() {
                            setTimeout(function(){
                                $scope.hideProcessingLoading();                              
                            }, 0);
                        });
                        return;
                    }

                    // process filter
                    $scope.activeFilterIndex = index;
                    
                    $(canvas).data("data-filter-name", effect);
                    Filter.process(canvas, effect, function(result, dataURL){
                        $scope.painter.addImage(dataURL, function() {
                            setTimeout(function(){
                                $scope.hideProcessingLoading();
                             }, 0);
                        });
                    });  
                });
            }

        $scope.onTakenPicture = function(canvas, canvasId) {
            $scope.activeFilterIndex = -1;
            var dataURL = canvas.toDataURL();
            $scope.showProcessingLoading('処理中');
            $(canvas).data("data-filter-name", "");
            $scope.painter.addImage(dataURL, function(){
                setTimeout(function(){
                       $scope.hideProcessingLoading();
                }, 100);
            });
        }

        $scope.onPictureLoaded = function(dataURL, image) {
            $scope.activeFilterIndex = -1;
            $scope.showProcessingLoading('処理中');
            var canvas = $("#take-picture-canvas")[0];
            $(canvas).data("data-filter-name", "");

            $scope.painter.addImage(dataURL, function(){
                var w = image.width;
                var h = image.height;
                canvas.width = w;
                canvas.height = h;
                var ctx = canvas.getContext('2d');
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(image, 0, 0, w, h);
                setTimeout(function(){
                   $scope.hideProcessingLoading();
                }, 100);
            });
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
                src: 'img/assets/frames/thumbnails/' + (i + 1) + '.png',
                mask: 'img/assets/frames/masks/' + (i + 1) + '.svg',
            });
        }

        $scope.applyFrame = function(index, undo) {

            // track history
            if (!undo) {
                var lastIndex = $scope.activeFrameIndex;
                $scope.history.addVersion(function(params) {
                    var lastFrameIndex = params.frameIndex;
                    $scope.applyFrame(lastFrameIndex, true);
                }, {
                    frameIndex: lastIndex
                });
            }


            if ($scope.activeFrameIndex == index || index == -1) {
                $scope.painter.setDefaultFrame();
                $scope.activeFrameIndex = -1;
                return;
            }

            $scope.activeFrameIndex = index;
            var frame = $scope.frames[index];
            $scope.painter.applyFrame(frame);
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

        $scope.addTabselectedHandler(2, function() {
            $scope.showStickers();
        });
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
            fontJP: function(){
                var jpFonts = [];
                this.fonts.forEach(function(font){
                    if (font.lang === 'jp')
                       jpFonts.push(font);
                });
                return jpFonts;
            },
            fontEN: function(){
                var enFonts = [];
                this.fonts.forEach(function(font){
                    if (font.lang === 'en')
                       enFonts.push(font);
                });
                return enFonts;
            },

            display: function() {
                return this.name + ' ' + this.value.displayName;
            },
            select: function(font) {
                this.value = font;
            },
            itemClassFor: function(font){
                if (font.family === ''){
                    return 'blank';
                }
            },
            isBlank: function(font) {
                return font.family === '';
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
                family: 'YasashisaGothic',
            }, {
                id: 1,
                lang: 'jp',
                displayName: 'はななり明朝',
                family: 'Hannari',
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
                    $scope.applyTextSetting();
                }, 100);
            })
        }
        _.each(fontDataList, function(data) {
            fontDataWatch(data)
        });

        $scope.fontSetting = {
            lastChangeMessage: '',
            changed: false,
            isTyping: true
        }

        $scope.showTextSetting = function(text) {

            $scope.text = text;
            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.textSettingIsActive = true;
                    $scope.fontFamily.changeTo(text.fontFamily);
                    $scope.textColor.changeTo(text.stroke);
                    $scope.fontSize.changeTo(text.fontSize);
                });
            });
        }

        $scope.hideTextSetting = function() {
            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.textSettingIsActive = false;
                });
            });

        }

        $scope.applyTextSetting = function() {
            if (!$scope.text) return;
            $scope.text.fontFamily = $scope.fontFamily.value.family;
            $scope.text.fontSize = $scope.fontSize.value;
            $scope.text.fill = $scope.textColor.colorCode();
            $scope.canvas.renderAll();
        }


        $scope.doneSettingText = function() {
            $scope.hideTextSetting();
        }

        $scope.addNewText = function() {
            $scope.showTextInputPopup();
        }
        
        _.each([0, 1, 2, 3], function(tabId){
            $scope.addTabDeselectedHandler(tabId, function(){
                $scope.painter.deselectWidget();
            });
        });

        $scope.addTabselectedHandler(3, function() {
            $scope.showTextInputPopup();
        });


        // Triggered on a text doubble click, or some other target
        $scope.showTextInputPopup = function(text) {
            var content = text ? text.text : '';
            $scope.textData = {
                text: content
            }
            var cancel = {
                text: '',
                type: 'button-cancel'
            };
            var remove = {
                text: '',
                type: 'button-remove',
                onTap: function(e) {
                    if (!$scope.selectedWidget) {
                        $scope.selectedWidget = text;
                    }
                    $scope.painter.removeSelectedWidget();
                }
            }
            var add = {
                text: '',
                type: 'button-input',
                onTap: function(e) {
                    if (!$scope.textData.text) {
                        e.preventDefault();
                    } else {
                        return $scope.textData.text;
                    }
                }
            }
            var update = {
                text: '',
                type: 'button-input',
                onTap: function(e) {
                    if (!$scope.textData.text) {
                        e.preventDefault();
                    } else {
                        return $scope.textData.text;
                    }
                }
            }

            var actions = text ? [update, remove] : [add, cancel];

            // An elaborate, custom popup
            var textInputPopup = $ionicPopup.show({
                cssClass: 'text-input-popup',
                template: '<textarea rows="2" type="text" maxlength="30" ng-model="textData.text"/><span class="note">(全角30文字まで)</span>',
                title: 'テキストを入力してください',
                scope: $scope,
                buttons: actions
            });
            textInputPopup.then(function(res) {
                if (!res) {
                    return;
                }

                if (!text) {
                    setTimeout(function(){
                        $scope.painter.addNewText(res);
                    })
                } else {
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.painter.setText(text, res);
                        })
                    })
                }
            });

        };

    }());
    /* @endregion text setting */


    /* @region preview tab */
    (function() {
        $scope.previewer = {
            setupPreviewSize: function() {
                var frame = $("#preview-wrapper")[0];
                var size = $scope.calculateFrameSize(frame, {
                    widthToHeight: $scope.config.widthToHeight,
                    maxHeight: $scope.config.maxPreviewHeight
                }, 'setupPreviewSize');
                $(frame).width(size.width);
                $(frame).height(size.height);
                $scope.previewCanvas.setDimensions({
                    width: size.width + 'px',
                    height: size.height + 'px'
                }, {
                    cssOnly: true
                });
                $scope.previewCanvas.renderAll();
                //console.log("[previewer] view: " + size.width + " x " + size.height);
            },

            init: function() {
                this.tabId = 4;
                fabric.Object.prototype.transparentCorners = false;
                var canvas = $scope.previewCanvas = new fabric.Canvas('canvas-preview');
                canvas.backgroundColor = 'rgba(255, 0, 0, 0.1)';
                canvas.selection = false;
                this.setupPreviewSize();
                canvas.renderAll();
                angular.element($window).bind('resize', this.setupPreviewSize);
            },

            loadBackground: function(callback) {
                var self = this;
                var src = $scope.product.template;
                var objectLoadedHandler = function(object) {
                    var scale = $scope.config.printHeight / object.height;
                    var newWidth = object.width * scale;
                    var newHeight = object.height * scale;
                    $scope.printSizeWidth = newWidth;
                    $scope.printSizeHeight = newHeight;
                    //console.log("[previewer] size: " + newWidth + " x " + newHeight);


                    $scope.previewCanvas.setDimensions({
                        width: newWidth,
                        height: newHeight
                    }, {
                        backstoreOnly: true
                    });

                    object.set({
                        width: newWidth,
                        height: newHeight
                    });
                    if (callback) callback(object);
                }

                fabric.util.loadImage(src, function(image) {
                    var object = new fabric.Image(image);
                    objectLoadedHandler(object);
                });
            },


            handler: function() {
                var self = this;
                var canvas = $scope.previewCanvas;
                var painter = $scope.painter;
                $scope.showProcessingLoading('写真処理中');

                if (self.content) {
                    canvas.remove(self.content);
                    self.content = null;
                }

                self.loadBackground(function(background) {
                    painter.toImageContent(function(content) {
                        var left = canvas.width / 2 + content.width / 2;
                        var top = canvas.height / 2 + content.height / 2;
                        // console.log("[print content] size: " + canvas.width + " x " + canvas.height);
                        // console.log("[exported content] size: " + content.width + " x " + content.height);
                        // console.log("[content place] l-t: " + left + " - " + top);

                        content.set({
                            originX: 'center',
                            originY: 'center',
                            top: top,
                            left: left,
                            scaleX: 0.8,
                            scaleY: 0.8,
                            selectable: false
                        })
                        self.content = content;
                        canvas.add(content);
                        $scope.previewCanvas.setBackgroundImage(background,
                            $scope.previewCanvas.renderAll.bind($scope.previewCanvas), {
                                crossOrigin: 'anonymous'
                            });
                        setTimeout(function() {
                            $scope.hideProcessingLoading();
                        }, 100);

                    });
                });

            },
            exportDataSVG: function() {
                var filedata = $scope.previewCanvas.toSVG(); // the SVG file is now in filedata

                var locfile = new Blob([filedata], {
                    type: "image/svg+xml;charset=utf-8"
                });
                var locfilesrc = URL.createObjectURL(locfile); //mylocfile);

                var dwn = document.getElementById('dwn');
                dwn.innerHTML = "<a href=" + locfilesrc + " download='mysvg.svg'>Download</a>";

            },
            exportData: function() {
                console.log('export data ..');
                $scope.showProcessingLoading();
                setTimeout(function() {
                    var self = this;
                    var canvas = $scope.previewCanvas;

                    try {
                        var dataURL = canvas.toDataURL({
                            format: 'png',
                            multiplier: $scope.config.multiplier
                        });
                        var dwn = document.getElementById('download');
                        dwn.innerHTML = "<a href=" + dataURL + ">View Image</a>";

                    } catch (e) {
                        $scope.showAlert({
                            title: 'ラー',
                            message: "Cannot export data in your browser, \nerror: " + e
                        })
                    } finally {
                        $scope.hideProcessingLoading();
                    }
                }, 100);
            },

            viewImageNow: function() {
                console.log('export data ..');
                $scope.showProcessingLoading();
                setTimeout(function() {
                    var self = this;
                    var canvas = $scope.canvas;

                    try {
                        var dataURL = canvas.toDataURL({
                            format: 'png',
                            multiplier: $scope.config.multiplier
                        });
                        var dwn = document.getElementById('viewImage');
                        dwn.innerHTML = "<a href=" + dataURL + ">View Image</a>";

                    } catch (e) {
                        $scope.showAlert({
                            title: 'ラー',
                            message: "Cannot export data in your browser, \nerror: " + e
                        })
                    } finally {
                        $scope.hideProcessingLoading();
                    }
                }, 100);
            }

        }
        $scope.viewImageNow = $scope.previewer.viewImageNow;
        $scope.previewer.init();
        $scope.addTabselectedHandler($scope.previewer.tabId, function() {
            $scope.previewer.handler();
        });
    }());
    /* @endregion preview */
    $scope.hideControls = ['ml', 'mt', 'mr', 'mb'];

    fabric.UserImage = fabric.util.createClass(fabric.Image, {
        type: 'user-image',
        initialize: function(element, options) {
            this.callSuper('initialize', element, options);
            this.set('name', 'user-image');
        },

        toObject: function() {
            return fabric.util.object.extend(this.callSuper('toObject'), {
                name: this.name
            });
        }
    });
    fabric.UserImage.fromObject = function(object, callback) {
        fabric.util.loadImage(object.src, function(img) {
            callback && callback(new fabric.UserImage(img, object));
        });
    };
    fabric.UserImage.fromURL = function(url, callback, imgOptions) {
        fabric.util.loadImage(url, function(img) {
            callback(new fabric.UserImage(img, imgOptions));
        }, null, imgOptions && imgOptions.crossOrigin);
    };

    fabric.UserImage.async = true;

    $scope.painter = {

        setupFrameSize: function() {
            var frame = $("#frame-wrapper")[0];
            var size = $scope.calculateFrameSize(frame, {
                widthToHeight: $scope.config.widthToHeight,
                maxHeight: $scope.config.maxViewContentHeight
            }, 'setupFrameSize');

            $(frame).width(size.width);
            $(frame).height(size.height);

            $scope.canvas.setDimensions({

                width: size.width + 'px',
                height: size.height + 'px'
            }, {
                cssOnly: true
            });

            $scope.canvas.forEachObject(function(obj) {
                var setCoords = obj.setCoords.bind(obj);
                obj.on({
                    moving: setCoords,
                    scaling: setCoords,
                    rotating: setCoords
                });
            });

            //$scope.canvas.backgroundColor = 'rgba(0, 255, 0, 0.1)';
            //console.log("[painter] view: " + size.width + " x " + size.height);
        },

        initDrawing: function() {
            fabric.Object.prototype.transparentCorners = false;
            var canvas = $scope.canvas = this.__canvas = new fabric.Canvas('canvas-content');
            canvas.backgroundColor = 'transparent';
            canvas.selectionColor = 'rgba(0,255,0,0.3)';

            var contentWidth = $scope.config.contentHeight * $scope.config.widthToHeight;
            //console.log("****** with to height: " + $scope.config.widthToHeight);
            //console.log("****** content height: " + $scope.config.contentHeight);

            canvas.setDimensions({
                width: contentWidth,
                height: $scope.config.contentHeight
            }, {
                backstoreOnly: true
            });
            canvas.centeredScaling = true;

            //console.log("[painter] size: " + contentWidth + " x " + $scope.config.contentHeight);
            $scope.painter.width = contentWidth;
            $scope.painter.height = $scope.config.contentHeight;
            this.setDefaultFrame();
            canvas.renderAll();
            this.setupFrameSize();
            angular.element($window).bind('resize', this.setupFrameSize);
            this.setupEvents();
            
            var conerSize = $scope.isMobile() ? 40 : 30;
            this.widgetConfig = {
               transparentCorners: true,
               cornerColor: '#ff5a69',
               cornerSize: conerSize,
               borderColor: '#ff5a69'
            };
        },

        setupEvents: function() {
            var texts = this.texts;

            var date = new Date();
            var lastTime = date.getTime();
            $scope.canvas.observe('mouse:down', function(e) {
                date = new Date();
                var now = date.getTime();
                if (now - lastTime < 500) {

                    if (e.target && e.target.isType('text')) {
                        setTimeout(function() {
                            $scope.$apply(function() {
                                if ($scope.activeTabIndex != 3){
                                    $scope.selectTabWithIndex(3, true, function(){
                                        $scope.showTextInputPopup(e.target);
                                    });
                                } else {
                                    $scope.showTextInputPopup(e.target);
                                }
                                
                            });
                        });

                    }
                }
                lastTime = now;
            });

            $scope.canvas.on('object:selected', function(e) {
                $scope.selectedWidget = e.target;
                if (e.target && e.target.isType('text')) {
                    setTimeout(function() {
                        $scope.$apply(function() {
                            if ($scope.activeTabIndex != 3){
                                $scope.selectTabWithIndex(3, true, function(){
                                    $scope.showTextSetting(e.target);
                                });
                            }else {
                                $scope.showTextSetting(e.target);
                            }
                        });
                    });
                } else {
                    $scope.hideTextSetting();

                    if (e.target && e.target.isType('user-image')) {
                        if ($scope.activeTabIndex != 0 && $scope.activeTabIndex != 1){
                            setTimeout(function(){
                                $scope.$apply(function(){
                                    $scope.selectTabWithIndex(0, true);
                                })
                            })       
                        }
                    }
                    else {
                        if ($scope.activeTabIndex != 2){
                            setTimeout(function(){
                                $scope.$apply(function(){
                                    $scope.selectTabWithIndex(2, true);
                                })
                            })
                        }
                    }
                }

            });
            $scope.canvas.on('selection:cleared', function(e) {
                $scope.hideTextSetting();
                $scope.selectedWidget = null;
            });
        },
        toImageContent: function(callback) {
            var self = this;
            var canvas = $scope.canvas;
            canvas.deactivateAll();
            try {
                var dataURL = canvas.toDataURL({
                    format: 'png',
                    multiplier: $scope.config.multiplier
                });
                fabric.Image.fromURL(dataURL, function(image) {
                    canvas.centerObject(image);
                    if (callback) callback(image);
                })

            } catch (e) {
                $scope.hideProcessingLoading();
                $scope.showAlert({
                    title: 'ラー',
                    message: "Cannot export data in your browser, \nerror: " + e
                })
            } finally {}

        },
        toDrawContent: function(callback) {
            var self = this;
            var w = $scope.painter.width;
            var h = $scope.painter.height;

            var ready = function(mask) {
                var str = $scope.canvas.toSVG();
                fabric.loadSVGFromString(str, function(objects, options) {
                    var image = fabric.util.groupSVGElements(objects, options);
                    if (objects && objects.length > 0) {
                        if (mask) {
                            image.set({
                                clipTo: function(ctx) {
                                    mask.render(ctx);
                                }
                            });
                        } else {
                            image.set({
                                clipTo: function(ctx) {
                                    ctx.rect(-w / 2, -h / 2, w, h);
                                }
                            });
                        }
                    }

                    if (callback) callback(image);
                });
            };

            if (!self.mask) {
                ready();
                return;
            }
            self.mask.clone(function(mask) {
                mask.set({
                    originX: 'center',
                    originY: 'center',
                    top: 0,
                    left: 0
                });

                ready(mask);
            });
        },
        newPosition: function() {
            var w4 = $scope.painter.width / 4;
            var h4 = $scope.painter.height / 4;
            return {
                x: fabric.util.getRandomInt(w4, w4 * 2),
                y: fabric.util.getRandomInt(h4, h4 * 2)
            }
        },
        image: null,
        addNewText: function(content) {
            $scope.history.addVersion();

            var text = new fabric.Text(content, {
                fontFamily: $scope.fontFamily.value.family,
                fontSize: $scope.fontSize.value,
                fill: $scope.textColor.colorCode(),
                textAlign: 'center'
            });

            _.each($scope.hideControls, function(c) {
                text.setControlVisible(c, false);
            });

            var newPosition = this.newPosition();
            text.set({
                left: newPosition.x,
                top: newPosition.y
            });
            text.set(this.widgetConfig);
            text.setCoords();
            $scope.canvas.add(text);
            $scope.canvas.setActiveObject(text);
            $scope.canvas.renderAll();
        },
        setText: function(text, value) {
            text.setText(value);
            $scope.canvas.renderAll();
        },
        addSticker: function(sticker) {
            var self = this;
            $scope.history.addVersion();

            newPosition = this.newPosition();
            fabric.Image.fromURL(sticker.src, function(image) {
                _.each($scope.hideControls, function(c) {
                    image.setControlVisible(c, false);
                });
                image.set({
                    left: newPosition.x,
                    top: newPosition.y,
                })
                image.set(self.widgetConfig);
                image.scaleToHeight(150);
                image.setCoords();
                $scope.canvas.add(image)
                $scope.canvas.setActiveObject(image);
                $scope.canvas.renderAll();
            });
        },
        applyFrame: function(frame) {
            var self = this;

            var userImages = $scope.canvas.getObjects('user-image');
            if (userImages.length == 0) {
                return;
            }
            var userImage = userImages[0];

            $scope.showProcessingLoading();

            fabric.loadSVGFromURL(frame.mask, function(objects, options) {
                var mask = $scope.painter.mask = fabric.lastMaskImage = fabric.util.groupSVGElements(objects, options);
                var image = userImage;
                var iw = image.width;
                var ih = image.height;
                var it = image.top;
                var il = image.left;
                var mw = mask.width;
                var mh = mask.height;

                if (iw / ih > mw / mh) {
                    mask.scaleToHeight(ih);
                } else {
                    mask.scaleToWidth(iw);
                }

                var leftcenter = iw / 2;
                var halfleft = mask.currentWidth / 2;
                var topCenter = ih / 2;
                var halfTop = mask.currentHeight / 2;

                mask.set({
                    originX: 'left',
                    originY: 'top',
                    left: leftcenter - halfleft,
                    top: topCenter - halfTop
                });
                mask.setCoords();
                userImage.set({
                    clipTo: function(ctx) {
                        fabric.lastMaskImage.render(ctx);
                    }
                });
                $scope.canvas.renderAll();
                $scope.hideProcessingLoading();
            });
        },
        setLastFrame: function(callback) {
            var self = this;

            var userImages = $scope.canvas.getObjects('user-image');
            if (userImages.length == 0) {
                return;
            }
            var userImage = userImages[0];
            var index = $scope.activeFrameIndex;
            if (index == -1) {
                return;
            }

            var frame = $scope.frames[index];
            fabric.loadSVGFromURL(frame.mask, function(objects, options) {
                var mask = $scope.painter.mask = fabric.lastMaskImage = fabric.util.groupSVGElements(objects, options);
                var image = userImage;
                var iw = image.width;
                var ih = image.height;
                var it = image.top;
                var il = image.left;
                var mw = mask.width;
                var mh = mask.height;

                if (iw / ih > mw / mh) {
                    mask.scaleToHeight(ih);
                } else {
                    mask.scaleToWidth(iw);
                }

                var leftcenter = iw / 2;
                var halfleft = mask.currentWidth / 2;
                var topCenter = ih / 2;
                var halfTop = mask.currentHeight / 2;

                mask.set({
                    originX: 'left',
                    originY: 'top',
                    left: leftcenter - halfleft,
                    top: topCenter - halfTop
                });
                mask.setCoords();
                userImage.set({
                    clipTo: function(ctx) {
                        fabric.lastMaskImage.render(ctx);
                    }
                });
                if (callback) callback();
            });
        },
        setDefaultFrame: function() {
            this.mask = null;
            var userImages = $scope.canvas.getObjects('user-image');
            _.each(userImages, function(image){
                image.set({clipTo: null});
            });
            $scope.canvas.renderAll();
        },
        addImage: function(src, callback) {
            var self = this;

            //$scope.history.addVersion();
            var userImages = $scope.canvas.getObjects('user-image');
            _.each(userImages, function(image){
                 $scope.canvas.remove(image);
            });

            var h = $scope.painter.height;
            var w = $scope.painter.width;

            fabric.UserImage.fromURL(src, function(image) {
                var iw = image.width;
                var ih = image.height;
                if (iw / ih > w / h) {
                    image.scaleToWidth(w - 10);
                } else {

                    image.scaleToHeight(h - 10);
                }
                _.each($scope.hideControls, function(c) {
                    image.setControlVisible(c, false);
                });

                image.set({
                    originX: 'center',
                    originY: 'center',
                });
                image.set(self.widgetConfig);
               

                $scope.canvas.add(image);
                $scope.canvas.centerObject(image);
                $scope.canvas.sendToBack(image);
                $scope.canvas.setActiveObject(image);
                image.setCoords();

                // setup frame
                if ($scope.activeFrameIndex != -1){
                    self.setLastFrame(function(){
                        $scope.canvas.renderAll();
                        if (callback) callback();
                    })
                }else {
                    $scope.canvas.renderAll();
                    if (callback) callback();
                }
            });
        },
        shouldShowWidgetToolBars: function() {
            var widget = $scope.selectedWidget;
            if (!widget) return false;

            if (widget.isType('text')) {
                return false;
            }
            if (widget.isType('user-image')){
                return false;
            }

            if ($scope.activeTabIndex == 0){
                return false;
            }
            return true;
        },
        removeSelectedWidget: function() {
            var widget = $scope.selectedWidget;
            if (widget) {
                $scope.history.addVersion();
                $scope.canvas.remove(widget);
                $scope.canvas.renderAll();
                $scope.selectedWidget = null;
            }
        },
        deselectWidget: function() {
            $scope.selectedWidget = null;
            $scope.canvas.deactivateAll();
            $scope.canvas.renderAll();
        }
    }

    $scope.painter.initDrawing();
    //$scope.painter.addImage('/img/example3.jpg');
    $scope.webcam.init({
        window: $window,
        scope: $scope,
        fail: function(err) {
            $scope.showAlert({
                title: "警報！",
                message: "カメラが起動できません。"
            });
        },
        done: function(canvas, canvasId) {
            $scope.usingWebcam = false;
            $scope.pictureLoaded = true;
            $scope.isWaitReselect = false;
            $scope.onTakenPicture(canvas, canvasId);
            $scope.changeToAction("filter");

        },
        canvasId: '#take-picture-canvas',
        videoId: '#take-picture-video'
    });
    $scope.uploader.init({
         fail: function(err) {
            $scope.showAlert({
                title: "警報！",
                message: err
            });
        },
        done: function(dataURL, image) {
            $scope.pictureLoaded = true;
            $scope.isWaitReselect = false;
            $scope.onPictureLoaded(dataURL, image);
            $scope.changeToAction("filter");
        },
        inputId: '#take-picture-input'
    });
    // -end in ready function

    // undo
    var history = {
        maxSteps: $scope.config.maxUndoSteps || 1,
        data: [],
        currentVersion: 0,
        remainStep: function() {
            return this.data.length;
        },

        addVersion: function(undoFunc, params) {
            var self = this;

            while (self.data.length >= self.maxSteps) {
                self.data.shift();
            }
            self.data.push({
                action: undoFunc || function() {},
                params: params || {},
                data: JSON.stringify($scope.canvas)
            });
        },

        backVersion: function() {
            if (this.data.length == 0) {
                return;
            }

            var last = this.data.pop();
            last.action(last.params);
            $scope.canvas.clear();
            $scope.canvas.loadFromJSON(last.data, function(){
                $scope.canvas.forEachObject(function(obj){
                    var setCoords = obj.setCoords.bind(obj);
                    obj.set($scope.painter.widgetConfig);
                    obj.on({
                        moving: setCoords,
                        scaling: setCoords,
                        rotating: setCoords
                    });
                });
                $scope.canvas.renderAll();
            });
            
        }
    };
    $scope.history = history;
    $scope.startUndo = function() {
        if ($scope.activeTabIndex == 4){
            setTimeout(function() {
                $scope.$apply(function() {
                    var tabIndex = $scope.preActiveTabIndex;
                    $scope.selectTabWithIndex(tabIndex, true);
                });

            });
            return;
        }
        $scope.history.backVersion();
    }

    // link button event for camera-upload button
    angular.element('#rool-picture-btn').bind('click', function(e) {
        $scope.webcam.clear();
        setTimeout(function() {
            $scope.$apply(function() {
                $scope.useWebcam = false;
                $scope.usingWebcam = false;
            });
        });
        angular.element('#take-picture-input').trigger('click');
    });
    angular.element('#upload-picture-btn').bind('click', function(e) {
        $scope.webcam.clear();
        setTimeout(function() {
            $scope.$apply(function() {
                $scope.useWebcam = false;
                $scope.usingWebcam = false;
            });
        });
        angular.element('#take-picture-input').trigger('click');
    });
    angular.element('#start-camera-btn').bind('click', function(e) {

        setTimeout(function() {
            $scope.$apply(function() {
                $scope.useWebcam = true;
                $scope.usingWebcam = true;
            });
        });
        $scope.webcam.start();
    });

    angular.element('#take-picture-btn').bind('click', function(e) {
        $scope.webcam.take();
    });

    angular.element('#retake-picture-btn').bind('click', function(e) {
        if ($scope.isMobile()) {
            $scope.webcam.clear();
            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.useWebcam = false;
                    $scope.usingWebcam = false;
                });
            });
            angular.element('#take-picture-input').trigger('click');
        }
        else {
            setTimeout(function() {
                $scope.$apply(function() {
                   $scope.isWaitReselect = true;
               });
            });
        }
    });


    angular.element('#continue-edit-btn').bind('click', function(e) {
        setTimeout(function() {
            $scope.$apply(function() {
                var tabIndex = $scope.preActiveTabIndex;
                $scope.selectTabWithIndex(tabIndex, true);
            });

        });
    })


    angular.element('#decided-picture-btn').bind('click', function(e) {

        $scope.lastUsedTabIndex = $scope.activeTabIndex;
        setTimeout(function() {
            $scope.$apply(function() {
                $scope.selectTabWithIndex(1);
            });

        })
    });

    angular.element('#decided-design-btn').bind('click', function(e) {
        setTimeout(function() {
            $scope.previewer.exportData();
        })
    })

    angular.element('#remove-widget-btn').bind('click', function(e) {
        setTimeout(function() {
            $scope.painter.removeSelectedWidget();
        })
    })
    
})


///
/// $scope.changeToAction("filter");
// $(picture).removeAttr("data-caman-id");



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