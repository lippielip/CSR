var pool = require('../database');

//function to compare the users local token with serverside token
async function checkTokenInternal (req) {
	return new Promise(function (resolve, reject) {
		console.log(`\x1b[36mChecking Token...\x1b[0m`);
		if (req.body.username === null || req.body.token === null) {
			reject(-1);
		}
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				reject(-1);
			}
			if (err) {
				console.log(err);
				reject(-1);
			}
			connection.query(`Select token, Authentication_Level, Pending_Presentation FROM users WHERE Username = '${req.body.username}' `, function (err, result, fields) {
				if (err) {
					console.log(err);
					connection.release();
					resolve(-1);
				}
				if (result.length === 0) {
					// non existent user
					console.log('\x1b[31mFailed!\x1b[0m');
					console.log(0);
					resolve(0);
				}
				if (req.body.token === result[0].token) {
					// successfull authentication
					console.log('\x1b[32mSuccess!\x1b[0m');
					resolve(1);
				} else {
					console.log('\x1b[31mFailed!\x1b[0m');
					console.log(0);
					resolve(0);
				}
			});
			connection.release();
		});
	});
}

module.exports = checkTokenInternal;
