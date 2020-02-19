var pool = require('../database');
var mail = require('./mailswitch');
var getPresentations = require('./getPresentations');

var d = new Date();
var weekday = new Array(7);
weekday[0] = 'Sunday';
weekday[1] = 'Monday';
weekday[2] = 'Tuesday';
weekday[3] = 'Wednesday';
weekday[4] = 'Thursday';
weekday[5] = 'Friday';
weekday[6] = 'Saturday';

let status;
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
	var currentDay = d.getDay();
	var day = weekday[currentDay];
	console.log('Today is: ' + day);

	var currentWeek = getWeekNumber(d);
	console.log('Week: ' + currentWeek[1] + ' Year: ' + currentWeek[0]);
	//fetching Presentation Data and saving it as an object
	let Presentations = await getPresentations();

	pool.getConnection(async function (err, connection) {
		// get the presentation_status every day to check if emails still have to be sent
		await connection.query(`SELECT * FROM presentation_status WHERE Year = ${currentWeek[0]} AND Calendar_Week = ${currentWeek[1]}`, async function (err, result) {
			if (err) console.log(err);
			if (result.length === 0) {
				//create an entry for the week if it doesn't exist yet (shouldn't be necessary => might indicate a bug in the chooseRandom function)
				await connection.query(`INSERT INTO presentation_status (Year, Calendar_Week) VALUES ("${currentWeek[0]}","${currentWeek[1]}")`, async function (err, result) {});
			} else {
				//if it does exist then fill in the status variable
				status = result[0].Status;
			}
		});
		// get the moderator by checking if Pending_Presentation value = 2
		await connection.query(
			`SELECT Username, User_ID, E_Mail, FirstName, LastName, Pending_Presentation, Last_Probability, Amount_A, Amount_B, Amount_C FROM users WHERE Pending_Presentation = 2`,
			async function (err, result, fields) {
				if (err) console.log(err);
				moderator = result[0];
			}
		);
		//get the presenter by checking if Pending_Presentation value = 1 or 10
		await connection.query(
			`SELECT Username, User_ID, E_Mail, FirstName, LastName, Pending_Presentation, Last_Probability, Amount_A, Amount_B, Amount_C FROM users WHERE Pending_Presentation = 1 OR Pending_Presentation = 10`,
			async function (err, result, fields) {
				if (err) console.log(err);

				//cant find any people with correct parameters update table accordingly (set status to -1 so the colloquium is canceled)
				if (result.length === 0 && status !== -1) {
					console.log('Not enough Presenters!');
					mail(-1);
					connection.query(
						`UPDATE presentation_status SET Status = -1, Presenter1 = NULL, Presenter2 = NULL, Moderator = NULL WHERE Year = ${currentWeek[0]} AND Calendar_Week = ${currentWeek[1]}`,
						async function (err, result) {
							if (err) console.log(err);
						}
					);
					status = -1;
				}
				// both canceled == no colloquium
				if (status !== -1) {
					//only one person with correct parameter
					if (result.length === 1) {
						console.log('Only one Presenter!');
						users = [
							result[0],
							canceledUser
						];
						connection.query(
							`UPDATE presentation_status SET Presenter1 = ${result[0]
								.User_ID}, Presenter2 = NULL, Moderator = ${moderator.User_ID}  WHERE Year = ${currentWeek[0]} AND Calendar_Week = ${currentWeek[1]}`,
							async function (err, result) {
								if (err) console.log(err);
							}
						);
					}

					//both are available and are inserted into the table
					if (result.length === 2) {
						console.log('2 Presenters available!');
						users = [
							result[0],
							result[1]
						];
						connection.query(
							`UPDATE presentation_status SET Presenter1 = ${result[0].User_ID}, Presenter2 = ${result[1]
								.User_ID}, Moderator = ${moderator.User_ID} WHERE Year = ${currentWeek[0]} AND Calendar_Week = ${currentWeek[1]}`,
							async function (err, result) {
								if (err) console.log(err);
							}
						);
					}
					//Tuesday
					if (currentDay === 2) {
						//Both Presenters filled in Presentation
						if (users[0].Pending_Presentation === 10 && users[1].Pending_Presentation === 10) {
							console.log('Both Presenters are on Time. Sending out official mail early.');
							mail(1, users);
							mail(4, users, moderator, Presentations);
							connection.query(`UPDATE presentation_status SET Status = 1 WHERE Year = ${currentWeek[0]} AND Calendar_Week = ${currentWeek[1]}`, async function (
								err,
								result
							) {
								if (err) console.log(err);
							});
						}
						//One Presenter filled in Presentation
						if (
							(users[0].Pending_Presentation === 1 && users[1].Pending_Presentation === 10) ||
							(users[0].Pending_Presentation === 10 && users[1].Pending_Presentation === 1)
						) {
							console.log('One Presenter is on Time!');
							mail(2, users);
						}
						//No Presenter filled in Presentation
						if (users[0].Pending_Presentation === 1 && users[1].Pending_Presentation === 1) {
							console.log('Both Presenters are late!');
							mail(3, users);
						}
					}

					//Wednesday
					if (currentDay === 3 && status === 0) {
						console.log('Sending the offical mail on time!');
						mail(4, users, moderator, Presentations);
						connection.query(`UPDATE presentation_status SET Status = 1 WHERE Year = ${currentWeek[0]} AND Calendar_Week = ${currentWeek[1]}`, async function (
							err,
							result
						) {
							if (err) console.log(err);
						});
					}
				} else {
					console.log("Not to worry, we're still flying half a ship ( Colloquium already canceled ) ");
				}
			}
		);
		connection.release();
		if (err) console.log(err);
	});
}

module.exports = dailyCheck;
