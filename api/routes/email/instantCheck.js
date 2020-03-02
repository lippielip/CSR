var pool = require('../database');
var MakeTokenMails = require('../update/changeEmailStatus');
const AUTHENTICATION_UPPER_LIMIT = 6;
const AUTHENTICATION_LOWER_LIMIT = 4;
var d = new Date();

function getWeekNumber (d) {
	// Copy date so don't modify original
	d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
	// Set to nearest Thursday: current date + 4 - current day number
	// Make Sunday's day number 7
	d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
	// Get first day of year
	var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	// Calculate full weeks to nearest Thursday
	var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
	// Return array of year and week number
	return [
		d.getUTCFullYear(),
		weekNo
	];
}

function instantCheck () {
	console.log('Checking Changes...');
	var currentWeek = getWeekNumber(d);
	// Special function that resets the Presentation amount of every user for the new year (happens yearly)
	if (currentWeek[1] === 1) {
		pool.getConnection(async function (err, connection) {
			if (err) {
				console.log(err);
				return;
			}
			await connection.query(`UPDATE users SET Amount_A = 0, Amount_B = 0, Amount_C = 0`, async function (err, result) {
				if (err) console.log(err);
			});
			connection.release();
		});
	}
	pool.getConnection(async function (err, connection) {
		if (err) {
			console.log(err);
			return;
		}
		connection.query(
			`SELECT Username, User_ID, E_Mail, FirstName, LastName, Pending_Presentation, Last_Probability, Amount_A, Amount_B, Amount_C FROM users WHERE Pending_Presentation = 1 || Pending_Presentation = 10`,
			async function (err, result, fields) {
				if (err) console.log(err);
				if (result.length < 2) {
					pool.getConnection(async function (err, connection) {
						if (err) {
							console.log(err);
							return;
						}
						connection.query(
							`UPDATE options \
SET Next_Colloquium = \
IF(DAYOFWEEK(DATE_ADD(Next_Colloquium, INTERVAL 1 DAY)) = 7, (DATE_ADD(Next_Colloquium, INTERVAL 3 DAY)), \
IF(DAYOFWEEK(DATE_ADD(Next_Colloquium, INTERVAL 1 DAY)) = 1, (DATE_ADD(Next_Colloquium, INTERVAL 2 DAY)), \
(DATE_ADD(Next_Colloquium, INTERVAL 1 DAY)))) \
WHERE Selected = 1`,
							function (err, result) {
								if (err) console.log(err);
							}
						);
						connection.query(
							`UPDATE users SET Pending_Presentation = 1 WHERE Authentication_Level > ${AUTHENTICATION_LOWER_LIMIT} && Authentication_Level < ${AUTHENTICATION_UPPER_LIMIT}`,
							async function (err, result) {
								if (err) console.log(err);
							}
						);
					});
					MakeTokenMails();
				}
			}
		);
		connection.release();
	});
}

module.exports = instantCheck;
