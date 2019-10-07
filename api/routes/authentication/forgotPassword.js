var express = require('express');
var router = express.Router();
var connection = require('../database').connection;
var bcrypt = require('bcryptjs');
var generator = require('generate-password');
var API_URL = require('../database').API_URL;
const html = require('../email/passwordResetTemplate');
const mailgun = require('../mailgun');
const SENDER_MAIL = 'CSR Password Bot <noreply.reset@mail.3dstudis.net>';
const mg = mailgun.mg;

//function to compare the users local token with serverside token

router.post('/', async function (req, res) {
	connection.query(`SELECT E_Mail from users WHERE E_Mail = '${req.body.E_Mail}' `, function (err, result, fields) {
		if (err) {
			console.log(err);
			res.status(404).send();
		}
		if (Object.entries(result).length === 0) {
			console.log('Email doesnt exist');
			res.status(404).send();
		}
		if (result.length === 1) {
			console.log('success!');
			var password = generator.generate({
				length  : 64,
				numbers : true
			});
			var Salt = bcrypt.genSaltSync(10);
			var Hash = bcrypt.hashSync(password, Salt);
			connection.query(`Update users SET ResetToken = '${Hash}' WHERE E_Mail= '${req.body.E_Mail}' `, function (err, result, fields) {
				if (err) {
					console.log(err);
					res.status(404).send();
				} else {
					const data = {
						from    : SENDER_MAIL,
						to      : `${req.body.E_Mail}`,
						subject : 'Password Reset',
						text    : `HTML Mail not available. Use this link to reset your Password: ${API_URL + '/forgotPassword?token=' + Hash}`,
						html    : `${html(API_URL, Hash)}`
					};

					mg.messages().send(data, function (error, body) {
						if (error) console.log(error);
						console.log(body);
					});
				}
			});
			res.status(200).send();
		}
		if (result.length >= 2) {
			console.log('duplicate emails wut');
			res.status(403).send();
		}
	});
});

module.exports = router;
