var express = require('express');
var router = express.Router();
var pool = require('../database');
var bcrypt = require('bcryptjs');

//function to change from first time password to own password
//to be removed
router.post('/', async function (req, res) {
	console.log(`\x1b[36mAdding Password...\x1b[0m`);
	var Username = req.body.Username; //get Username
	var Salt = bcrypt.genSaltSync(10); //generate Hash
	var Password = bcrypt.hashSync(`${req.body.Password}`, Salt);
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log(err);
			return res.status(400).send("Couldn't get a connection");
		}
		connection.query(`UPDATE users SET Password ='${Password}', TempPassword = NULL WHERE Username = '${Username}' `, function (err, result, fields) {
			res.status(200).send('Password added Successfully');
		});
		connection.release();
		if (err) console.log(err);
	});
});

module.exports = router;
