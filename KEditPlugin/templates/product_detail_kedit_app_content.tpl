<!--{if $arrProduct.plg_kedit_flg}-->



<script type="text/javascript">

	$(document).ready(function(){
        var KEditApp = {
            appIdentify: "KEditApp",
            isBrowserSupported: true,
        	isKEditAppLoaded: false,
        	exportedDataInputId: '#kEditExportedDataInput',
        	exportedFinishMessageTagId: '#kEditFinishMessage',
            exportedFinishPreviewId: '#kEditFinishPreview',
        	iFrameId: '#kEditAppIFrame',
        	iFramePath: "<!--{$app_path}-->",
        	iframe: {},
            wrapper:{},
        	iFrameWindow: {},
            uploadApi: "<!--{$upload_api}-->",
            productListApi: "<!--{$product_list_api}-->",
            
            resize: function() {
            	var height = $(window).height();
            	var width = $(window).width();
            	$(this.wrapper).css({
            		'width': width,
            		'height': height
            	});
                var appWidth = width > 500 ?  500: width;
                var marginLeft = (width - appWidth) / 2;
              
                $(self.iframe).css({
                    'width': appWidth,
                    'margin-left': marginLeft,
                    'margin-top': 0,
                    'height': '100%'

                });
            },

            checkSupport: function(){
                var self = this;
                if(typeof(Storage) !== "undefined") {
                    // Code for localStorage/sessionStorage.
                } else {
                    
                    self.errorMessage = "Sorry! No Web Storage support..";
                }
            },

        	init: function() {

        		var self = this;
                // self.checkSupport();
                // if (!isBrowserSupported) {
                //     alert(self.errorMessage);
                //     return;
                // }
                self.wrapper = $('<div></div>');
                var height = $(window).height();
                var width = $(window).width();

                $(self.wrapper).css({

                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'width': width,
                    'height': '100%',
                    'vertical-align': 'middle',
                    'display': 'table-cell',
                    'background-color': 'black',
                    'z-index': 1000
                }).appendTo('body');
                
                var appWidth = width > 500 ?  500: width;
                var marginLeft = (width - appWidth) / 2;
        		self.iframe = $('<iframe />', {
				    id: self.iFrameId
				})[0];
				$(self.iframe).css({
		            'width': appWidth,
                    'margin-left': marginLeft,
                    'margin-top': 0,
                    'height': '100%'

				}).appendTo(self.wrapper);

        		self.isKEditAppLoaded = false;
        		
        		$(self.wrapper).hide();
        		$(window).resize(function(){
        			self.resize();
        		});
        		self.resize();

        		// trigger load
        		var onLoadHandler = function() {
        			
	        		self.app = self.iFrameWindow 
	        		         = self.iframe.contentWindow;
	        		
	        		if (!self.app.setupAppData) {
	        			self.onLoadFail("setupAppData func not foud in iframe-window.");
	        			return;
	        		}

	        		self.app.setupAppData({
	        			data: {},
	        			callback: function(data) {
	        				self.onFinish(data);
	        			}
	        		});
	        		self.isKEditAppLoaded = true;
	        		console.log("[app: " +  self.appIdentify + "] load success " + self.isKEditAppLoaded);
        		};
                var unix = Math.round(+new Date()/1000);
                var appPath = self.iFramePath + '?v=' + unix

                // bind variable to global window app
                // this will be eccube hook access with path
                // parent.kedit
                window.KEditAppData = {
                    appPath: appPath,
                    listApi: self.productListApi,
                    uploadApi: self.uploadApi
                };
        		$(self.iframe).attr('src', appPath);
        		$(self.iframe).bind('load', onLoadHandler);
        	},
        	start: function() {
        		var self = this;

        		if (!self.isKEditAppLoaded) {
        			console.log("app cannot startup.");
        			return;
        		}
        		if (!self.app.startup) {
        			console.log("app::startup function not found.");
        			return;
        		}
                $(window).scrollTop(0);
                $('body').css('overflowY', 'hidden');
        		$(self.wrapper).fadeIn();

        		self.app.startup();
        	},
        	onFinish: function(data) {
                $('body').css('overflowY', 'auto');
        		var self = this;
                var transactionid = $("*[name=transactionid]").val();
                var product_id = data["product_id"];
                var exported_data_url = data['exported_data_url'];
                var template_url = data['template_url'];
                var encodedContentData = encodeURIComponent(exported_data_url);
                var uploadTempApiUrl = self.uploadApi;

                console.log("transactionid: " + transactionid);

                $.ajax({
                    
                    type: "POST",
                    ulr: uploadTempApiUrl,
                    data: { 
                        'transactionid': transactionid, 
                        'kedit_product_id': product_id,
                        'kedit_template_url': template_url,
                        'kedit_exported_data_url': encodedContentData,
                        'kedit_summit': true 
                    },
                    success: function(data){
                        try {
                            var res = JSON.parse(data);
                            if (res['success']) {
                                console.log("upload success!");
                                $(self.wrapper).fadeOut();
                            }else {
                                self.onUploadFail(e);
                            }
                            
                        }
                        catch(e) {
                            self.onUploadFail(e);
                        }
                    },
                    error: function(xhr,status,error) {
                        console.log(error);
                        self.onUploadFail(error);
                    }
                });
        	},
        	preData: function() {
        	},
        	fillData: function(data) {
        	},
            onUploadFail: function(err){
                console.log("upload image fail with error:");
                console.log(err);
                $(self.wrapper).fadeOut();
            },
        	onLoadFail: function(err) {
        		console.log("KEdit App Load Error " + err);
        	}
        }
        KEditApp.init();

		$("#start-kedit-app-btn").click(function(){
			if (!KEditApp.isKEditAppLoaded) {
				console.log("KEditAppLoaded Fail..");
				return;
			}
			KEditApp.start();
		});
	});
</script>

<!--{/if}-->
