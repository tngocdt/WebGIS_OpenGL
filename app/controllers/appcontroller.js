import fs from 'node:fs';
import path from 'node:path';
import  XML_HttpRequest from "xmlhttprequest";
import * as dbcurd from'../../public/js/dbcrud.js';
import os from "node:os";

var hostname = os.hostname();
var XMLHttpRequest = XML_HttpRequest.XMLHttpRequest;

const signup = function (req, res) {
	if (req.session.username) {
		res.redirect('/home');
	} else {
		res.render('signup', {
			error: req.flash("error"),
			success: req.flash("success"),
			session: req.session
		});
	}
};

const login = function (req, res) {
	
	if (req.session.username) {
		console.log("appcontroller - exports.login: ", req.session.username);
		res.redirect('/');	// or res.redirect('/home')
	} else {
		console.log("appcontroller - exports.login: ", req.session.username);
		res.render('login', {
			error: req.flash("error"),
			success: req.flash("success"),
			session: req.session
		});
	}
};

const loggedIn = function (req, res, next) {
	console.log("appcontroller - exports.loggedIn: ", req.session.username);
	if (req.session.username) { // req.session.passport._id
		next();
	} else {
		res.redirect('/login');
	}
};

// exports.openui5index = function (req, res) {
// 	// see https://stackoverflow.com/questions/45464011/nodejs-mssql-query-returning-double-data-in-both-recordsets-and-recordset?rq=1
// 	res.render('openui5index');
// };

const home = function (req, res) {
	console.log('This is home GET: ' + JSON.stringify(req.body));
	res.render('index', {
		data: {
			strReturnedValue: "",
		}
	});
	/*
	// see https://stackoverflow.com/questions/45464011/nodejs-mssql-query-returning-double-data-in-both-recordsets-and-recordset?rq=1
	if (fs.existsSync('tempdata.txt')) {
		fs.readFile('tempdata.txt', 'utf8', function (err, data) {
			if (err) throw err;
			var idata = JSON.parse(data);

			var promise = dbcurd.AcessSectorGroup();
			promise.then(function (result) {
				var njsdata = JSON.parse(JSON.stringify(result.recordset).replace(/"\s+|\s+"/g, '"'));
				res.render('MainPage', {
					dataSectorGroup: njsdata,
					dataKBStatus: null
				});
			}).catch(function (err) {
				console.log(err);
			});

			// res.render('MainPage');
		});
	} else {
		res.render('MainPage', {
			data: {}
		});
	}
	*/
};

const homePost = function (req, res) {
	console.log('This is home POST: ' + JSON.stringify(req.body));

	var strSearchedValue = req.body.nmSearchValue;
	var promise = dbcurd.GeoLiveSearch(strSearchedValue);
	promise.then(function (result) {
		// console.log(result.rows);
		var njsdata = JSON.parse(JSON.stringify(result.rows).replace(/"\s+|\s+"/g, '"'));
		// console.log("api_geoserver_livesearch: " + JSON.stringify(njsdata));

		var rltData = "";
		for (var i = 0; i < njsdata.length; i++) {
			var itemData = njsdata[i];
			// console.log(itemData);
            var link_data = "<a onclick='FindLocation(" + itemData['x'] + "," + itemData['y'] + "," + itemData['longitude'] + "," + itemData['latitude'] + ")'>here</a>";
			// var link_data = "<a onclick='FindLocation(" + itemData['x'] + "," + itemData['y'] + ")'>here</a>";
			rltData += "Hien Trang: " + itemData["ttxd"]
                    + " - Dien Tich: " + itemData["shape_area"]
					+ " " + link_data + "</br>"
        }

		// console.log(rltData);
		// console.log('This is home POST: ' + rltData);
		res.render('index', {
			data: {
				strReturnedValue: rltData,
			}
		});

	}).catch(function (err) {
		console.log(err);
	});
};

export { home, homePost, login, loggedIn, signup }