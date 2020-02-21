var pool = require('../database');

async function getPresentations () {
	return new Promise(function (resolve, reject) {
		function getNextDayOfWeek (date, dayOfWeek) {
			var resultDate = date;
			resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
			return resultDate;
		}

		var friday = getNextDayOfWeek(new Date(), 5).toISOString().split('T')[0];
		var Presentations;
		pool.getConnection(async function (err, connection) {
			await connection.query(`SELECT * FROM presentations WHERE Date LIKE '%${friday}%'`, async function (err, result, fields) {
				if (err) console.log(err);
				if (result.length === 1) {
					result[1] = {
						Topic: '',
						Presenter: 0,
						Presentation_Category: ''
					};
				}
				if (result.length === 0) {
					result[0] = {
						Topic: '',
						Presenter: 0,
						Presentation_Category: ''
					};
					result[1] = {
						Topic: '',
						Presenter: 0,
						Presentation_Category: ''
					};
				}
				Presentations = await result;
				resolve(Presentations);
			});
			if (err) console.log(err);
			connection.release();
		});
		return;
	});
}
module.exports = getPresentations;
