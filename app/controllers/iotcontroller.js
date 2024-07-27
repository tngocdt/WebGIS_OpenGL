var fs = require('fs');
var path = require('path');
var dbcurd = require('../../public/js/dbcrud');

// exports.api_kittinglocs = function(req, res) {
// 	var promise = dbcurd.locations(req.query.Line,req.query.Model);
// 		promise.then(function(result){
// 			res.send(result.recordset);
// 		}).catch(function(err){
// 			console.log(err);
// 		});
// };
var db = [];

exports.api_kittinglocs = function(req, res) {
	res.render('esp8266index');	
};

exports.api_kittinglocsget = function(req, res) {
	res.end(JSON.stringify(db));
	db = [];
};

exports.api_kittinglocsupdate = function(req, res) {
	var newData = {
		temp: queryData.temp,
		humd: queryData.humd,
		time: new Date()
	};
	db.push(newData);
	console.log(newData);
	response.end();
};