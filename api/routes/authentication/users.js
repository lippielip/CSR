var express = require('express');
var router = express.Router();
var pool = require('../database').connection;
var generator = require('generate-password');
var bcrypt = require('bcryptjs');

// function that checks credentials on login and generates token

router.post('/', async function (req, res) {
	console.log(`\x1b[36mChecking Credentials...\x1b[0m`);
	pool.getConnection(function (err, connection) {
		connection.query(`SELECT Password, TempPassword, Authentication_Level, Pending_Presentation FROM users WHERE Username = '${req.body.username}' `, function (
			err,
			result,
			fields
		) {
			if (result.length === 0) {
				// username doesnt exist
				res.send({ authenticated: false });
				console.log('\x1b[31mUndefined User\x1b[0m');
				return;
			}

			if (result[0].TempPassword !== null) {
				// if a temppassword exist, send authorization level 2 to create actual password
				if (bcrypt.compareSync(req.body.password, result[0].TempPassword)) {
					var token = generator.generate({
						length  : 64,
						numbers : true
					});
					connection.query(
						`UPDATE users SET token = '${token}' WHERE Username = '${req.body.username}' `, // save token to DB for future comparison
						function (err, result, fields) {
							console.log(`Token set for User: ${req.body.username}`);
						}
					);
					res.status(202).send({
						authenticated : 'newUser', // authorization level for new password creation
						token         : token
					});
					console.log('\x1b[35mNew Password required\x1b[0m');
					return;
				} else {
					res.send({ authenticated: false }); // wrong temp pass
					console.log('\x1b[31mIncorrect Password\x1b[0m');
					return;
				}
			}
			// check for correct password
			if (bcrypt.compareSync(req.body.password, result[0].Password) === true) {
				var token = generator.generate({
					length  : 64,
					numbers : true
				});
				connection.query(`UPDATE users SET token = '${token}' WHERE Username = '${req.body.username}' `, function (err, result, fields) {
					console.log(`Token set for User: ${req.body.username}`);
				});
				res.status(200).send({
					// correct password => forward to homepage
					authenticated        : true,
					token                : token,
					Authentication_Level : result[0].Authentication_Level,
					Pending_Presentation : result[0].Pending_Presentation
				});
				console.log('\x1b[35mAuthenticated!\x1b[0m');
				return;
			} else {
				res.send({ authenticated: false });
				console.log('\x1b[31mIncorrect Password\x1b[0m');
				return;
			}
		});
		connection.release();
		if (err) throw err;
	});
});

module.exports = router;
