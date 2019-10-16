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
			//loop through all categories
			var category = Object.keys(req.body)[2];
			if (category === 'presentations') {
				connection.query(`SELECT Date FROM presentations WHERE Date = '${req.body.presentations.Date}'`, function (err, result, fields) {
					if (err) console.log(err);
					if (result.length === 2) {
						res.status(304).send();
						connection.release();
					}
				});
			}
			var proplength = Object.values(req.body[category]).length; // category amount
			console.log('\x1b[31m', `Property Amount for Category ${category}: ${proplength}`, '\x1b[0m');
			for (let j = 0; j < proplength; j++) {
				// loop through all properties
				values = Object.values(req.body[category])[j];
				keys = Object.keys(req.body[category])[j];
				console.log(
					'\x1b[34m',
					`UPDATE`,
					'\x1b[0m',
					` ${category}`,
					'\x1b[32m',
					`SET`,
					'\x1b[0m',
					`${keys} = '${values}'`,
					'\x1b[32m',
					`WHERE`,
					'\x1b[0m',
					`${req.body.idInfo.idName} = ${req.body.idInfo.id}`
				);
				connection.query(`UPDATE ${category} SET ${keys} = '${values}' WHERE ${req.body.idInfo.idName} = ${req.body.idInfo.id} `, function (err, result, fields) {
					if (err) console.log(err);
				});
			}
			res.status(200).send();
			connection.release();
		});
	} else {
		res.status(401).send('authentication error');
	}
});

module.exports = router;
