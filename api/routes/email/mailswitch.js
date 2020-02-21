const pool = require('../database');
const html = require('./mailtemplate');
const mailgun = require('../mailgun');
const SENDER_MAIL = mailgun.sender;
const mg = mailgun.mg;
let emails = '';
let data;

function getEmails () {
	return new Promise(function (resolve, reject) {
		pool.getConnection(async function (err, connection) {
			await connection.query(`SELECT E_Mail FROM users WHERE Authentication_Level < 10`, async function (err, result, fields) {
				let emails = result.map((x) => Object.values(x)).join(', ');
				resolve(emails);
			});
			connection.release();
			if (err) console.log(err);
		});
		return;
	});
}

async function sendMail (caseVar, users, moderator, Presentations) {
	emails = await getEmails();
	switch (caseVar) {
		case -1:
			data = {
				from: SENDER_MAIL,
				to: emails,
				subject: 'Colloquium Planning',
				html: `${html(
					`<p>Das Colloquium wird diese Woche nicht stattfinden, da nicht genug Leute anwesend sind.</p>
					<p>Wir wünschen euch noch eine schöne Woche!</p>
					`
				)}`
			};
			mg.messages().send(data, function (error, body) {
				if (error) console.log(error);
				console.log(body);
			});
			break;

		case 0:
			data = {
				from: SENDER_MAIL,
				to: emails,
				subject: 'Colloquium Planning',
				text: `Die Presenter diese Woche sind: ${users[0].FirstName} gewählt mit einer Warscheinlichkeit von ${(users[0].probability * 100).toFixed(2)}% und ${users[1]
					.FirstName}gewählt mit einer Warscheinlichkeit von ${(users[1].probability * 100).toFixed(2)}%
					Der Moderator dieser Woche ist : ${moderator.FirstName}
					Bitte tragt eure Presentationen zeitnah ein!`,
				html: `${html(
					`<br>
					<p>Die Presenter diese Woche sind:</p>
					 <p><b>${users[0].FirstName}</b> gewählt mit einer Warscheinlichkeit von ${(users[0].probability * 100).toFixed(2)}% und
					 <p><b>${users[1].FirstName}</b> gewählt mit einer Warscheinlichkeit von ${(users[1].probability * 100).toFixed(2)}%</p>
					  <p>Der Moderator dieser Woche ist : <b>${moderator.FirstName}</b></p>
					  <br>
					  <p>Bitte tragt eure Presentationen zeitnah ein!</p>`
				)}`
			};
			mg.messages().send(data, function (error, body) {
				if (error) console.log(error);
				console.log(body);
			});
			break;

		case 1:
			data = {
				from: SENDER_MAIL,
				to: emails,
				subject: 'Colloquium Planning',
				html: `${html(
					`<p>Beide Presentationen wurden eingetragen.</p>
			<p>Die Rundmail wird in kürze verschickt!</p>`
				)}`
			};

			mg.messages().send(data, function (error, body) {
				if (error) console.log(error);
				console.log(body);
			});
			break;

		case 2:
			if (users[0].Pending_Presentation === 1) {
				onelate(users[0].FirstName, users[1].FirstName);
			} else {
				onelate(users[1].FirstName, users[0].FirstName);
			}
			break;

		case 3:
			data = {
				from: SENDER_MAIL,
				to: emails,
				subject: 'Colloquium Planning',
				html: `${html(
					`<p>${users[0].FirstName} und ${users[1].FirstName} haben noch keine Vorträge eingetragen!</p>
					<p> Bitte zeitnah einen Vortrag eintragen!`
				)}`
			};

			mg.messages().send(data, function (error, body) {
				if (error) console.log(error);
				console.log(body);
			});
			break;

		case 4:
			data = {
				from: SENDER_MAIL,
				to: emails,
				subject: 'Colloquium Planning',
				html: `${html(
					`<p>hier die Themen des Colloquiums der aktuellen Woche:</p>
				<table>
						<tr>
						  <th>Thema</th>
						  <th>Vortragender</th>
						  <th>Kategorie</th>
						</tr>
						<tr>
						  <td>${users[0].User_ID === Presentations[0].Presenter ? Presentations[0].Topic : Presentations[1].Topic || 'Nicht eingetragen'}</td>
						  <td>${users[0].FirstName}</td>
						  <td>${users[0].User_ID === Presentations[0].Presenter ? Presentations[0].Presentation_Category : Presentations[1].Presentation_Category || 'Nicht eingetragen'}</td>
						</tr>
						<tr>
						  <td>${users[1].User_ID === Presentations[1].Presenter ? Presentations[1].Topic : Presentations[0].Topic || 'Nicht eingetragen'}</td>
						  <td>${users[1].FirstName}</td>
						  <td>${users[1].User_ID === Presentations[1].Presenter ? Presentations[1].Presentation_Category : Presentations[0].Presentation_Category || 'Nicht eingetragen'}</td>
						</tr>
					  </table>
					  <br>
					  <p>Der Moderator dieser Woche ist : <b>${moderator.FirstName}</b></p>`
				)}`
			};

			mg.messages().send(data, function (error, body) {
				if (error) console.log(error);
				console.log(body);
			});
			break;
	}
}

function onelate (lateUser, goodUser) {
	data = {
		from: SENDER_MAIL,
		to: emails,
		subject: 'Colloquium Planning',
		html: `${html(
			`<p>Vortrag von ${goodUser} wurde eingetragen.</p>
			<p>${lateUser} muss noch einen Vortrag eintragen.</p>`
		)}`
	};

	mg.messages().send(data, function (error, body) {
		if (error) console.log(error);
		console.log(body);
	});
}

module.exports = sendMail;
