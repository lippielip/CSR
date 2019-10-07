var express = require('express');
var router = express.Router();
var connection = require('../database').connection;
// function to delete entries
router.post('/', function (req, res, next) {
	connection.query(
		`Select token FROM users WHERE Username = '${req.body.username}' `, // check token to prevent unauthorized API Calls
		function (err, result, fields) {
			if (result.length === 0) {
				console.log('Attempted Bamboozle: no results');
				res.status(404).send('No');
			}
			if (req.body.token === result[0].token) {
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
			} else {
				console.log('Attempted Bamboozle: wrong AuthLevel');
				res.status(401).send('No');
			}
		}
	);
});

module.exports = router;
