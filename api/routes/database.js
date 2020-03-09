var mysql = require('mysql');
//Connection Infos for DB change if need be
var connection = mysql.createPool({
	host: process.env.DB_HOST, // localhost
	user: process.env.DB_USER, // DB username
	password: process.env.DB_PASSWORD, // DB Password
	database: process.env.DB_DATABASE_NAME, //DB Database Name
	port: process.env.DB_PORT, // DB Port Number
	connectionLimit: 20, // Amount of connections until API waits for a closed connection
	multipleStatements: true
});
console.log('Hostname: ' + process.env.DB_HOST + ':' + process.env.DB_PORT);
console.log('database: ' + process.env.DB_DATABASE_NAME);
console.log('Username: ' + process.env.DB_USER);

module.exports = connection;
