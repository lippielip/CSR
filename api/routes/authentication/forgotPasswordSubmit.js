var express = require('express');
var router = express.Router();
var pool = require('../database');
var bcrypt = require('bcryptjs');
/* POST new Password. */
router.post('/', async function (req, res, next) {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log(err);
			return res.status(400).send("Couldn't get a connection");
		}
		connection.query(`SELECT ResetToken from users WHERE ResetToken = '${req.body.token}' `, function (err, result, fields) {
			if (err) {
				console.log(err);
			}
			console.log(result);
			if (result.length === 1) {
				if (req.body.password === req.body.confirmPassword) {
					var Salt = bcrypt.genSaltSync(10); //generate Hash
					var Password = bcrypt.hashSync(`${req.body.password}`, Salt);
					connection.query(`UPDATE users SET Password ='${Password}', ResetToken = NULL WHERE ResetToken = '${req.body.token}' `, function (
						err,
						result,
						fields
					) {
						if (err) {console.log(err)} else {
							console.log('Password successfully changed!');
							res.status(200).send();
						}	
					})
				}else {
					res.status(401).send('Password doesnt match')
				}
				
			} else {
				console.log('Invalid Token!');
				res.status(404).send();
			}
			connection.release();
		});
	});
});

module.exports = router;
