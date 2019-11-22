var express = require('express');
var router = express.Router();
var pool = require('../database');
var checkToken = require('../authentication/checkTokenInternal');
// function to delete entries
router.post('/', async function (req, res, next) {
	if ((await checkToken(req)) >= 10) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return res.status(400).send("Couldn't get a connection");
			}
			// if admin privileges and token are correct, delete entry
			console.log(`Deleting Entry from ${req.body.DeleteTable} ...`);
			connection.query(`DELETE FROM ${req.body.DeleteTable} WHERE ${req.body.IDName}= ${req.body.tableID}`, function (err, result, fields) {
				if (err) res.status(500).send(err);
			});
			console.log('Success!');
			res.status(200).send();

			connection.release();
		});
	} else {
		if ((await checkToken(req)) >= 5) {
			pool.getConnection(function (err, connection) {
				if (err) {
					console.log(err);
					return res.status(400).send("Couldn't get a connection");
				}
				connection.query(`SELECT Username from users WHERE token = '${req.body.token}'`, function (err, result, fields) {
					if (err) res.status(500).send(err);
					if (result[0].Username === req.body.deleteUser && req.body.IDName === 'Missing_ID') {
						console.log(`Deleting Entry from ${req.body.DeleteTable} ...`);
						connection.query(`DELETE FROM ${req.body.DeleteTable} WHERE ${req.body.IDName}= ${req.body.tableID}`, function (err, result, fields) {
							if (err) res.status(500).send(err);
						});
						console.log('Success!');
						res.status(200).send();

						connection.release();
					} else {
						res.status(401).send('authentication error');
					}
				});
			});
		} else {
			res.status(401).send('authentication error');
		}
	}
});

module.exports = router;
