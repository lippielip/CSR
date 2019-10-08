var express = require('express');
var router = express.Router();
var pool = require('../database');

// function to change values
router.post('/', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log(err);
			return res.status(400).send("Couldn't get a connection");
		}
		connection.query(`UPDATE users SET Pending_Presentation = 10 WHERE Username = '${req.body.username}' `, function (err, result, fields) {
			if (err) console.log(err);
			console.log(result.message + ')');
		});
		res.status(200).send();
		connection.release();
	});
});

module.exports = router;
