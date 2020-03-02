var express = require('express');
var router = express.Router();
var pool = require('../database');
var checkToken = require('../authentication/checkTokenInternal');
/* POST new Settings. */
router.post('/', async function (req, res, next) {
	if ((await checkToken(req)) >= 10) {
		var options = req.body;
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return res.status(400).send("Couldn't get a connection");
			}
			connection.query(`SELECT Option_ID from options WHERE Option_ID = '${req.body.Option_ID}' `, function (err, result, fields) {
				if (err) {
					console.log(err);
				}
				if (result.length === 0) {
					connection.query(
						`UPDATE options SET Selected = 0;INSERT INTO options (Name, Selected, Choose_Random, Email_Frequency, Colloquium_Frequency, Comment) VALUES ("${options.Name}", 1, ${options.Choose_Random}, ${options.Email_Frequency}, ${options.Colloquium_Frequency}, "${options.Comment}");`,
						function (err, result, fields) {
							if (err) {
								console.log(err);
								res.status(404).send();
							} else {
								console.log('Settings successfully changed!');
								res.status(200).send();
							}
						}
					);
				} else {
					connection.query(`UPDATE options SET Selected = 0;UPDATE options SET Selected = 1 WHERE Option_ID = ${options.Option_ID}`, function (err, result, fields) {
						if (err) {
							console.log(err);
							res.status(404).send();
						} else {
							console.log('Settings successfully changed!');
							res.status(200).send();
						}
					});
				}
				connection.release();
			});
		});
	} else {
		res.status(402).send('authentication error');
	}
});

module.exports = router;
