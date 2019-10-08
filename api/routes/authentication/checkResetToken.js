var express = require('express');
var router = express.Router();
var pool = require('../database').connection;

//function to compare the users local token with serverside token
router.post('/', async function (req, res) {
	console.log(`\x1b[36mChecking Token...\x1b[0m`);
	pool.getConnection(function (err, connection) {
		connection.query(`SELECT ResetToken from users WHERE ResetToken = '${req.body.token}' `, function (err, result, fields) {
			if (result.length === 0) {
				// non existent user
				res.status(404).end();
				console.log('\x1b[31mFailed!\x1b[0m');
				return 0;
			}
			if (req.body.token === result[0].token) {
				// successfull authentication
				res.status(200).end();
				console.log('\x1b[32mSuccess!\x1b[0m');
				return 1;
			} else {
				res.status(200).send();
				console.log('\x1b[31mFailed!\x1b[0m');
				return 0;
			}
		});
		connection.release();
		if (err) console.log(err);
	});
});

module.exports = router;
