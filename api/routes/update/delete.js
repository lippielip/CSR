var express = require('express');
var router = express.Router();
var pool = require('../database');
var checkToken = require('../authentication/checkTokenInternal');
// function to delete entries
router.post('/', async function (req, res, next) {
	if ((await checkToken(req)) >= 10) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return res.status(400).send("Couldn't get a connection");
			}
			// if admin privileges and token are correct, delete entry
			console.log(`Deleting Entry from ${req.body.DeleteTables} ...`);
			for (let i = 0; i < req.body.DeleteTables.length; i++) {
				console.log(`DELETE FROM ${req.body.DeleteTables[i]} WHERE ${req.body.IDName[i]}= ${req.body.tableIDs[i]}`);
				connection.query(`DELETE FROM ${req.body.DeleteTables[i]} WHERE ${req.body.IDName[i]}= ${req.body.tableIDs[i]}`, function (err, result, fields) {
					if (err) res.status(500).send(err);
				});
			}
			if (req.body.held === 10) {
				connection.query(`UPDATE users SET Pending_Presentation = 0 WHERE Username = '${req.body.deleteUser}' `, function (err, result, fields) {
					if (err) console.log(err);
					console.log(result.message + ')');
				});
			}
			console.log('Success!');
			res.status(200).send();

			connection.release();
		});
	} else {
		res.status(401).send('authentication error');
	}
});

module.exports = router;
