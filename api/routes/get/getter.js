var express = require('express');
var router = express.Router();
var pool = require('../database');
var checkToken = require('../authentication/checkTokenInternal');
var restrictedGetter = ['\\s{0,1}(PASSWORD)\\s{0,1}', '\\s{0,1}(TOKEN)\\s{0,1}', '\\s{0,1}(RESETTOKEN)\\s{0,1}', '\\s{0,1}(\\*)\\s{0,1}'];
// simple multipurpose function for fetching data
router.post('/', async function (req, res) {
	if ((await checkToken(req)) >= 5) {
		console.log(
			restrictedGetter.some((el) => {
				console.log(el)
				console.log(req.body.select.toUpperCase().match(el) !== null)
				if (req.body.select.toUpperCase().match(el) !== null) {
					return el;
				}
			})
		);
		if (restrictedGetter.some((el) => {
			if (req.body.select.toUpperCase().match(el) !== null) {
				return el;
			}
		})) {
			console.log('Protected information');
			res.status(500).send('protected information requested');
		} else {
			console.log('\x1b[34m', `SELECT ${req.body.select} FROM ${req.body.tableName} ${req.body.selectiveGet ? req.body.selectiveGet : ''}`, '\x1b[0m');
			pool.getConnection(function (err, connection) {
				if (err) {
					console.log(err);
					return res.status(400).send("Couldn't get a connection");
				}
				connection.query(`SELECT ${req.body.select} FROM ${req.body.tableName} ${req.body.selectiveGet ? req.body.selectiveGet : ''}`, function (err, result, fields) {
					if (err) {
						console.log(err);
						connection.release();
						res.status(500).send(err);
					}
					res.status(200).send(result);
					console.log(`${req.body.tableName}`, '\x1b[32m', `(sent)`, '\x1b[0m');
				});
				connection.release();
			});
		}
	} else {
		res.status(401).send('authentication error');
	}
});

module.exports = router;
