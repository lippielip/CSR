var pool = require('../database');

//function to compare the users local token with serverside token
function checkTokenInternal (req) {
	console.log(`\x1b[36mChecking Token...\x1b[0m`);
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log(err);
			return -1;
		}
		if (err) {
			console.log(err);
			return -1;
		}
		connection.query(`Select token, Authentication_Level, Pending_Presentation FROM users WHERE Username = '${req.body.username}' `, function (err, result, fields) {
			if (err) {
				console.log(err);
				connection.release();
				return -1;
			}
			if (result.length === 0) {
				// non existent user
				console.log('\x1b[31mFailed!\x1b[0m');
				return 0;
			}
			if (req.body.token === result[0].token) {
				// successfull authentication
				console.log('\x1b[32mSuccess!\x1b[0m');
				return 1;
			} else {
				console.log('\x1b[31mFailed!\x1b[0m');
				return 0;
			}
		});
		connection.release();
	});
}

module.exports = checkTokenInternal;
