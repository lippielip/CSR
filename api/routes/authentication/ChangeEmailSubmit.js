var express = require('express');
var router = express.Router();
var pool = require('../database');
var checkToken = require('../authentication/checkTokenInternal');
/* POST new Password. */
router.post('/', async function (req, res, next) {
	if ((await checkToken(req)) >= 5) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return res.status(400).send("Couldn't get a connection");
			}
			connection.query(`SELECT E_Mail from users WHERE E_Mail = '${req.body.newEmail}' `, function (err, result, fields) {
				if (err) {
					console.log(err);
				}
				if (result.length === 0) {
					var E_Mail = req.body.newEmail;
					connection.query(`UPDATE users SET E_Mail ='${E_Mail}' WHERE Username = '${req.body.username}' `, function (err, result, fields) {
						if (err) {
							console.log(err);
							res.status(404).send();
						} else {
							console.log('Email successfully changed!');
							res.status(200).send();
						}
					});
				} else {
					console.log('Email already exists!');
					res.status(403).send();
				}
				connection.release();
			});
		});
	} else {
		res.status(402).send('authentication error');
	}
});

module.exports = router;
