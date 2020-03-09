var express = require('express');
var router = express.Router();
var pool = require('../database');
var checkToken = require('../authentication/checkTokenInternal');
var MakeTokenMails = require('./changeEmailStatus');

router.post('/', async function(req, res) {
	if ((await checkToken(req)) === 10) {
		pool.getConnection(function(err, connection) {
			if (err) {
				console.log(err);
				return res.status(400).send("Couldn't get a connection");
			}
			connection.query(`UPDATE options Set Next_colloquium = '${req.body.Next_Colloquium}' WHERE Selected = 1`, function(err, result, fields) {
				if (err) {
					console.log(err);
					res.status(500).send(err);
					connection.release();
				}
				MakeTokenMails();
				res.status(200).send();
			});
			connection.release();
		});
	} else {
		res.status(401).send('authentication error');
	}
});

module.exports = router;
