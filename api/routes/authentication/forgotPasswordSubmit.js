var express = require('express');
var router = express.Router();
var pool = require('../database').connection;
var bcrypt = require('bcryptjs');
/* POST new Password. */
router.post('/', async function (req, res, next) {
	pool.getConnection(function (err, connection) {
		connection.query(`SELECT ResetToken from users WHERE ResetToken = '${req.body.token}' `, function (err, result, fields) {
			if (err) {
				console.log(err);
			}
			if (result.length === 1) {
				if (req.body.password === req.body.confirmPassword) {
					var Salt = bcrypt.genSaltSync(10); //generate Hash
					var Password = bcrypt.hashSync(`${req.body.password}`, Salt);
					connection.query(`UPDATE users SET Password ='${Password}', TempPassword = NULL, ResetToken = NULL WHERE ResetToken = '${req.body.token}' `, function (
						err,
						result,
						fields
					) {
						console.log('Password successfully changed');
					});
				}
				res.status(200).send();
			} else {
				console.log('Something went wrong!');
				res.status(404).send();
			}
			connection.release();
			if (err) throw err;
		});
	});
});

module.exports = router;
