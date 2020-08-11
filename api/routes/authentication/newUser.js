var express = require('express');
var router = express.Router();
var pool = require('../database');
var bcrypt = require('bcryptjs');
var generator = require('generate-password');
var checkToken = require('../authentication/checkTokenInternal');
const html = require('../email/passwordResetTemplate');
const mailgun = require('../mailgun');
const SENDER_MAIL = 'CSR Password Bot <noreply.reset@mail.3dstudis.net>';
const mg = mailgun.mg;
const DOMAIN_NAME = process.env.DOMAIN_NAME;

// function to create new user
// username = admin username
// Username = new User username  !! case sensitive
router.post('/', async function(req, res) {
	if ((await checkToken(req)) >= 10) {
		pool.getConnection(function(err, connection) {
			if (err) {
				console.log(err);
				return res.status(400).send("Couldn't get a connection");
			}
			connection.query(
				`SELECT Username, E_Mail FROM users`, // get all usernames to compare with
				function(err, result, fields) {
					console.log(`\x1b[36mAdding User...\x1b[0m`);

					if (
						result.some((element) => {
							if (element.Username.includes(req.body.newUser.Username)) {
								return element;
							}
						})
					) {
						//duplicate username error
						res.status(400).send('Duplicate Username');
						console.log(`\x1b[31mError: Duplicate Username\x1b[0m`);
						return;
					}

					if (
						result.some((element) => {
							if (element.E_Mail.includes(req.body.newUser.E_Mail)) {
								return element;
							}
						})
					) {
						//duplicate E-Mail error
						res.status(401).send('Duplicate E-Mail');
						console.log(`\x1b[31mError: Duplicate E-Mail\x1b[0m`);
						return;
					}
					// encrytion on password
					if (req.body.newUser.Authentication_Level >= 5) {
						var password = generator.generate({
							length  : 64,
							numbers : true
						});

						var Salt = bcrypt.genSaltSync(14);
						var Hash = bcrypt.hashSync(password, Salt);
						req.body.newUser.ResetToken = Hash;
						console.log(`Reset Token generated for user ${req.body.newUser.Username}`);
					}
					var Keys = Object.keys(req.body.newUser).toString(); // get all filled in Propertys
					var Values = Object.values(req.body.newUser); // get corresponding values
					Values = Values.map(function(e) {
						return JSON.stringify(e);
					}); // formatting for SQL so a for Loop isnt needed
					Values = Values.join(',');

					connection.query(`INSERT INTO users (${Keys}) VALUES (${Values}) `, function(err, result, fields) {
						if (err) {
							console.log(err);
							res.status(404).send();
						} else {
							if (req.body.newUser.Authentication_Level >= 5) {
								const data = {
									from    : SENDER_MAIL,
									to      : `${req.body.newUser.E_Mail}`,
									subject : 'Create a password',
									text    : `HTML Mail not available. Use this link to set your Password: ${DOMAIN_NAME + '/forgotPassword?token=' + Hash}`,
									html    : `${html(DOMAIN_NAME, Hash, req.body.newUser.Username)}`
								};
								mg.messages().send(data, function(error, body) {
									if (error) console.log(error);
								});
							}
							res.status(200).send('User added Successfully');
						}
					});
				}
			);
			connection.release();
			if (err) console.log(err);
		});
	} else {
		res.status(402).send('authentication error');
	}
});

module.exports = router;
