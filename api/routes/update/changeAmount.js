var express = require('express');
var router = express.Router();
var pool = require('../database');

// function to change values
router.post('/', function (req, res, next) {
	var category = req.body.categoryName;
	var sign = req.body.sign;
	console.log(
		'\x1b[34m',
		`UPDATE`,
		'\x1b[0m',
		` users`,
		'\x1b[32m',
		`SET`,
		'\x1b[0m',
		`${category} = ${category} ${sign} 1`,
		'\x1b[32m',
		`WHERE`,
		'\x1b[0m',
		`User_ID = ${req.body.Id} `
	);
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log(err);
			return res.status(400).send("Couldn't get a connection");
		}
		connection.query(`UPDATE users SET ${category} = ${category} ${sign} 1 WHERE User_ID = ${req.body.Id} `, function (err, result, fields) {
			if (err) console.log(err);
		});
		console.log(req.body.purpose);
		connection.query(`UPDATE users SET CancelTokens = CancelTokens ${sign} 1 WHERE User_ID = ${req.body.Id} `, function (err, result, fields) {
			if (err) console.log(err);
		});
		connection.query(`UPDATE users SET CancelTokens = 3 WHERE CancelTokens > 3 `, function (err, result, fields) {
			if (err) console.log(err);
		});
		res.status(200).send();
		connection.release();
	});
});

module.exports = router;
