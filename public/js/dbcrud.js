// see https://www.npmjs.com/package/mssql

// Initialize the mssql package
var sqlDb = require('../../node_modules/mssql');
var config = require('../../config/database');

// Initialize the pg package in your Node.js script and get the Client from it.
const { Client } = require('pg');   // run "npm i pg"

exports.executeSql = function (sql, callback) {

    var conn = new sqlDb.ConnectionPool(config.dbmssql_config);
    conn.connect().then(function () {

        var req = new sqlDb.Request(conn);
        req.query(sql).then(function (resultSet) {
            conn.close();
            callback(resultSet);
        }).catch(function (error) {
            console.log(error);
            callback(null, error);
        });
    }).catch(function (error) {

        console.log(error);
        callback(null, error);
    });
};

function sqlFunction(sql, callback) {
    // console.log(config.dbmssql_config);

    var conn = new sqlDb.ConnectionPool(config.dbmssql_config);
    conn.connect().then(function () {

        var req = new sqlDb.Request(conn);
        req.query(sql).then(function (resultSet) {
            conn.close();
            callback(resultSet);
        }).catch(function (error) {
            console.log(error);
            callback(null, error);
            conn.close();
        });
    }).catch(function (error) {
        console.log(error);
        callback(null, error);
        conn.close();
    });
}

function sqlFunctionPostgres(sql, callback) {
    // console.log(config.dbpostgres_config);

    const client = new Client(config.dbpostgres_config);
    client.connect().then(function () {
        // console.log('Connected to PostgreSQL Database: ', sql);

        // Execute SQL queries here

		client.query(sql, (err, result) => {
			if (err) {
				console.error('Error Executing Query: ', err);
			} else {
				// console.log('sqlFunctionPostgres - Query Result:', result.rows);
                callback(result);
			}

			// Close the connection when done
			client.end().then(() => {
				// console.log('Connection to PostgreSQL Closed Successfully');
			})
			.catch((err) => {
				console.error('Error Closing Connection', err);
			});
		});
    }).catch(function (error) {
        console.log(error);
        callback(null, error);
        // Close the connection when done
		client.end().then(() => {
			// console.log('Connection to PostgreSQL Closed Error');
		})
		.catch((err) => {
			console.error('Error Closing Connection', err);
		});
    });
}

// exports.list = function (req, resp) {
//     db.executeSql("SELECT * FROM customer", function (rows, error) {
//         if (err)
//             console.log("Error Selecting : %s ", err);

//         resp.render('customers', {
//             page_title: "Customers - Node.js",
//             data: rows
//         });

//     });
// };

// exports.add = function (req, resp) {
//     resp.render('add_customer', {
//         page_title: "Add Customers - Node.js"
//     });
// };

// exports.edit = function (res, resp) {
//     var id = req.params.id;
//     db.executeSql("SELECT * FROM customer WHERE id=" + id, function (rows, error) {

//         if (err)
//             console.log("Error Selecting : %s ", err);

//         res.render('edit_customer', {
//             page_title: "Edit Customers - Node.js",
//             data: rows
//         });
//     });

// }
// exports.save = function (req, res) {

//     var input = JSON.parse(JSON.stringify(req.body));
//     var data = {

//         name: input.name,
//         address: input.address,
//         email: input.email,
//         phone: input.phone

//     };
//     db.executeSql("INSERT INTO customer set ? ", data, function (rows, error) {

//         if (err)
//             console.log("Error inserting : %s ", err);

//         res.redirect('/customers');

//     });


// };

// exports.save_edit = function (req, res) {
//     var input = JSON.parse(JSON.stringify(req.body));
//     var id = req.params.id;
//     var data = {

//         name: input.name,
//         address: input.address,
//         email: input.email,
//         phone: input.phone

//     };
//     db.executeSql("UPDATE customer set ? WHERE id = ? ", [data, id], function (rows, err) {

//         if (err)
//             console.log("Error Updating : %s ", err);

//         res.redirect('/customers');

//     });
// };

// exports.delete_customer = function (req, res) {

//     var id = req.params.id;

//     db.executeSql("DELETE FROM customer  WHERE id = ? ", id, function (err, rows) {

//         if (err)
//             console.log("Error deleting : %s ", err);

//         res.redirect('/customers');
//     });
// };

// exports.LocationsByOneStations = function (strRaspiHostName, strEspHostName) {
//     return new Promise(function (resolve, reject) {
//         sqlFunction("SELECT TOP(64) EspClientHostName as EspHostName" +
//             ", WorkStationLocationBinID as MaterialsBin" +
//             ", KANBANLevelID as LEDStatus" +
//             ", ArduinoPinID" +
//             ", ArduinoPinStatusID" +
//             " FROM vIoTKANBANControl WITH (NOLOCK)" +
//             " WHERE EspClientHostName = '" + strEspHostName + "'" +
//             " AND RasPiNodejsServerHostName = '" + strRaspiHostName + "'" +
//             " ORDER BY EspHostName",
//             function (rows, err) {
//                 if (err) return reject(err);
//                 // console.log("Promise " + "\n" + rows + "\n\n" + "------------\n");
//                 resolve(rows);
//             });
//     }).catch(function (err) {
//         console.log(err);
//     });
// };

// exports.LocationsByMultiStations = function (RaspiHostName, EspHostName) {
//     return new Promise(function (resolve, reject) {
//         sqlFunction("SELECT TOP(64) EspClientHostName as EspHostName" +
//             ", WorkStationLocationBinID as MaterialsBin" +
//             ", KANBANLevelID as LEDStatus" +
//             ", ArduinoPinID" +
//             ", ArduinoPinStatusID" +
//             " FROM vIoTKANBANControl WITH (NOLOCK)" +
//             " WHERE WorkStationLocation LIKE '%HH01%'" +
//             " ORDER BY EspHostName",
//             function (rows, err) {
//                 if (err) return reject(err);
//                 // console.log("Promise " + "\n" + rows + "\n\n" + "------------\n");
//                 resolve(rows);
//             });
//     }).catch(function (err) {
//         console.log(err);
//     });
// };

// exports.KANBANStatusByLine = function (line) {
//     return new Promise(function (resolve, reject) {
//         sqlFunction("SELECT * FROM vIoTKANBANShow WITH (NOLOCK)" +
//             " WHERE WorkStationLocation LIKE '" + line + "%'" +
//             " AND CurrentPONumber <> 'NONE'" +
//             " ORDER BY WorkStationLocation",
//             function (rows, err) {
//                 if (err) return reject(err);
//                 // console.log("Promise " + "\n" + rows + "\n\n" + "------------\n");
//                 resolve(rows);
//             });
//     }).catch(function (err) {
//         console.log(err);
//     });
// };

// exports.ArduinoPins = function () {
//     return new Promise(function (resolve, reject) {
//         sqlFunction("SELECT TOP(64) ArduinoPinID" +
//             " FROM IoTArduinoPinControl WITH (NOLOCK)",
//             function (rows, err) {
//                 if (err) return reject(err);
//                 // console.log("Promise " + "\n" + rows + "\n\n" + "------------\n");
//                 resolve(rows);
//             });
//     }).catch(function (err) {
//         console.log(err);
//     });
// };

// exports.locs = function (query) {

//     var config = {
//         user: 'eleanAIms',
//         password: 'ele@nAIms*1024',
//         server: 'ELEANAIMS',
//         port: 1433,
//         database: 'ETEMPDB'
//     };

//     return sqlDb.connect(config).then(function () {
//         var request = new sqlDb.Request();
//         // Return the Promise object that will contain the result of 
//         // the query when resolved
//         return request.query(query);
//     });
// };

exports.FindCorrectUserNPassword = function (username, password) {
    return new Promise(function (resolve, reject) {
        sqlFunctionPostgres("SELECT \"UserID\", \"UserName\", \"UserEmail\" FROM \"01_WebGIS_User\"" +
            " WHERE \"UserName\" ='" + username + "'" +
            " AND \"UserPassword\" ='" + password + "'" +
            " LIMIT 1",
            function (rows, err) {
                if (err) return reject(err);
                // console.log("Promise " + "\n" + rows + "\n\n" + "------------\n");
                resolve(rows);
            });
    }).catch(function (err) {
        console.log(err);
    });
};

exports.FindUser = function (username) {
    return new Promise(function (resolve, reject) {
        sqlFunctionPostgres("SELECT \"UserID\", \"UserName\", \"UserEmail\" FROM \"01_WebGIS_User\"" +
            " WHERE \"UserName\" ='" + username + "' LIMIT 1",
            function (rows, err) {
                if (err) return reject(err);
                // console.log("Promise " + "\n" + rows + "\n\n" + "------------\n");
                resolve(rows);
            });
    }).catch(function (err) {
        console.log(err);
    });
};

exports.GeoLiveSearch = function (strSearchedValue) {
    return new Promise(function (resolve, reject) {
        var strSearchedQuery = "SELECT *, st_x(ST_Centroid(geom)) as X, st_y(ST_Centroid(geom)) as Y, " +
                                "ST_X(ST_Transform(ST_SetSRID(ST_AsText(ST_Centroid(geom)),3405),3857)) As Longitude, " +
                                "ST_Y(ST_Transform(ST_SetSRID(ST_AsText(ST_Centroid(geom)),3405),3857)) As Latitude FROM public.house" +
                                " WHERE sogcn LIKE '" + strSearchedValue + "%' Limit 5";
        // console.log(strSearchedQuery);
        sqlFunctionPostgres(strSearchedQuery,
            function (rows, err) {
                if (err) return reject(err);
                // console.log("Promise " + "\n" + rows + "\n\n" + "------------\n");
                // var result = JSON.parse(JSON.stringify(rows.rows).replace(/"\s+|\s+"/g, '"'));
                // console.log(result.length);
                // for (var i = 0; i < result.length; i++) {
                //     $link = "<a href='javascript:void();' onclick='di_den_diem(" + result['x'] + "," + result['y'] + ")'>here</a>";
                // }
                resolve(rows);
            });
    }).catch(function (err) {
        console.log(err);
    });
};

// exports.FindArduinoPin = function (strLocation) {
//     return new Promise(function (resolve, reject) {
//         sqlFunction("SELECT TOP (1) ArduinoPinID FROM IoTArduinoLocationBinStatusMatrix WHERE WorkStationLocationBinID IN"
//             + " (SELECT TOP(1) WorkStationLocationBinID  FROM IoTWorkStationLocationControl" +
//             " WHERE WorkStationLocation ='" + strLocation + "')",
//             function (rows, err) {
//                 if (err) return reject(err);
//                 // console.log("Promise " + "\n" + rows + "\n\n" + "------------\n");
//                 resolve(rows);
//             });
//     }).catch(function (err) {
//         console.log(err);
//     });
// };

// exports.AcessSectorGroup = function () {
//     return new Promise(function (resolve, reject) {
//         sqlFunction("SELECT DISTINCT SectorGroup,CurrentPO FROM TrackingCurrentPOStatus WITH (NOLOCK)", function (rows, err) {
//             if (err) return reject(err);
//             // console.log("Promise " + "\n" + rows + "\n\n" + "------------\n");
//             resolve(rows);
//         });
//     }).catch(function (err) {
//         console.log(err);
//     });


//     // return new Promise(function (resolve, reject) {
//     //     setTimeout(function () {
//     //         console.log('secon method completed');
//     //         //do 
//     //         //- $('#downtime').empty();
//     //         //- let querydt =`/sql/vnmsrv601/exec PTR.dbo.sp002_rptDownTime '${linename}'`;
//     //         //- buildHtmlTableD3(querydt,'#downtime');
//     //         resolve();
//     //     }, 1000);
//     // });
// };

// exports.AccessSectorLine = function (strSectorGroup) {
//     return new Promise(function (resolve, reject) {
//         sqlFunction("SELECT Sector FROM TrackingCurrentPOStatus WITH (NOLOCK)" +
//             " WHERE SectorGroup ='" + strSectorGroup + "'",
//             function (rows, err) {
//                 if (err) return reject(err);
//                 // console.log("Promise " + "\n" + rows + "\n\n" + "------------\n");
//                 resolve(rows);
//             });
//     }).catch(function (err) {
//         console.log(err);
//     });
// };

// exports.AccessLineStation = function (strSectorLine) {
//     strSectorLine = strSectorLine.substring(0, strSectorLine.length - 5)
//     console.log(strSectorLine);
//     return new Promise(function (resolve, reject) {
//         sqlFunction("SELECT WorkStationLocation FROM IoTWorkStationLocationControl WITH (NOLOCK)" +
//             " WHERE WorkStationLocation LIKE'" + strSectorLine + "%'",
//             function (rows, err) {
//                 if (err) return reject(err);
//                 // console.log("Promise " + "\n" + rows + "\n\n" + "------------\n");
//                 resolve(rows);
//             });
//     }).catch(function (err) {
//         console.log(err);
//     });
// };

// exports.FindWSLocationID = function (strLocation) {
//     return new Promise(function (resolve, reject) {
//         sqlFunction("SELECT TOP(1) WorkStationLocationID FROM IoTWorkStationLocationControl WITH (NOLOCK)" +
//             " WHERE WorkStationLocation ='" + strLocation + "'",
//             function (rows, err) {
//                 if (err) return reject(err);
//                 // console.log("Promise " + "\n" + rows + "\n\n" + "------------\n");
//                 resolve(rows);
//             });
//     }).catch(function (err) {
//         console.log(err);
//     });
// };

// exports.AccessLocationIDCurrentStatus = function (intMaterialsLocation) {
//     return new Promise(function (resolve, reject) {
//         sqlFunction("SELECT TOP(1) * FROM IoTKANBANControl WITH (NOLOCK)" +
//                         " WHERE KANBANLocationID ='" + intMaterialsLocation + "'",
//             function (rows, err) {
//                 if (err) return reject(err);
//                 // console.log("Promise " + "\n" + rows + "\n\n" + "------------\n");
//                 resolve(rows);
//             });
//     }).catch(function (err) {
//         console.log(err);
//     });
// };

// exports.CalSumKBFedQty = function (strPONumber, strMaterials) {
//     return new Promise(function (resolve, reject) {
//         sqlFunction("SELECT KANBANMaterials,SUM(KANBANFedQty) as SumKBFedQty FROM IoTKANBANControl WITH (NOLOCK)" +
//                         " WHERE KANBANMaterials ='" + strMaterials + "'" +
//                         " AND CurrentPONumber = '" + strPONumber + "'" +
//                         " GROUP BY KANBANMaterials",
//             function (rows, err) {
//                 if (err) return reject(err);
//                 // console.log("Promise " + "\n" + rows + "\n\n" + "------------\n");
//                 resolve(rows);
//             });
//     }).catch(function (err) {
//         console.log(err);
//     });
// };

// exports.UpdateKBQtyStatusByLoc = function (strPONumber, strMaterialsNumber, intWSLocationID, dblNewKBFedQty, newKBLevelID) {
//     return new Promise(function (resolve, reject) {
//         sqlFunction("UPDATE IoTKANBANControl SET KANBANFedQty = '" + dblNewKBFedQty + "'" +
//             " , KANBANLevelID = '" + newKBLevelID + "'" +
//             " WHERE KANBANLocationID ='" + intWSLocationID + "'" +
//             " AND KANBANMaterials = '" + strMaterialsNumber + "'" +
//             " AND CurrentPONumber = '" + strPONumber + "'",
//             function (rows, err) {
//                 if (err) return reject(err);
//                 // console.log("Promise " + "\n" + rows + "\n\n" + "------------\n");
//                 resolve(rows);
//             });
//     }).catch(function (err) {
//         console.log(err);
//     });
// };

// exports.UpdateKBQtyStatus = function (strPONumber, strMaterialsNumber, intWSLocationID, dblNewKBFedQty, newKBLevelID) {
//     return new Promise(function (resolve, reject) {
//         sqlFunction("UPDATE IoTKANBANControl SET KANBANLevelID = '" + newKBLevelID + "'" +
//             " WHERE KANBANMaterials = '" + strMaterialsNumber + "'" +
//             " AND CurrentPONumber = '" + strPONumber + "'",
//             function (rows, err) {
//                 if (err) return reject(err);
//                 // console.log("Promise " + "\n" + rows + "\n\n" + "------------\n");
//                 resolve(rows);
//             });
//     }).catch(function (err) {
//         console.log(err);
//     });
// };