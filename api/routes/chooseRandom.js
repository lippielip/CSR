var pool = require('./database');
var mail = require('./email/mailswitch');
var getMissingPeople = require('./get/getMissingPeople');
var getNewPresentations = require('./get/getNewPresentations');
var MakeTokenMails = require('./update/changeEmailStatus');

/* Random Function weighting of different Presentation Types */
/*************************************************************/
/************************MODIFIERS****************************/

const A_WEIGHT = 1;
const B_WEIGHT = 1.5;
const C_WEIGHT = 2;
const WEIGHT_FACTOR = 10000;
//define what Authentication levels have to present (everything inside these two values have to present)
const AUTHENTICATION_UPPER_LIMIT = 6;
const AUTHENTICATION_LOWER_LIMIT = 4;

/*************************************************************/

let probability;
let IDmap = [];
let voluntaryCount = 0;

function rand (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getObjectIndex (array, attr, value) {
	for (var i = 0; i < array.length; i += 1) {
		if (array[i][attr] === value) {
			return i;
		}
	}
	return -1;
}

function generateWeighedList (list, weight) {
	var weighed_list = [];
	var sum = 0;
	probability = [];

	// Loop over weights
	for (var i = 0; i < weight.length; i++) {
		var multiples = Math.floor(weight[i] * WEIGHT_FACTOR);
		if (multiples <= 0) multiples = 1;
		sum += multiples;
		// Loop over the list of items
		for (var j = 0; j < multiples; j++) {
			weighed_list.push(list[i]);
		}
	}
	for (var i = 0; i < weight.length; i++) {
		var multiples = Math.floor(weight[i] * WEIGHT_FACTOR);
		if (multiples <= 0) multiples = 1;
		probability.push(multiples / sum);
	}
	return weighed_list;
}

async function getPresenters (combList, list_length) {
	return new Promise(function (resolve, reject) {
		let list = combList.map(function (entry) {
			return entry.User_ID;
		});

		let weights = combList.map(function (entry) {
			if (entry.Presentations_held > 99) {
				return 0;
			} else {
				return 1 - entry.Presentations_held / Math.floor(52 / list_length);
			}
		});

		let weighed_list = generateWeighedList(list, weights);
		let random_num = Math.floor(Math.random() * weighed_list.length); // rand(0, weighed_list.length - 1);
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return;
			}
			connection.query(
				`UPDATE users SET Pending_Presentation = 1, Last_Probability = ${probability[list.indexOf(weighed_list[random_num])]} WHERE User_ID = ${weighed_list[random_num]} `,
				function (err, result, fields) {
					if (err) {
						console.log(err);
					} else {
						console.log(weighed_list);
						console.log(random_num);
						console.log(weighed_list[random_num]);
						console.log(result);
						console.log(probability[list.indexOf(weighed_list[random_num])]);
						resolve(list.indexOf(weighed_list[random_num]));
					}
				}
			);
			connection.release();
		});
		return;
	});
}

async function getModerator (combList) {
	return new Promise(function (resolve, reject) {
		let list = combList.map(function (entry) {
			return entry.User_ID;
		});
		let UserIndex = Math.floor(Math.random() * list.length);
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return;
			}
			connection.query(`UPDATE users SET Pending_Presentation = 2 WHERE User_ID = ${list[UserIndex]} `, function (err, result, fields) {
				if (err) console.log(err);
				resolve(UserIndex);
			});
			connection.release();
		});
		return;
	});
}

async function GetPresentPeople (MissingPeople, NewPresentations) {
	return new Promise(function (resolve, reject) {
		pool.getConnection(async function (err, connection) {
			if (err) {
				console.log(err);
				return;
			}
			connection.query(
				`SELECT User_ID, Username, E_Mail, Pending_Presentation, Authentication_Level, FirstName, LastName, Amount_A, Amount_B, Amount_C FROM users`,
				async function (err, result, fields) {
					if (err) console.log(err);
					for (let i = 0; i < result.length; i++) {
						if (result[i].Authentication_Level > AUTHENTICATION_UPPER_LIMIT) {
							console.log('\x1b[35m', 'Ignoring User with preferred Matchmaking: ' + result[i].Username, '\x1b[0m');
							continue;
						}
						if (result[i].Authentication_Level < AUTHENTICATION_LOWER_LIMIT) {
							console.log('\x1b[35m', 'Ignoring Guest User: ' + result[i].Username, '\x1b[0m');
							continue;
						}
						//if someone is not present, then they are not added to the roulette
						if (MissingPeople.includes(result[i].User_ID)) {
							console.log('\x1b[35m', 'Ignoring user: ' + result[i].Username + ' (absent)', '\x1b[0m');
							connection.query(`UPDATE users SET Pending_Presentation = 0 WHERE User_ID = ${result[i].User_ID} `, function (err, result, fields) {
								if (err) console.log(err);
							});
						} else {
							if (NewPresentations.includes(result[i].User_ID)) {
								voluntaryCount++;
								console.log('\x1b[35m', 'voluntary Presentation : ' + result[i].Username, '\x1b[0m');
								connection.query(`UPDATE users SET Pending_Presentation = 10, Last_Probability = 1 WHERE User_ID = ${result[i].User_ID} `, function (
									err,
									result,
									fields
								) {
									if (err) console.log(err);
								});
								IDmap.push({
									User_ID: result[i].User_ID,
									Username: result[i].Username,
									Presentations_held: result[i].Amount_A * A_WEIGHT + result[i].Amount_B * B_WEIGHT + result[i].Amount_C * C_WEIGHT,
									E_Mail: result[i].E_Mail,
									FirstName: result[i].FirstName,
									LastName: result[i].LastName
								});
							} else {
								/*if someoneone is present, then if they havent held a presentation last week, get the sum of the presentations they have held this year
								  if they had to present last week, then their presentation amount is set to 100 so they have the lowest prob of getting picked again
								  normal probability*/
								if (result[i].Pending_Presentation != 10) {
									IDmap.push({
										User_ID: result[i].User_ID,
										Username: result[i].Username,
										Presentations_held: result[i].Amount_A * A_WEIGHT + result[i].Amount_B * B_WEIGHT + result[i].Amount_C * C_WEIGHT,
										E_Mail: result[i].E_Mail,
										FirstName: result[i].FirstName,
										LastName: result[i].LastName
									});
									connection.query(`UPDATE users SET Pending_Presentation = 0 WHERE User_ID = ${result[i].User_ID} `, function (err, result, fields) {
										if (err) console.log(err);
									});
								} else {
									//low prob of getting picked
									console.log('\x1b[36m', 'Ignoring user: ' + result[i].Username + ' (last presenter)', '\x1b[0m');
									IDmap.push({
										User_ID: result[i].User_ID,
										Username: result[i].Username,
										Presentations_held: 100,
										E_Mail: result[i].E_Mail,
										FirstName: result[i].FirstName,
										LastName: result[i].LastName
									});
									connection.query(`UPDATE users SET Pending_Presentation = 0 WHERE User_ID = ${result[i].User_ID} `, function (err, result, fields) {
										if (err) console.log(err);
									});
								}
							}
						}
					}
					resolve(IDmap);
				}
			);
			connection.release();
		});
		return;
	});
}

async function checkExecution () {
	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return;
			}
			connection.query(`Select Choose_Random, Colloquium_Frequency from options WHERE Selected = 1`, function (err, result, fields) {
				if (err) console.log(err);
				resolve(result[0]);
			});
			connection.release();
		});
		return;
	});
}

async function PickWeeklyPresenters () {
	let ExecutionVar = await checkExecution();
	if ((await ExecutionVar.Choose_Random) === 1) {
		console.log('\x1b[33m', 'INFO: Picking Presenters', '\x1b[0m');
		//Check if enough people are present, regardless of if they had a presentation last week
		let MissingPeople = await getMissingPeople();
		let NewPresentations = await getNewPresentations();

		await GetPresentPeople(MissingPeople, NewPresentations);
		if (IDmap.length < 3) {
			mail(-1);
		} else {
			const USER_AMOUNT = IDmap.length;
			let Presenter1;
			let Presenter2;
			if (voluntaryCount === 1) {
				let IdIndex1 = getObjectIndex(IDmap, 'User_ID', NewPresentations[0]);
				Presenter1 = IDmap[IdIndex1];
				Presenter1.probability = 1;
				IDmap.splice(IdIndex1, 1);
				let IdIndex2 = await getPresenters(IDmap, USER_AMOUNT);
				Presenter2 = IDmap[IdIndex2];
				Presenter2.probability = probability[IdIndex2];
				IDmap.splice(IdIndex2, 1);
			}

			if (voluntaryCount >= 2) {
				let IdIndex1 = getObjectIndex(IDmap, 'User_ID', NewPresentations[0]);
				Presenter1 = IDmap[IdIndex1];
				Presenter1.probability = 1;
				IDmap.splice(IdIndex1, 1);

				let IdIndex2 = getObjectIndex(IDmap, 'User_ID', NewPresentations[1]);
				Presenter2 = IDmap[IdIndex2];
				Presenter2.probability = 1;
				IDmap.splice(IdIndex2, 1);
				if (voluntaryCount >= 3) {
					console.log('\x1b[31m', 'ERROR : EXCESSIVE_PRESENTATION_AMOUNT', '\x1b[0m');
				}
			}

			if (voluntaryCount === 0) {
				let IdIndex1 = await getPresenters(IDmap, USER_AMOUNT);
				Presenter1 = IDmap[IdIndex1];
				Presenter1.probability = probability[IdIndex1];
				IDmap.splice(IdIndex1, 1);

				let IdIndex2 = await getPresenters(IDmap, USER_AMOUNT);
				Presenter2 = IDmap[IdIndex2];
				Presenter2.probability = probability[IdIndex2];
				IDmap.splice(IdIndex2, 1);
			}
			let IdIndex3 = await getModerator(IDmap);
			let Moderator = IDmap[IdIndex3];
			let users = [
				Presenter1,
				Presenter2
			];
			mail(0, users, Moderator);
			console.log('\x1b[33m', 'Success!', '\x1b[0m');
		}
	} else {
		console.log('INFO: Randomizer Disabled');
		pool.getConnection(async function (err, connection) {
			if (err) {
				console.log(err);
				return;
			}
			await connection.query(
				`UPDATE options \
SET Next_Colloquium = \
IF(DAYOFWEEK(DATE_ADD(CURRENT_DATE(), INTERVAL Colloquium_Frequency DAY)) = 7, (DATE_ADD(CURRENT_DATE(), INTERVAL Colloquium_Frequency + 2 DAY)), \
IF(DAYOFWEEK(DATE_ADD(CURRENT_DATE(), INTERVAL Colloquium_Frequency DAY)) = 1, (DATE_ADD(CURRENT_DATE(), INTERVAL Colloquium_Frequency + 1 DAY)), \
(DATE_ADD(CURRENT_DATE(), INTERVAL Colloquium_Frequency DAY)))) \
WHERE Selected = 1`,
				async function (err, result) {
					if (err) console.log(err);
				}
			);
			await connection.query(
				`UPDATE users SET Pending_Presentation = 1 WHERE Authentication_Level > ${AUTHENTICATION_LOWER_LIMIT} && Authentication_Level < ${AUTHENTICATION_UPPER_LIMIT}`,
				async function (err, result) {
					if (err) console.log(err);
				}
			);
			connection.release();
		});
		MakeTokenMails();
	}
}
module.exports = PickWeeklyPresenters;
