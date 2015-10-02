
var fs = require('fs');
var path = require('path');
var mysql  = require('mysql');

var config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json'), 'utf8'));


var mysql  = require('mysql');


var fetch_order_info = function(order_id, callback) {
	var connection = mysql.createConnection({
	  host     : config.db_host,
	  port     : config.db_port,
	  user     : config.db_user,
	  password : config.db_password,
	  database : config.db_name
	});
	connection.connect();

	var query = 'SELECT order_id, customer_id';
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

fetch_order_info(1, function(r, e){
	if (e) {
		console.log("error: " + e);
		return;
	}

	console.log("order id: "+ r.order_id);
	console.log("customer id: " + r.customer_id);
});
