var PDFDocument = require('pdfkit');
var fs = require('fs');

var pdfPath = './file.pdf';
var imagePath = './ex.png';
var w = 320;
var h = 240;

var stream = fs.createWriteStream(pdfPath);
var doc = new PDFDocument();
doc.pipe(stream);

stream.on('finish', function(){
   console.log('done');
});

doc.image(imagePath, w, h, [100, 100]);

doc.end();

