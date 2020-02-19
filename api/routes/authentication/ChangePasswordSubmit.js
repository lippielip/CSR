var express = require('express');
var router = express.Router();
var pool = require('../database');
var bcrypt = require('bcryptjs');
var checkToken = require('../authentication/checkTokenInternal');
/* POST new Password. */
router.post('/', async function (req, res, next) {
	if ((await checkToken(req)) >= 5) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return res.status(400).send("Couldn't get a connection");
			}
			connection.query(`SELECT Password from users WHERE Username = '${req.body.username}' `, function (err, result, fields) {
				if (err) {
					console.log(err);
				}
				if (result.length === 1) {
					if (req.body.password === req.body.confirmPassword) {
						if (bcrypt.compareSync(req.body.currentPassword, result[0].Password) === true) {
							var Salt = bcrypt.genSaltSync(10); //generate Hash
							var Password = bcrypt.hashSync(`${req.body.password}`, Salt);
							connection.query(`UPDATE users SET Password ='${Password}' WHERE Username = '${req.body.username}' `, function (err, result, fields) {
								if (err) console.log(err);
								else {
									console.log('Password successfully changed!');
									res.status(200).send();
								}
							});
						} else {
							res.status(403).send('Current Password incorrect');
						}
					} else {
						res.status(401).send('Password doesnt match');
					}
				} else {
					console.log('Invalid User!');
					res.status(404).send();
				}
				connection.release();
			});
		});
	} else {
		res.status(402).send('authentication error');
	}
});

module.exports = router;
