var express = require('express');
var router = express.Router();
var pool = require('../database');

// function to change values
router.post('/', function (req, res, next) {
	connection.query(`UPDATE users SET Pending_Presentation = 10 WHERE Username = '${req.body.username}' `, function (err, result, fields) {
		if (err) console.log(err);
		console.log(result.message + ')');
	});
	res.status(200).send();
});

module.exports = router;
