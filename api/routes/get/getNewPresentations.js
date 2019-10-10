var pool = require('../database');

function getNextDayOfWeek (date, dayOfWeek) {
	var resultDate = date;
	resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);

	return resultDate;
}

async function getNewPresentations () {
	new Promise(function (resolve, reject) {
		let PresenterID = [];

		var friday = Date.parse(getNextDayOfWeek(new Date(), 5).toISOString().split('T')[0]);
		pool.getConnection(async function (err, connection) {
			if (err) {
				console.log(err);
				return res.status(400).send("Couldn't get a connection");
			}
			connection.query(`SELECT Presenter, Date FROM presentations WHERE Date != 'NULL'`, function (err, result, fields) {
				if (err) console.log(err);
				for (let i = 0; i < result.length; i++) {
					PresentationDate = Date.parse(result[i].Date.split('T')[0]);
					if (PresentationDate === friday) {
						PresenterID.push(result[i].Presenter);
					}
				}
				resolve(PresenterID);
			});
			connection.release();
		});
		return PresenterID;
	});
}

module.exports = getNewPresentations;
