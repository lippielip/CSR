var mysql = require('mysql');
//Connection Infos for DB change if need be
var connection = mysql.createPool({
	host     : process.env.DB_HOST || 'localhost',
	user     : process.env.DB_USER || 'root',
	password : process.env.DB_PASSWORD || 'root',
	database : process.env.DB_DATABASE_NAME || 'csr_db',
	port     : process.env.DB_PORT || '3306'
});
console.log('Hostname: ' + process.env.DB_HOST);
console.log('Username: ' + process.env.DB_USER);
console.log('password: **** ');
console.log('database: ' + process.env.DB_DATABASE_NAME);
console.log('port	: ' + process.env.DB_PORT);

module.exports.connection = connection;

let API_URL = process.env.API_URL || 'http://localhost:8000';

module.exports.API_URL = API_URL;
