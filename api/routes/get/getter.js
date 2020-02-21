var express = require('express');
var router = express.Router();
var pool = require('../database');
var checkToken = require('../authentication/checkTokenInternal');
// regex that checks if specific words are being selected => protects sensitive data
var restrictedGetter = /(\WPASSWORD)|(\WTOKEN)|(\WRESETTOKEN)|(\W\*)/gi
// simple multipurpose function for fetching data
router.post('/', async function (req, res) {
	if ((await checkToken(req)) >= 5) {
			if (req.body.select.match(restrictedGetter) !== null && await checkToken(req) < 10) {
						console.log('Protected information');
						res.status(500).send('protected information requested'); 
		} else {
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
