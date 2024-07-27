

// Initialize the mssql package
const dbmssql_config = {
    user: 'eleanaims',
    password: 'ele@nAIms*1024',
    server: 'eleanaims',
    port: 1433,
    database: 'GISDBdev',
    options: {
        trustServerCertificate: true,
    }
}

// module.exports.cnnMongooseDB = {
//     'cnnDB' : 'mongodb://eleanms:ele%40nms1024@ds219641.mlab.com:19641/eleanmmsdb'
// };


// PostgreSQL Database connection configuration
const dbpostgres_config = {
	user: 'eleanaims',
	password: 'ele@nAIms*1024',
	host: 'localhost',
	port: 5432,
	database: 'GISDBdev'
};

// module.exports.dbmssql_config = dbmssql_config;
// module.exports.dbpostgres_config = dbpostgres_config;
export { dbmssql_config, dbpostgres_config, }