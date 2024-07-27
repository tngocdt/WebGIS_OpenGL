import fs from 'node:fs';
import path from 'node:path';
import * as dbcurd from'../../public/js/dbcrud.js';

import querystring from 'node:querystring';
import jsonata from "jsonata";
import http from "node:http";


const api_getlayerstyle = function (req, res) {
	var strSectorLine = req.query.SectorLine;
	// var station = req.query.Station;
	// var strRaspiHostName = "RasPi_" + station;
	// var strEspHostName = "ESP_" + station;

	var promise = dbcurd.AccessLineStation(strSectorLine);
	promise.then(function (result) {
		var njsdata = JSON.parse(JSON.stringify(result.recordset).replace(/"\s+|\s+"/g, '"'));
		// console.log(JSON.stringify(njsdata))
		// var nestednjsdata = convertWorkStationMap(njsdata);

		// End of HTTP Request to ESP8266 WebServer
		// ***************************************************************************			

		res.send(njsdata);
	}).catch(function (err) {
		console.log(err);
	});
};

const api_geoserver_url = function (req, res) {
	console.log("Call OpenLayer Geoserver API Url From *api_geoserver_url*");
	var url = req.url;
	var findQuestionLoc = url.indexOf("?");
    console.log("*api_geoserver_url* - findQuestionLoc: " + findQuestionLoc);
    console.log("*api_geoserver_url* - url.length: " + url.length);
    var paras = url.substring(findQuestionLoc + 1);

	url = "http://localhost:9999/geoserver/WebGISDBdev/wms?" + paras;
	var promise = fetch(url, {
			// method: 'GET',		
			// headers: {
			// 	'Content-type' : 'application/json',
			// 	'Access-Control-Allow-Origin': 'http://localhost:1024',
			// 	'Access-Control-Allow-Credentials': 'true',
			// 	'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
			// 	}
			}
		)
		.then(async res => {
			var rtndata = await res.text();
			if (!res.ok) {
				throw new Error(`HTTP error! Status: ${res.status}`);
			}
			
			return rtndata;
		})
		.catch(error => console.log(error));

	promise.then(function (result) {
		var njsdata = result;

		// console.log(njsdata);
		res.send(njsdata);
	}).catch(function (err) {
		console.log(err);
	});
};

const api_geoserver_livesearch = function (req, res) {
	var strSearchedValue = req.query.strSearchedValue;
	console.log("Call OpenLayer Geoserver Live Search From *api_geoserver_livesearch* By strSearchedValue: *" + String(strSearchedValue) + "*");
	
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
		res.send(rltData);
	}).catch(function (err) {
		console.log(err);
	});
};

export { api_getlayerstyle, api_geoserver_url, api_geoserver_livesearch }