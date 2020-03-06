var pool = require('../database');

async function getMissingPeople() {
	return new Promise(function(resolve, reject) {
		let missingID = [];

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
				connection.query(`SELECT User, start, end FROM outofoffice `, function(err, result, fields) {
					if (err) return reject(err);
					for (let i = 0; i < result.length; i++) {
						start = result[i].start;
						end = result[i].end;
						if (start <= Colloquium_Date && Colloquium_Date <= end) {
							missingID.push(result[i].User);
						}
					}
					resolve(missingID);
				});
			});
			connection.release();
		});
	});
}

module.exports = getMissingPeople;
