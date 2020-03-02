var generator = require('generate-password');
const pool = require('../database');
var mail = require('../email/mailswitch');
function MakeTokenMails () {
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log(err);
			return res.status(400).send("Couldn't get a connection");
		}
		let date;
		connection.query(`Select Next_Colloquium from options WHERE Selected = 1`, function (err, result, fields) {
			if (err) console.log(err);
			date = result[0].Next_Colloquium;
		});

		connection.query(
			`Select User_ID, Username, E_Mail, Pending_Presentation from users WHERE Pending_Presentation = 1 && Authentication_Level >=5 && Authentication_Level <= 7`,
			function (err, result, fields) {
				if (err) console.log(err);
				for (let i = 0; i < result.length; i++) {
					let token = generator.generate({
						length: 64,
						numbers: true
					});
					connection.query(`UPDATE users SET ConfirmToken = '${token}' WHERE User_ID = ${result[i].User_ID}`, function (err, fields) {
						if (err) console.log(err);
						mail(2, result[i].E_Mail, token, date);
					});
				}
			}
		);
	});
}

module.exports = MakeTokenMails;
