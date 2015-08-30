var app = angular.module('app.webcam', ['app.services']);
app.controller('WebcamCtrl', function($scope, $window, $timeout, SharedService) {

	$scope.isReady = false;
	$scope.isTaken = false;
	$scope.isWaitForTake = false;
	$scope.isLastTaken = true; // Other is uploadPhoto


	var isStreaming = false,
		v = document.getElementById('take-picture-video'),
		c = document.getElementById('take-picture-canvas'),
		input = document.getElementById('take-picture-input'),
		r = document.getElementById('r'),
		ctx = c.getContext('2d');



	var calculateFrameSize = function() {
		var config = $scope.config || {
			widthToHeight: 1,
			maxHeight: 425
		};

		var widthToHeight = config.widthToHeight;
		var maxHeight = config.maxHeight;

		var canvasRatio = c.height / c.width;
		var newWidth = $window.innerWidth;
		var newHeight = $window.innerHeight;
		var newWidthToHeight = newWidth / newHeight;

		// if (newWidthToHeight > widthToHeight) {
		//     newWidth = newHeight * widthToHeight;
		// } else {
		//     newHeight = newWidth / widthToHeight;
		// }

		newHeight = newWidth / widthToHeight;
		if (newHeight > maxHeight) {
			newHeight = maxHeight;
			newWidth = newHeight * widthToHeight;
		}

		w = newWidth;
		h = newHeight;
		c.width = w;
		c.height = h;
		c.setAttribute('width', w);
		c.setAttribute('height', h);
	};

	var clearWebcam = function() {
		v.src = "";
		image = new Image();
		stopRecord();
		ctx.fillRect(0, 0, w, h);
		ctx.drawImage(v, 0, 0, w, h);
	}

	snapshoot = false;
	var startRecord = function() {
		// Every 33 milliseconds copy the video image to the canvas
		$scope.webcamInterval = setInterval(function() {
			if (v.paused || v.ended) return;
			ctx.fillRect(0, 0, w, h);
			ctx.drawImage(v, 0, 0, w, h);
			if (snapshoot) takePhoto();
		}, 33);
	}

	var stopRecord = function() {
		if ($scope.webcamInterval) {
			clearInterval($scope.webcamInterval);
		}
	}

	calculateFrameSize();
	clearWebcam();

	angular.element($window).bind('resize', function() {
		$scope.$apply(function() {
			calculateFrameSize();
		})
	});


	// Cross browser

	var startWebcam = function() {
		if (navigator.getUserMedia) {
			// Request access to video only
			navigator.getUserMedia({
					video: true,
					audio: false
				},
				function(stream) {
					// Cross browser checks
					var url = window.URL || window.webkitURL;
					v.src = url ? url.createObjectURL(stream) : stream;
					// Set the video to play
					v.play();
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
		setTimeout(function(){
			$scope.$apply(function(){
				$scope.isTaken = true;
			});
		})
		$(c).removeAttr("data-caman-id");
		$scope.changeToAction("filter");

		$scope.hideProcessingLoading();
	}

	var loadDataURLToImage = function(dataURL, method, callback) {
		var image = new Image();
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
        
        stopRecord();
		setTimeout(function() {
			$scope.$apply(function() {
				$scope.isLastTaken = false;
				$scope.isWaitForTake = false;
				$scope.isTaken = false;
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


	// Wait until the video stream can play
	v.addEventListener('canplay', function(e) {
		if (!isStreaming) {
			calculateFrameSize();

			// videoWidth isn't always set correctly in all browsers
			// if (v.videoWidth > 0) {

			//      h = v.videoHeight / (v.videoWidth / w);
			// }

			c.setAttribute('width', w);
			c.setAttribute('height', h);
			// Reverse the canvas image
			ctx.translate(w, 0);
			ctx.scale(-1, 1);
			isStreaming = true;
		}

		setTimeout(function() {
			$scope.$apply(function() {
				$scope.isReady = true;
				$scope.isWaitForTake = true;
				$scope.isTaken = false;
				$scope.isLastTaken = true;
			})
		})
	}, false);


	// Wait for the video to start to play
	v.addEventListener('play', function() {
		startRecord();
	}, false);


	var takePhoto = function() {
		var dataURL = c.toDataURL();
		// r.src = dataURL;
		stopRecord();
		snapshoot = false;
		setTimeout(function() {
			$scope.$apply(function() {
				$scope.isWaitForTake = false;
				$scope.isLastTaken = true;
				$scope.isTaken = true;
			});
			$(c).removeAttr("data-caman-id");
			$scope.changeToAction("filter");
		})
	}

	$scope.takePhoto = function() {
		snapshoot = !snapshoot;
	};


	$scope.onFileSelect = onFileSelect;
	$scope.startUpload = startUpload;
	$scope.startWebcam = startWebcam;
	$scope.retakePhoto = function() {
		setTimeout(function() {
			
			if ($scope.isLastTaken) {
				startRecord();
			}

			$scope.$apply(function() {
				$scope.isWaitForTake = $scope.isLastTaken;
				$scope.isTaken = false;
			});
			$scope.changeToAction("takePicture");
		})
	}

	$scope.decidedPhoto = function() {
		console.log("go to edit... ....");

	}

	$scope.$on('handleBroadcast', function() {

		message = SharedService.message;
		if (/^startWebcam/i.test(message)) {
			startWebcam();

		}

		if (/^startUpload/i.test(message)) {
			clearWebcam();
			startUpload();

		}
		console.log("[WebcamCtrl] <-- " + message);
	});
})