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

let officialMailSent = false;
let canceled = false;
let users;
let moderator;
let canceledUser = {
	Username  : '',
	User_ID   : '0',
	E_Mail    : '',
	FirstName : '-gekürztes Colloquium-',
	LastName  : ''
};
//This function checks daily for new Presentation inputs and sends out emails accordingly using the switch in the mailswitch.js file
async function dailyCheck () {
	var currentDay = d.getDay();
	var day = weekday[currentDay];
	let Presentations = await getPresentations();
	console.log('Today is: ' + day);
	pool.getConnection(async function (err, connection) {
		await connection.query(
			`SELECT Username, User_ID, E_Mail, FirstName, LastName, Pending_Presentation, Last_Probability, Amount_A, Amount_B, Amount_C FROM users WHERE Pending_Presentation = 2`,
			async function (err, result, fields) {
				if (err) console.log(err);
				moderator = result[0];
			}
		);
		await connection.query(
			`SELECT Username, User_ID, E_Mail, FirstName, LastName, Pending_Presentation, Last_Probability, Amount_A, Amount_B, Amount_C FROM users WHERE Pending_Presentation = 1 OR Pending_Presentation = 10`,
			async function (err, result, fields) {
				if (err) console.log(err);
				if (!canceled) {
					// both canceled == no colloquium
					if (result.length === 0) {
						console.log('Not enough Presenters!');
						mail(-1);
						canceled = true;
					} else {
						if (result.length === 1) {
							console.log('Only one Presenter!');
							users = [ result[0], canceledUser ];
						}

						if (result.length === 2) {
							console.log('2 Presenters available!');
							users = [ result[0], result[1] ];
						}
						//Tuesday
						if (currentDay === 2) {
							//Both Presenters filled in Presentation
							if (result[0].Pending_Presentation === 10 && result[1].Pending_Presentation === 10) {
								console.log('Both Presenters are on Time. Sending out official mail early.');
								mail(1, users);
								mail(4, users, moderator, Presentations);
								officialMailSent = true;
							}
							//One Presenter filled in Presentation
							if (
								(result[0].Pending_Presentation === 1 && result[1].Pending_Presentation === 10) ||
								(result[0].Pending_Presentation === 10 && result[1].Pending_Presentation === 1)
							) {
								console.log('One Presenter is on Time!');
								mail(2, users);
							}
							//No Presenter filled in Presentation
							if (result[0].Pending_Presentation === 1 && result[1].Pending_Presentation === 1) {
								console.log('Both Presenters are late!');
								mail(3, users);
							}
						}

						//Wednesday
						if (currentDay === 3 && officialMailSent === false) {
							console.log('Sending the offical mail on time!');
							mail(4, users, moderator, Presentations);
						}
					}
				}
				if (currentDay === 0) {
					officialMailSent = false;
					canceled = false;
				}
			}
		);
		connection.release();
		if (err) console.log(err);
	});
}

module.exports = dailyCheck;
