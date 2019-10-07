var express = require('express');
var router = express.Router();
var connection = require('../database').connection;
var bcrypt = require('bcryptjs');
var generator = require('generate-password');

// function to create new user
router.post('/', async function (req, res) {
	connection.query(
		`SELECT Username, E_Mail FROM users`, // get all usernames to compare with
		function (err, result, fields) {
			console.log(`\x1b[36mAdding User...\x1b[0m`);

			if (
				result.some((element) => {
					if (element.Username.includes(req.body.Username)) {
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
					if (element.E_Mail.includes(req.body.E_Mail)) {
						return element;
					}
				})
			) {
				//duplicate username error
				res.status(401).send('Duplicate E-Mail');
				console.log(`\x1b[31mError: Duplicate E-Mail\x1b[0m`);
				return;
			}

			var password = generator.generate({
				length  : 12,
				numbers : true
			});

			// encrytion on password
			console.log(`temp PW for user \x1b[33m${req.body.Username}\x1b[0m: \x1b[35m${password}\x1b[0m`);
			var Salt = bcrypt.genSaltSync(10);
			var Hash = bcrypt.hashSync(password, Salt);
			req.body.TempPassword = Hash;

			var Keys = Object.keys(req.body).toString(); // get all filled in Propertys
			var Values = Object.values(req.body); // get corresponding values
			Values = Values.map(function (e) {
				return JSON.stringify(e);
			}); // formatting for SQL so a for Loop isnt needed
			Values = Values.join(',');

			connection.query(`INSERT INTO users (${Keys}) VALUES (${Values}) `, function (err, result, fields) {
				res.status(200).send('User added Successfully');
			});
		}
	);
});

module.exports = router;
