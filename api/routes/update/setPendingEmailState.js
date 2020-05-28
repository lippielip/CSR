var express = require('express');
var router = express.Router();
var pool = require('../database');
var checkToken = require('../authentication/checkTokenInternal');

// function to change values
router.post('/', async function (req, res, next) {
	if (req.body.answer === '1') {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return res.status(400).send("Couldn't get a connection");
			}
			connection.query(`UPDATE users SET ConfirmToken = null WHERE ConfirmToken = '${req.body.token}' `, function (err, result, fields) {
				if (err) console.log(err);
				if (result.affectedRows === 1) {
					res.status(200).send();
				} else {
					res.status(404).send();
				}
				connection.release();
			});	
		});
	} else {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return res.status(400).send("Couldn't get a connection");
			}
			connection.query(`UPDATE users SET Pending_Presentation = 0, ConfirmToken = null WHERE ConfirmToken = '${req.body.token}' `, function (err, result, fields) {
				if (err) console.log(err);
				if (result.affectedRows === 1) {
					res.status(200).send();
				} else {
					res.status(404).send();
				}
				connection.release();
			});
		});
	}
});

module.exports = router;
