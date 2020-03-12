var express = require('express');
var router = express.Router();
var pool = require('../database');
var checkToken = require('../authentication/checkTokenInternal');
var MakeTokenMails = require('./changeEmailStatus');
var getMissingPeople = require('../get/getMissingPeople');

const AUTHENTICATION_UPPER_LIMIT = 8;
const AUTHENTICATION_LOWER_LIMIT = 4;

async function SetPendingForEveryone () {
	let People = await getMissingPeople();
	if (People.length === 0) {
		People = -1;
	}
	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return;
			}
			connection.query(
				`UPDATE users SET Pending_Presentation = 1 WHERE Authentication_Level > ${AUTHENTICATION_LOWER_LIMIT} && Authentication_Level < ${AUTHENTICATION_UPPER_LIMIT} && User_ID NOT IN (${People})`,
				async function (err, result) {
					if (err) console.log(err);
				}
			);
			connection.query(
				`UPDATE users SET Pending_Presentation = 0 WHERE Authentication_Level > ${AUTHENTICATION_LOWER_LIMIT} && Authentication_Level < ${AUTHENTICATION_UPPER_LIMIT} && User_ID IN (${People})`,
				async function (err, result) {
					if (err) console.log(err);
					resolve(result);
				}
			);
			connection.release();
		});
		return;
	});
}

router.post('/', async function (req, res) {
	if ((await checkToken(req)) === 10) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return res.status(400).send("Couldn't get a connection");
			}
			connection.query(`UPDATE options Set Next_colloquium = '${req.body.Next_Colloquium}' WHERE Selected = 1`, async function (err, result, fields) {
				if (err) {
					console.log(err);
					res.status(500).send(err);
					connection.release();
				}
				await SetPendingForEveryone();
				MakeTokenMails();

				res.status(200).send();
			});
			connection.release();
		});
	} else {
		res.status(401).send('authentication error');
	}
});

module.exports = router;
