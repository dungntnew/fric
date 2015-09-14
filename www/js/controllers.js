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
            actionBarClass: "camera-action-bar",
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
            actionBarClass: "action-bar",
            inActiveClass: 'tab-icon-frame',
            activeClass: 'tab-icon-frame-active'
        }, {
            id: 2,
            name: "stickers",
            view: 0,
            actionId: 3,
            actionIds: [3],
            multipleTab: false,
            onSelectedHanlders: [],
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

        $scope.shouldShowPictureToolBars = function() {
            return $scope.pictureLoaded && $scope.activeTabIndex == 0;
        }
        $scope.shouldShowTakePictureToolBars = function() {
            return !$scope.pictureLoaded && $scope.activeTabIndex == 0;
        }
        $scope.shouldShowPreviewToolBars = function() {
            return $scope.activeTabIndex == 4;
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
            return $scope.activeTabIndex != 4 && $scope.history.remainStep() > 0;
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

        $scope.selectTabWithIndex = function(index, ignoreAction) {

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

                if (ignoreAction) return;
                if (newTab.action) {
                    newTab.action();
                }
                newTab.onSelectedHanlders.forEach(function(f) {
                    if (f) f();
                });
            }
        }

        $scope.isWaitForConfirmScreeen = false;
        var handleScreenSize = function(w, h) {
            if (h <= 0) return;

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
            $scope.showProcessingLoading('処理中');
            setTimeout(function() {
                var imageCanvas = $("#take-picture-canvas")[0];
                var metadata_id = $(imageCanvas).attr('data-caman-id');

                // ignore filter 
                if (metadata_id && $scope.activeFilterIndex == index) {
                    $scope.activeFilterIndex = -1;
                    Caman(imageCanvas, function() {
                        this.revert();
                        this.render(function() {
                            var picture = $("#take-picture-canvas")[0];
                            var dataURL = picture.toDataURL();
                            $scope.painter.addImage(dataURL, function() {
                                $scope.hideProcessingLoading();
                            });

                        })
                    });
                    return;
                }


                $scope.activeFilterIndex = index;
                var effect = filterNames[index];
                Caman("#take-picture-canvas", function() {
                    if (effect in this) {
                        this.revert();
                        this[effect]();
                        this.render(function() {
                            var picture = $("#take-picture-canvas")[0];
                            var dataURL = picture.toDataURL();
                            $scope.painter.addImage(dataURL, function() {
                                $scope.hideProcessingLoading();
                            });
                        });
                    } else {
                        $scope.hideProcessingLoading();
                    }
                });

            }, 50);
        }

        $scope.onTakenPicture = function(canvas, canvasId) {
            var dataURL = canvas.toDataURL();
            $(canvas).removeAttr("data-caman-id");
            $scope.painter.addImage(dataURL);
        }

        $scope.onPictureLoaded = function(dataURL) {
            $scope.painter.addImage(dataURL);
            var canvas = $("#take-picture-canvas")[0];
            $(canvas).removeAttr("data-caman-id");

            var image = new Image();
            image.onload = function() {
                var w = image.width;
                var h = image.height;
                canvas.width = w;
                canvas.height = h;
                var ctx = canvas.getContext('2d');
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(image, 0, 0, w, h);
            };
            image.src = dataURL;
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
                text: 'キャンセル',
                type: 'button-light'
            };
            var remove = {
                text: '削除',
                type: 'button-assertive',
                onTap: function(e) {
                    $scope.painter.removeText(text);
                }
            }
            var add = {
                text: '<b>入力</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.textData.text) {
                        e.preventDefault();
                    } else {
                        return $scope.textData.text;
                    }
                }
            }
            var update = {
                text: '<b>更新</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.textData.text) {
                        e.preventDefault();
                    } else {
                        return $scope.textData.text;
                    }
                }
            }

            var actions = text ? [remove, update]: [cancel, add];

            // An elaborate, custom popup
            var textInputPopup = $ionicPopup.show({
                template: '<input type="text" maxlength="30" ng-model="textData.text">',
                title: 'テキストを入力してください',
                subTitle: '制限（30文字)',
                scope: $scope,
                buttons: actions
            });
            textInputPopup.then(function(res) {
                if (!res) {
                    return;
                }

                if (!text) {
                    $scope.painter.addNewText(res);
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
                console.log("[previewer] view: " + size.width + " x " + size.height);
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
                    console.log("[previewer] size: " + newWidth + " x " + newHeight);


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
                        console.log("[print content] size: " + canvas.width + " x " + canvas.height);
                        console.log("[exported content] size: " + content.width + " x " + content.height);
                        console.log("[content place] l-t: " + left + " - " + top);

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
            //$scope.canvas.backgroundColor = 'rgba(0, 255, 0, 0.1)';
            console.log("[painter] view: " + size.width + " x " + size.height);
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

            console.log("[painter] size: " + contentWidth + " x " + $scope.config.contentHeight);
            $scope.painter.width = contentWidth;
            $scope.painter.height = $scope.config.contentHeight;
            this.setDefaultFrame();
            canvas.renderAll();
            this.setupFrameSize();
            angular.element($window).bind('resize', this.setupFrameSize);
            this.setupEvents();
        },

        setupEvents: function() {
            var texts = this.texts;

            var date = new Date();
            var lastTime = date.getTime();
            $scope.canvas.observe('mouse:down', function(e) {
                date = new Date();
                var now = date.getTime();
                if (now - lastTime < 500) {

                    if (texts.indexOf(e.target) != -1) {
                        setTimeout(function() {
                            $scope.$apply(function() {
                                $scope.selectTabWithIndex(3, true);
                                $scope.showTextInputPopup(e.target);
                            });
                        });

                    }
                }
                lastTime = now;
            });

            $scope.canvas.on('object:selected', function(e) {
                if (texts.indexOf(e.target) != -1) {
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.selectTabWithIndex(3, true);
                            $scope.showTextSetting(e.target);
                        });
                    });
                } else {
                    $scope.hideTextSetting();
                }
            });
            $scope.canvas.on('selection:cleared', function(e) {
                $scope.hideTextSetting();

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
        widgets: [],
        texts: [],

        addNewText: function(content) {
            // track history
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

            this.texts.push(text.set({
                left: newPosition.x,
                top: newPosition.y,
                transparentCorners: false,
                cornerColor: 'red',
                cornerSize: 20,
                borderColor: 'red'
            }));

            $scope.canvas.add(text);
            $scope.canvas.setActiveObject(text);
            $scope.canvas.renderAll();
        },
        setText: function(text, value) {
            text.setText(value);
            $scope.canvas.renderAll();
        },
        removeText: function(text) {
            // track history
            $scope.history.addVersion();

            $scope.canvas.remove(text);
            $scope.canvas.renderAll();
        },

        addSticker: function(sticker) {
            // track history
            $scope.history.addVersion();

            newPosition = this.newPosition();
            fabric.Image.fromURL(sticker.src, function(image) {
                _.each($scope.hideControls, function(c) {
                    image.setControlVisible(c, false);
                });

                $scope.canvas.add(image.set({
                    left: newPosition.x,
                    top: newPosition.y,
                    transparentCorners: false,
                    cornerColor: 'red',
                    cornerSize: 20,
                    borderColor: 'red'
                }).scaleToHeight(150));
                $scope.canvas.setActiveObject(image);
            })
            $scope.canvas.renderAll();

        },

        applyFrame: function(frame) {
            var self = this;

            if (!self.image) {
                return;
            }


            $scope.showProcessingLoading();

            fabric.loadSVGFromURL(frame.mask, function(objects, options) {
                var mask = $scope.painter.mask = fabric.lastMaskImage = fabric.util.groupSVGElements(objects, options);

                var image = self.image;
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

                self.image.clipTo = function(ctx) {
                    fabric.lastMaskImage.render(ctx);
                }
                $scope.canvas.renderAll();
                $scope.hideProcessingLoading();
            });
        },
        setDefaultFrame: function() {
            this.mask = null;
            self = this;
            if (!self.image) {
                return;
            }
            self.image.clipTo = null;
            $scope.canvas.renderAll();
        },

        addImage: function(src, callback) {
            var self = this;

            // track history
            //$scope.history.addVersion();

            if (self.image) {
                $scope.canvas.remove(self.image);
            }

            var h = $scope.painter.height;
            var w = $scope.painter.width;

            fabric.Image.fromURL(src, function(image) {
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
                    transparentCorners: false,
                    cornerColor: 'red',
                    cornerSize: 20,
                    borderColor: 'red'
                });

                //image.applyFilters();
                $scope.canvas.add(image);
                $scope.canvas.centerObject(image);
                $scope.canvas.sendToBack(image);
                $scope.canvas.setActiveObject(image);
                $scope.canvas.renderAll();

                self.image = image;
                if (callback) callback();
            });

        },
        crop: function() {
            var el = new fabric.Rect({
                fill: 'transparent',
                originX: 'left',
                originY: 'top',
                stroke: '#ccc',
                strokeDashArray: [2, 2],
                opacity: 1,
                width: 1,
                height: 1
            });
            el.visible = false;
            $scope.canvas.add(el);
        }
    }


    // ionic.Platform.ready(function() {

    // });

    $scope.painter.initDrawing();
    //$scope.painter.addImage('/img/example3.jpg');
    $scope.webcam.init({
        window: $window,
        scope: $scope,
        fail: function(err) {
            $scope.showAlert({
                title: "警報！",
                message: err
            });
        },
        done: function(canvas, canvasId) {
            $scope.usingWebcam = false;
            $scope.pictureLoaded = true;
            $scope.onTakenPicture(canvas, canvasId);
            $scope.changeToAction("filter");

        },
        canvasId: '#take-picture-canvas',
        videoId: '#take-picture-video'
    });
    $scope.uploader.init({
        window: $window,
        scope: $scope,
        fail: function(err) {
            $scope.showAlert({
                title: "警報！",
                message: err
            });
        },
        done: function(dataURL) {
            $scope.pictureLoaded = true;
            $scope.onPictureLoaded(dataURL);
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
            $scope.canvas.loadFromJSON(last.data);
            $scope.canvas.renderAll();
        }
    };
    $scope.history = history;
    $scope.startUndo = function() {
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
        if ($scope.useWebcam) {
            $scope.webcam.start();
            $scope.usingWebcam = true;
        }
        $scope.pictureLoaded = false;
        $scope.changeToAction("takePicture");
    });

    angular.element('#decided-picture-btn').bind('click', function(e) {
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