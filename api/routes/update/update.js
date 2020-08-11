var express = require('express');
var router = express.Router();
var pool = require('../database');
var checkToken = require('../authentication/checkTokenInternal');

// function to change values
router.post('/', async function (req, res, next) {
	if ((await checkToken(req)) >= 5) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return res.status(400).send("Couldn't get a connection");
			}
			//loop through all categories
			var category = Object.keys(req.body)[2];
			if (category === 'presentations') {
				connection.query(`SELECT Next_Colloquium FROM options Where Selected = 1`, function (err, result, fields) {
					if (err) console.log(err);
						let Colloquium_Date = new Date(result[0].Next_Colloquium);
						Colloquium_Date.setMinutes(Colloquium_Date.getMinutes() + 300);
						Colloquium_Date = Colloquium_Date.toISOString();
						Colloquium_Date = Colloquium_Date.split('T')[0];
						if (Colloquium_Date === req.body.presentations.Date){
							connection.query(`UPDATE users SET Pending_Presentation = 10 WHERE Username = '${req.body.username}'  `, function (
								err,
								result,
								fields
							) {
								if (err) console.log(err);
							});	
						}
						var proplength = Object.values(req.body[category]).length; // category amount
						for (let j = 0; j < proplength; j++) {
							// loop through all properties
							values = Object.values(req.body[category])[j];
							keys = Object.keys(req.body[category])[j];
							connection.query(`UPDATE ${category} SET ${keys} = '${values}' WHERE ${req.body.idInfo.idName} = ${req.body.idInfo.id} `, function (
								err,
								result,
								fields
							) {
								if (err) console.log(err);
							});
						}
						res.status(200).send();
				});
			} else {
				var proplength = Object.values(req.body[category]).length; // category amount
				for (let j = 0; j < proplength; j++) {
					// loop through all properties
					values = Object.values(req.body[category])[j];
					keys = Object.keys(req.body[category])[j];
					connection.query(`UPDATE ${category} SET ${keys} = '${values}' WHERE ${req.body.idInfo.idName} = ${req.body.idInfo.id} `, function (err, result, fields) {
						if (err) console.log(err);
					});
				}
				res.status(200).send();
			}
			connection.release();
		});
	} else {
		res.status(401).send('authentication error');
	}
});

module.exports = router;
