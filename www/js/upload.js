var uploaderHandler = {
    init: function(options) {
        this.options = options || {};
        this.window = options['window'] || {};
        this.scope = options['scope'] || {};
        this.callback = options['done'] || function() {};
        this.fail = options['fail'] || function(e) {};
        this.onBegin = options['onBegin'] || function() {};
        this.onEnd = options['onEnd'] || function() {};

        this.options = options;
        this.initizalied = false;

        this.input = $(options['inputId'])[0];
        if (!this.input) {
            this.onFail('cannot init module with id: ' + options['inputId']);
            return;
        }
        this.initizalied = true;
    },

    start: function() {
        if (!this.initizalied) {
            this.onFail('please init module before use this function!');
            return;
        }
        if (!window.File || !window.FileReader || !window.FormData) {
            this.onFail('your browser do not support file upload!');
            return;
        }
        var self = this;
        var _handler = function(e) {
            var file = e.target.files[0];
            if (!file || !/^image\//i.test(file.type)) {
                self.onFail('please select valid image file!');
                return;
            }
            self._process(file);
            self.onBegin();
        };

        if (window.addEventListener) {
            this.input.addEventListener('change', _handler, false);
        } else if (window.attachEvent) {
            this.input.attachEvent("onchange", _handler);
        } else {
            this.onFail('your browser do not support file upload!');
        }
    },
    onBegin: function() {},
    onEnd: function() {},
    onFail: function(error) {},

    _process: function(file) {
        self = this;
        try {

            var dataURL = window.URL.createObjectURL(file);
            if (self.callback) {
                self.callback(dataURL, function() {
                    URL.revokeObjectURL(dataURL)
                });
            }
            self.onEnd();
        } catch (e) {
            try {
                var fileReader = new FileReader();
                fileReader.onload = function(event) {
                    var dataURL = event.target.result;
                    if (self.callback) {
                        self.callback(dataURL, function() {
                            dataURL = null;
                        });
                    }
                    self.onEnd();
                };
                fileReader.readAsDataURL(file);
            } catch (e) {
                self.onFail('your browser do not support file upload!');
                self.onEnd();
            }
        }
    }
}