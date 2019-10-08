var express = require('express');
var router = express.Router();
var pool = require('../database').connection;

function getNextDayOfWeek (date, dayOfWeek) {
	var resultDate = date;
	resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);

	return resultDate;
}

async function getMissingPeople () {
	let missingID = [];
	var friday = Date.parse(getNextDayOfWeek(new Date(), 5).toISOString().split('T')[0]);
	pool.getConnection(async function (err, connection) {
		await connection.query(`SELECT User, start, end FROM outofoffice `, function (err, result, fields) {
			if (err) console.log(err);
			for (let i = 0; i < result.length; i++) {
				start = Date.parse(result[i].start);
				end = Date.parse(result[i].end);
				if (start <= friday && friday <= end) {
					missingID.push(result[i].User);
				}
			}
		});
		connection.release();
		if (err) console.log(err);
	});
	await new Promise((resolve) => setTimeout(resolve, 500));
	return missingID;
}

module.exports = getMissingPeople;
