var mysql = require('mysql');
//Connection Infos for DB change if need be
var connection = mysql.createPool({
	host            : process.env.DB_HOST || 'localhost',
	user            : process.env.DB_USER || 'root',
	password        : process.env.DB_PASSWORD || 'root',
	database        : process.env.DB_DATABASE_NAME || 'csr_db',
	port            : process.env.DB_PORT || '3306',
	connectionLimit : 20
});
console.log('Hostname: ' + process.env.DB_HOST + ':' + process.env.DB_PORT);
console.log('database: ' + process.env.DB_DATABASE_NAME);
console.log('Username: ' + process.env.DB_USER);

module.exports = connection;
