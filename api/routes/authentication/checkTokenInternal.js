var pool = require('../database');

//function to compare the users local token with serverside token
//overview
// resolve(-1) === error authenticating
// resolve(0) === not authenticated
// resolve(1) == authenticated
async function checkTokenInternal (req) {
	return new Promise(function (resolve, reject) {
		console.log(`\x1b[36mChecking Token...\x1b[0m`);
		if (req.body.username === null || req.body.token === null) {
			resolve(-1);
			return;
		}
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				resolve(-1);
				return;
			}
			if (err) {
				console.log(err);
				resolve(-1);
				return;
			}
			connection.query(`Select token, Authentication_Level, Pending_Presentation FROM users WHERE Username = '${req.body.username}' `, function (err, result, fields) {
				if (err) {
					console.log(err);
					connection.release();
					resolve(-1);
					return;
				}
				if (result.length === 0) {
					// non existent user
					console.log('\x1b[31mFailed!\x1b[0m');
					console.log(0);
					resolve(0);
					return;
				}
				if (req.body.token === result[0].token) {
					// successfull authentication
					console.log('\x1b[32mSuccess!\x1b[0m');
					resolve(1);
					return;
				} else {
					console.log('\x1b[31mFailed!\x1b[0m');
					console.log(0);
					resolve(0);
					return;
				}
			});
			connection.release();
		});
	});
}

module.exports = checkTokenInternal;
