var express = require('express');
var router = express.Router();
var pool = require('../database').connection;
// simple multipurpose function for fetching data
router.post('/', function (req, res) {
	connection.query(`SELECT CancelTokens from users WHERE USER_ID = '${req.body.User_ID}'`, function (err, result, fields) {
		if (err) res.status(400).send(err);
		if (result[0].CancelTokens >= 1) {
			connection.query(
				`UPDATE users SET Pending_Presentation = ${req.body.number}, CancelTokens = CancelTokens-1 WHERE User_ID = '${req.body.User_ID}' AND CancelTokens >= 1`,
				function (err, result, fields) {
					if (err) res.status(400).send(err);
					connection.query(`UPDATE presentations SET Date = 'NULL' WHERE Presentation_ID = '${req.body.Presentation_ID}' `, function (err, result, fields) {
						if (err) res.status(400).send(err);
					});
				}
			);
			res.status(200).send();
		} else {
			console.log('\x1b[31m', 'Not enough Tokens', '\x1b[0m');
			res.status(412).send();
		}
	});
});

module.exports = router;
