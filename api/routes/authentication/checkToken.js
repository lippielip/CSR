var express = require('express');
var router = express.Router();
var pool = require('../database');

//function to compare the users local token with serverside token
router.post('/', async function (req, res) {
	console.log(`\x1b[36mChecking Token...\x1b[0m`);
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log(err);
			return res.status(400).send("Couldn't get a connection");
		}
		connection.query(`Select token, Authentication_Level, Pending_Presentation FROM users WHERE Username = '${req.body.username}' `, function (err, result, fields) {
			if (err) {
				console.log(err);
				connection.release();
				res.status(500).send(err);
			}
			if (result.length === 0) {
				// non existent user
				res.status(200).send({
					authenticated        : false,
					Authentication_Level : null,
					Pending_Presentation : null
				});
				console.log('\x1b[31mFailed!\x1b[0m');
				return 0;
			}
			if (req.body.token === result[0].token) {
				// successfull authentication
				res.status(200).send({
					authenticated        : true,
					Authentication_Level : result[0].Authentication_Level,
					Pending_Presentation : result[0].Pending_Presentation
				});
				console.log('\x1b[32mSuccess!\x1b[0m');
				return 1;
			} else {
				res.status(200).send({
					// tampered token
					authenticated        : false,
					Authentication_Level : null,
					Pending_Presentation : null
				});
				console.log('\x1b[31mFailed!\x1b[0m');
				return 0;
			}
		});
		connection.release();
	});
});

module.exports = router;
