var pool = require('../database');

async function getPresentations () {
	return new Promise(function (resolve, reject) {
		var Presentations;
		pool.getConnection(async function (err, connection) {
			await connection.query(
				`SELECT Presentation_ID, Topic, Presenter, Presentation_Category FROM presentations P JOIN users U ON P.Presenter = U.User_ID 
				WHERE P.Date IN (
				SELECT MIN(P.DATE) FROM presentations P WHERE P.Date > CURRENT_DATE() )`,
				async function (err, result, fields) {
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
				}
			);
			if (err) console.log(err);
			connection.release();
		});
		return;
	});
}
module.exports = getPresentations;
