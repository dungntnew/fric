var uploaderHandler = {
    init: function(options) {
        this.options = options || {};
        this.callback = options['done'] || function() {};
        this.fail = options['fail'] || function(e) {};
        this.options = options;
        this.initizalied = false;

        this.input = $(options['inputId'])[0];
        if (!this.input) {
            this.onFail('cannot init module with id: ' + options['inputId']);
            return;
        }
        this.register();
        this.initizalied = true;
    },
    register: function() {
        if (!window.File || !window.FileReader || !window.FormData) {
            this.onFail('your browser do not support file upload!');
            return;
        }
        var self = this;

        var _load = function (file, options) {
            if (!loadImage(
                    file,
                    function(img) {
                        if (!(img.src || img instanceof HTMLCanvasElement)) {
                            self.onFail('Loading image file failed');
                        } else {
                            if (self.callback) {
                                var dataURL = img.src || img.toDataURL();
                                self.callback(dataURL, img);
                            }
                        }
                    },
                    options
                )) {
                self.onFail('Your browser does not support the URL or FileReader API');
            }
        };

        var _handler = function(e) {
            e.preventDefault();
            e = e.originalEvent;
            var target = e.dataTransfer || e.target,
                file = target && target.files && target.files[0],
                options = {
                   maxWidth: 600,
                   maxHeight: 300,
                   minWidth: 100,
                   minHeight: 50,
                   canvas: false
                };
            if (!file) {
                return;
            }

            loadImage.parseMetaData(file, function (data) {
                if (data.exif) {
                    options.orientation = data.exif.get('Orientation');
                }
                _load(file, options);
            });
        };        
        $(this.input).on('change', _handler);
    },
    onFail: function(error) {}
}