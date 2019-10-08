var express = require('express');
var router = express.Router();
var pool = require('../database');

router.post('/', function (req, res) {
	var CategoryAmount = Object.keys(req.body.missing).length;
	var CategoryNames = Object.keys(req.body.missing);
	var Missing_ID;
	pool.getConnection(function (err, connection) {
		if (err) {
			console.log(err);
			return res.send(400, "Couldn't get a connection");
		}
		connection.query(`SELECT User_ID FROM (users) WHERE Username = '${req.body.missing.User}'`, function (err, result) {
			if (err) {
				req.body.missing.User = null;
			} else {
				req.body.missing.User = result[0].User_ID;
				console.dir(req.body.missing);
			}
		});
		connection.query(`INSERT INTO outofoffice (${CategoryNames[1]}) VALUES ('${Object.values(req.body.missing)[1]}')`, function (err) {
			if (err) console.log(err);
		});
		connection.query(`SELECT LAST_INSERT_ID()`, function (err, result) {
			if (err) res.status(502).send();
			Missing_ID = result[0]['LAST_INSERT_ID()'];

			for (let i = 0; i < CategoryAmount; i++) {
				console.log(`UPDATE outofoffice SET ${CategoryNames[i]} = '${Object.values(req.body.missing)[i]}' WHERE Missing_ID = ${Missing_ID} `);
				connection.query(
					`UPDATE outofoffice SET ${CategoryNames[i]} = '${Object.values(req.body.missing)[i]}' WHERE Missing_ID = ${Missing_ID} `, // insert all values
					function (err) {
						if (err) res.status(503).send();
					}
				);
			}
			res.status(200).send(`Successfully added outofoffice ${CategoryNames[0]}!`);
		});
		connection.release();
	});
});
module.exports = router;
