var pool = require('../database');

async function getNewPresentations() {
	return new Promise(function(resolve, reject) {
		let PresenterID = [];
		pool.getConnection(async function(err, connection) {
			if (err) {
				console.log(err);
				return res.status(400).send("Couldn't get a connection");
			}
			connection.query(`SELECT Next_Colloquium from options WHERE selected = 1`, function(err, result, fields) {
				let Colloquium_Date = new Date(result[0].Next_Colloquium);
				Colloquium_Date.setMinutes(Colloquium_Date.getMinutes() + 300);
				Colloquium_Date = Colloquium_Date.toISOString();
				Colloquium_Date = Colloquium_Date.split('T')[0];
				connection.query(`SELECT Presenter, Date FROM presentations WHERE Date != 'NULL'`, function(err, result, fields) {
					if (err) console.log(err);
					for (let i = 0; i < result.length; i++) {
						if (result[i].Date === Colloquium_Date) {
							PresenterID.push(result[i].Presenter);
						}
					}
					resolve(PresenterID);
				});
			});
			connection.release();
		});
	});
}

module.exports = getNewPresentations;
