var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
	extended: true
})); // support encoded bodies

var fs = require('fs');
var path = require('path');
var printer = require('./printer');
var mysql = require('mysql');



var config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json'), 'utf8'));

printer.setup(config);


app.get('/', function(req, res) {
	res.send('api alive!');
});

app.get('/info', function(req, res) {
	res.json(config);
});

var handler_error = function(res, message, error, variable) {
	var message = ''
	var reply = {
		status: false,
		message: message,
		error: error,
		variable: variable
	}
	res.json(reply);
}

var fetch_order_info = function(order_id, callback) {
	var connection = mysql.createConnection({
		host: config.db_host,
		port: config.db_port,
		user: config.db_user,
		password: config.db_password,
		database: config.db_name
	});
	connection.connect();

	var query = 'SELECT plg_kedit_json_path as json_path';
	query += ',plg_kedit_user_picture_path as user_picture_path';
	query += ',plg_kedit_tpl_path as template_path';
	query += ' FROM dtb_order';
	query += ' WHERE order_id=' + order_id;
	query += ' LIMIT 1';


	connection.query(query, function(err, rows, fields) {
		if (err) {
			callback(null, err);
			return;
		}

		if (rows.length == 0) {
			callback(null, 'not found order for order_id' + order_id);
			return;
		}
		callback(rows[0]);
	});
	connection.end();
}

app.get('/api/export/:order_id', function(req, res) {


	var order_id = req.params['order_id'];
	var use_json = !config.use_direct_png_file;

	fetch_order_info(order_id, function(order, err) {
		if (err) {
			return handler_error(res,
				config.ERR_LOAD_ORDER,
				err
			);
		}

		var json_path = order.json_path;
		var user_picture_path = order.user_picture_path;
		var export_dir = path.dirname(use_json ? json_path : user_picture_path);
		var export_name = path.basename(use_json ? json_path : user_picture_path, use_json ? '.json': '.png');
		var export_path = path.resolve(export_dir, export_name + '.png');


		if (use_json) {
			fs.readFile(json_path, 'utf8', function(err, json) {
				if (err) {
					return handler_error(res,
						config.ERR_LOAD_JSON,
						err,
						json_path
					);
				}
				var params = {
					json: json,
					template_path: order.template_path,
					outpath: export_path
				};
				printer.handler(params, printerHandler);
			});
		} else {
			var params = {
				user_picture_path: user_picture_path,
				template_path: order.template_path,
				outpath: export_path
			};
			printer.handler(params, printerHandler);
		}
	});

	var printerHandler = function(export_path, err) {
		// handle printer error.
		if (!export_path || err) {
			return handler_error(res,
				config.ERR_EXPORT_PNG,
				err
			);
		}

		res.json({
			status: true,
			message: 'export finish png',
			error: null,
			data: export_path
		});
	};
});


var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});