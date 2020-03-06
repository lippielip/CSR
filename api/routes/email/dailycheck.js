var pool = require('../database');
var mail = require('./mailswitch');
var getPresentations = require('./getPresentations');

const AUTHENTICATION_UPPER_LIMIT = 8;
const AUTHENTICATION_LOWER_LIMIT = 4;

let users;
let moderator;

async function checkDate() {
	return new Promise(function(resolve, reject) {
		pool.getConnection(function(err, connection) {
			if (err) {
				console.log(err);
				return;
			}
			connection.query(`SELECT Email_Frequency, Last_Email FROM options WHERE Selected = 1`, function(err, result, fields) {
				if (err) {
					console.log(err);
				}
				let DaysSince = new Date();
				DaysSince.setDate(DaysSince.getDate() - result[0].Email_Frequency);
				if (Date.parse(result[0].Last_Email) < DaysSince || result[0].Last_Email === null) {
					console.log(`It has been ${result[0].Email_Frequency} Days. Executing....`);
					connection.query(`UPDATE options SET Last_Email = curDate() WHERE Selected = 1`, function(err, result, fields) {
						if (err) {
							console.log(err);
						}
					});
					resolve(true);
				} else {
					console.log('[INFO] Not sending mails yet');
					resolve(false);
				}
			});
			connection.release();
		});
		return;
	});
}

async function CheckUserAccountAmount() {
	return new Promise(function(resolve, reject) {
		pool.getConnection(function(err, connection) {
			if (err) {
				console.log(err);
				return;
			}
			connection.query(
				`SELECT User_ID FROM users WHERE Authentication_Level > ${AUTHENTICATION_LOWER_LIMIT} && Authentication_Level < ${AUTHENTICATION_UPPER_LIMIT}`,
				async function(err, result, fields) {
					if (err) console.log(err);
					if (result.length > 2) {
						resolve(true);
					} else {
						resolve(false);
					}
				}
			);
			connection.release();
		});
		return;
	});
}

//This function checks daily for new Presentation inputs and sends out emails accordingly using the switch in the mailswitch.js file
async function dailyCheck() {
	if (await CheckUserAccountAmount()) {
		if (await checkDate()) {
			//fetching Presentation Data and saving it as an object
			let Presentations = await getPresentations();

			pool.getConnection(async function(err, connection) {
				// get the moderator by checking if Pending_Presentation value = 2
				await connection.query(
					`SELECT Username, User_ID, E_Mail, FirstName, LastName, Pending_Presentation, Last_Probability, Amount_A, Amount_B, Amount_C FROM users WHERE Pending_Presentation = 2`,
					async function(err, result, fields) {
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
					async function(err, result, fields) {
						if (err) {
							console.log(err);
						} else {
							//cant find any people with correct parameters update table accordingly (set status to -1 so the colloquium is canceled)
							if (result.length === 0) {
								console.log('No Presentations filled in.');
								mail(1);
							}

							//Presentations are available => send update mail
							if (result.length >= 1) {
								console.log(`${result.length} Presentations filled in!`);
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
	}
}

module.exports = dailyCheck;
