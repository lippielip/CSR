var pool = require('../database');
var mail = require('./mailswitch');
var getPresentations = require('./getPresentations');
var MakeTokenMails = require('../update/changeEmailStatus');

var d = new Date();

let users;
let moderator;
let canceledUser = {
	Username: '',
	User_ID: 0,
	E_Mail: '',
	FirstName: '-gekürztes Colloquium-',
	LastName: '',
	Pending_Presentation: 10
};

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

//This function checks daily for new Presentation inputs and sends out emails accordingly using the switch in the mailswitch.js file
async function dailyCheck () {
	var currentWeek = getWeekNumber(d);
	console.log('Week: ' + currentWeek[1] + ' Year: ' + currentWeek[0]);
	//fetching Presentation Data and saving it as an object
	let Presentations = await getPresentations();

	pool.getConnection(async function (err, connection) {
		// get the moderator by checking if Pending_Presentation value = 2
		await connection.query(
			`SELECT Username, User_ID, E_Mail, FirstName, LastName, Pending_Presentation, Last_Probability, Amount_A, Amount_B, Amount_C FROM users WHERE Pending_Presentation = 2`,
			async function (err, result, fields) {
				if (err) {
					console.log(err);
				} else {
					moderator = result[0];
				}
			}
		);
		//get the presenter by checking if upcoming presentations
		await connection.query(
			`SELECT U.Username, U.User_ID, U.E_Mail, U.FirstName, U.LastName, U.Pending_Presentation, U.Last_Probability, U.Amount_A, U.Amount_B, U.Amount_C FROM users U JOIN presentations P ON P.Presenter = U.User_ID 
			WHERE P.Date IN (
			SELECT MIN(P.DATE) FROM presentations P WHERE P.Date > CURRENT_DATE() )`,
			async function (err, result, fields) {
				if (err) {
					console.log(err);
				} else {
					//cant find any people with correct parameters update table accordingly (set status to -1 so the colloquium is canceled)
					if (result.length === 0) {
						console.log('No existing Presentations');
						mail(1);
					}

					//Presentations are available => send update mail
					if (result.length > 1) {
						console.log(`${result.length} Presenter available!`);
						users = result;
						mail(4, users, moderator, Presentations);
					}
				}
			}
		);
		connection.release();
		if (err) console.log(err);
	});
}

module.exports = dailyCheck;
