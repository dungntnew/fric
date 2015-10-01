var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var printer = require('./printer');


var config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json'), 'utf8'));

printer.setup(config);


app.get('/', function (req, res) {
  res.send('api alive!');
});

app.get('/info', function (req, res) {
  res.json(config);
});

var handler_error = function(res, message, error, variable) {
	var message = ''
	var reply =  {
		status: false,
		message: message,
		error: error,
		variable: variable
	}
	res.json(reply);
}

app.get('/json', function(req, res){

	var inpath = path.resolve(__dirname, 'json_data.json');
	var outpath = path.resolve(__dirname, 'outfile.png');
	
	var printerHandler = function(success, err) {
		// handle printer error.
		if (!success || err) {
			return handler_error(res, 
				config.ERR_EXPORT_PNG, 
				err
			);
		}

		res.json({
			status: true,
			message: 'export finish png',
			error: null,
			data: outpath 
		});
	};

	fs.readFile(inpath, 'utf8', function(err, json){
		
		// handle load json fail error.
		if (err) {
			return handler_error(res, 
				config.ERR_LOAD_JSON, 
				err,
				inpath
			);
		}
        
        // build params for printer
		var params = {
			json: json,
			template_path: 'http://fabricjs.com/assets/logo.png',
			outpath: outpath
		};

		// start printer module
		printer.handler(params, printerHandler);
	});

});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


