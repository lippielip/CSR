var express = require('express');
var router = express.Router();
var pool = require('../database');
var checkToken = require('../authentication/checkTokenInternal');

// function to change values
router.post('/', async function (req, res, next) {
	if ((await checkToken(req)) >= 5) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return res.status(400).send("Couldn't get a connection");
			}
			connection.query(`UPDATE users SET Pending_Presentation = 10 WHERE Username = '${req.body.username}' `, function (err, result, fields) {
				if (err) console.log(err);
			});
			res.status(200).send();
			connection.release();
		});
	} else {
		res.status(401).send('authentication error');
	}
});

module.exports = router;
