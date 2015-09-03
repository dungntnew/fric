    /* @region - camera */
    var webcamHandler = {
        init: function(options) {
            this.options = options || {};
            this.window = options['window'] || {};
            this.scope = options['scope'] || {};
            this.callback = options['done'] || function(e) {};
            this.fail = options['fail'] || function(e) {};

            this.video = $(this.options['videoId'])[0];
            this.canvas = $(this.options['canvasId'])[0];
            if (!this.video || !this.canvas) {
                this.fail('cannot init module with videoId: ' + this.options['videoId'] + ' - canvasId: ' + this.options['canvasId']);
                return;
            }
            this.isWebcamReady = false;
            this.isStreaming = false;

            this.isStreaming = false;
            this.webcamInterval = null;
            this.isWebcamInitizalied = false;
            var self = this;
            var setFrameSize = function() {
                var size = self.scope.calculateFrameSize(this.canvas);
                $(self.canvas).width(size.width);
                $(self.canvas).height(size.height);
                var videoWidth = self.video.videoWidth;
                var videoHeight = self.video.videoHeight;
                var widthToHeight = videoWidth / videoHeight;
                self.video.videoHeight = self.canvas.height;
                self.video.videoWidth = widthToHeight * self.canvas.Height;

                return size;
            }
            var size = setFrameSize();
            angular.element(this.window).bind('resize', setFrameSize);


            this.video.addEventListener('canplay', function(e) {
                if (!self.isStreaming) {
                    var videoWidth = self.video.videoWidth;
                    var videoHeight = self.video.videoHeight;
                    var widthToHeight = videoWidth / videoHeight;
                    self.video.videoHeight = self.canvas.height;
                    self.video.videoWidth = widthToHeight * self.canvas.Height;

                    var ctx = self.canvas.getContext('2d');
                    self.isStreaming = true;
                }
                self.isWebcamReady = true;
            }, false);
            this.video.addEventListener('play', function(e) {
                self.begin();
            }, false);
            this.isWebcamInitizalied = true;
        },
        start: function() {
            this.cleanup(); /* -- clean-up before new session */

            navigator.getUserMedia =
                navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

            if (!navigator.getUserMedia) {
                this.startWebcamFail(null);
                return;
            }
            var self = this;
            navigator.getUserMedia({
                    video: true,
                    audio: false
                },
                function(stream) {
                    self.stream = stream;
                    var url = window.URL || window.webkitURL;
                    self.video.src = url ? url.createObjectURL(stream) : stream;
                    self.video.play();
                },
                this.fail　
            );
        },
        fail: function(error) {},
        begin: function() {
            var video = this.video;
            var canvas = this.canvas;
            var w = canvas.width;
            var h = canvas.height;
            var ctx = canvas.getContext('2d');
            canvas.width = 320;
            canvas.height = 240;

            console.log("video w: " + video.videoWidth + " x " + video.videoHeight);
            this.webcamInterval = setInterval(function() {
                if (video.paused || video.ended) return;
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(video, 0, 0, 320, 240);
            }, 33);
        },
        take: function() {
            if (this.webcamInterval) {
                clearInterval(this.webcamInterval);
            }

            if (this.callback) {
                var canvas = this.canvas;
                var canvasId = this.options['canvasId'];
                this.callback(canvas, canvasId);
            }
        },
        cleanup: function() {
            if (!this.isWebcamInitizalied)
                return;
            this.video.src = "";
            if (self.stream) {
                self.stream.stop();
            }
        },
        clear: function() {
            if (!this.isWebcamInitizalied)
                return;

            this.video.src = "";
            if (self.stream) {
                self.stream.stop();
            }
            if (this.webcamInterval) {
                clearInterval(this.webcamInterval);
            }
            var w = this.canvas.width;
            var h = this.canvas.height;
            var ctx = this.canvas.getContext('2d');
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(this.video, 0, 0, w, h);
        }

    }