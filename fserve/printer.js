var fs = require('fs');
var util = require('util');
var url = require('url');
var PDFDocument = require('pdfkit');
var path = require('path');
var f = require('fabric');
var __fabric = global.fabric = f.fabric;
__fabric.Object.prototype.transparentCorners = false;
var fontLoader = require('./font');

var printer = {
    config: {},
    identify: "KEdit_App_Printer_Server",

    init: function(config) {
        this.config = config;
    },

    handler: function(params, callback) {
        var self = this;
        if (this.config.use_direct_png_file) {
            if (!params.template_path || !params.user_picture_path) {
                var message = !params.template_path ? 'invalid template path - ': '';
                message += !params.user_picture_path ? 'invalid picture path': '';
                callback(false, message);
                return;
            }
        } else {
            if (!params.json || !params.template_path) {
                var message = !params.template_path ? 'invalid template path - ': '';
                message += !params.json ? 'invalid json path': '';
                callback(false, message);
                return;
            }
        }

        this._blend(params, function(canvas, error) {
            if (error) {
                if (callback) callback(false, error);
                return;
            }
            self._toPDF(params, canvas, callback);
        });
    },

    _applyFont: function(canvas) {
        fonts = fontLoader.load();
        fonts.forEach(function(f) {
            var font = new canvas.Font(f.family, f.path);
            f.faces.forEach(function(options) {
                font.addFace(options.path, options.weight, options.decoration);
            });
            //canvas.contextContainer.addFont(font);
            canvas.contextTop.addFont(font);
        });
    },

    _load: function(params, callback) {
        var self = this;
        var w = this.config.edit_area_width;
        var h = this.config.edit_area_height;
        var json = params.json;
        var content = __fabric.createCanvasForNode(w, h);
        self._applyFont(content);

        content.loadFromJSON(json, function() {
            content.forEachObject(function(obj) {
                var setCoords = obj.setCoords.bind(obj);
                obj.on({
                    moving: setCoords,
                    scaling: setCoords,
                    rotating: setCoords
                });
            });
            content.renderAll();
            content.deactivateAll();

            if (callback) callback(content);
        });
    },

    _content: function(params, callback) {
        var self = this;
        var _ready = function(canvas, error) {
            if (error) {
                self._error({
                    message: 'fail for load content.',
                    error: error
                });
                return;
            }

            try {
                var dataURL = canvas.toDataURL({
                    format: 'png',
                    multiplier: self.config.multiplier
                });

                __fabric.Image.fromURL(dataURL, function(image) {
                    canvas.centerObject(image);
                    if (callback) callback(image);
                });
            } catch (e) {
                var error = {
                    message: 'cannot export content to png image.',
                    error: e
                };
                if (callback) callback(null, error);
            }
        }
        self._load(params, _ready);
    },
    _direct_content: function(params, callback) {
     var dataURL = params.user_picture_path;
        __fabric.Image.fromURL(dataURL, function(image) {
            if (callback) callback(image);
        });
    },
    _template: function(params, callback) {
        var self = this;
        var src = params.template_path;

        var onload = function(image) {
            var templateHeight = self.config.template_height;
            image.scaleToHeight(templateHeight);
            image.setCoords();
            if (callback) callback(image);
        }

        try {
            __fabric.util.loadImage(src, function(image) {
                onload(new __fabric.Image(image));
            });
        } catch (e) {
            var error = {
                message: 'cannot load template image.',
                error: e
            };
            if (callback) callback(null, error);
        }

    },


    _blend: function(params, callback) {
        var self = this;

        var w = this.config.template_width;
        var h = this.config.template_height;
        var canvas = __fabric.createCanvasForNode(w, h);
        canvas.backgroundColor = 'rgba(255, 255, 255, 0.0)';
        canvas.selection = false;
        canvas.renderAll();

       
        self._template(params, function(background, error) {
            if (error) {
                if (callback) callback(null, error);
                return;
            }

            var content_fetcher = self.config.use_direct_png_file 
                        ? self._direct_content
                        : self._content;

            content_fetcher(params, function(content, error) {
                if (error) {
                    if (callback) callback(null, error);
                    return;
                }

                var contentHeight = self.config.edit_area_height;
                content.scaleToHeight(contentHeight);

                var left = w / 2 + content.width / 2;
                var top = h / 2 + content.height / 2;


                content.set({
                    originX: 'center',
                    originY: 'center',
                    top: top,
                    left: left,
                    scaleX: 0.8,
                    scaleY: 0.8,
                    selectable: false
                });

                canvas.add(content);
                canvas.centerObject(background);
                canvas.setBackgroundImage(background,
                    canvas.renderAll.bind(canvas), {
                        crossOrigin: 'anonymous'
                    });
                setTimeout(function() {
                    if (callback) callback(canvas);
                }, 100);
            });
        });
    },

    _toPDF: function(params, canvas, callback) {
        var outpath = params.outpath;
        var temppath = params.temppath;

        var outstream = fs.createWriteStream(temppath);
        var stream = canvas.createPNGStream();
        
        var w = this.config.template_width;
        var h = this.config.template_height;
        console.log("content w:h => " + w + ":" + h);

        
        var toPDFHandler = function(){
            // A4: [595.28, 841.89],
            // DEFAULT_MARGINS = {
            //   top: 72,
            //   left: 72,
            //   bottom: 72,
            //   right: 72
            // };
            // unit: point (1 inch = 72 point)
            var size = [892.9152, 1295.4312];
            var doc = new PDFDocument({
                size: size,
                layout: 'portrait'
            });
            try {
                console.log("== start print pdf ==");
                console.log("== temp image path: ");
                console.log(temppath);
                doc.pipe(fs.createWriteStream(outpath));
                doc.image(temppath, 17, 29.76, {
                        width: size[0] - 17 * 2 
                               // scaleToWidth: 
                               // = page width - (margin left * 2)
                    }
                );
                doc.end();
                console.log("== end print image ==");
                callback(outpath);
            }catch(e) {
                 callback(false, 'export pdf fail.' + e);
            }
        }


        stream.on('data', function(chunk) {
            outstream.write(chunk);
        });
        stream.on('end', function() {
            outstream.end();
            setTimeout(function(){
                toPDFHandler();
            }, 100);
        });
        stream.on('error', function(err) {
            callback(false, 'export png fail.');
            outstream.end();
        });
    },

    _error: function(error) {

    }
}

exports.setup = function(config) {
    printer.init(config);
}
exports.handler = function(params, callback) {
    printer.handler(params, callback);
}