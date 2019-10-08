const connection = require('../database').connection;
const html = require('./mailtemplate');
const mailgun = require('../mailgun');
const SENDER_MAIL = mailgun.sender;
const mg = mailgun.mg;

let emails;
async function sendMail (caseVar, users, moderator, Presentations) {
	pool.getConnection(async function (err, connection) {
		await connection.query(`SELECT E_Mail FROM users WHERE Authentication_Level < 10`, async function (err, result, fields) {
			emails = emails = result.map((x) => Object.values(x)).join(', ');
		});
		connection.release();
		if (err) console.log(err);
	});
	await new Promise((resolve) => setTimeout(resolve, 200));
	switch (caseVar) {
		case -1:
			canceled();
			break;

		case 0:
			monday(users, moderator);
			break;

		case 1:
			onTime();
			break;

		case 2:
			if (users[0].Pending_Presentation === 1) {
				onelate(users[0].FirstName, users[1].FirstName);
			} else {
				onelate(users[1].FirstName, users[0].FirstName);
			}
			break;

		case 3:
			bothlate(users);
			break;

		case 4:
			wednesday(users, moderator, Presentations);
			break;
	}
}

function monday (users, moderator) {
	console.log(emails);
	console.log(`User ${users[0].Username} und ${users[1].Username} wurden für das Colloquium gewählt. Bitte eintragen!`);

	const data = {
		from    : SENDER_MAIL,
		to      : 'philipp.braun@telekom.de',
		subject : 'Colloquium Planning',
		text    : `Die Presenter diese Woche sind: ${users[0].FirstName} gewählt mit einer Warscheinlichkeit von ${(users[0].probability * 100).toFixed(2)}% und ${users[1]
			.FirstName}gewählt mit einer Warscheinlichkeit von ${(users[1].probability * 100).toFixed(2)}%
Der Moderator dieser Woche ist : ${moderator.FirstName}
Bitte tragt eure Presentationen zeitnah ein!`,
		html    : `${html(
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
}

function onTime () {
	console.log('Beide Nutzer haben erfolgreich ihre Präsentation eingetragen!');

	const data = {
		from    : SENDER_MAIL,
		to      : 'philipp.braun@telekom.de',
		subject : 'Colloquium Planning',
		html    : `${html(
			`<p>Beide Presentationen wurden eingetragen.</p>
			<p>Die Rundmail wird in kürze verschickt!</p>`
		)}`
	};

	mg.messages().send(data, function (error, body) {
		if (error) console.log(error);
	});
}

function onelate (lateUser, goodUser) {
	console.log(`Vortrag von ${goodUser} wurde eingetragen. User: ${lateUser} muss noch seinen Vortrag eintragen.`);

	const data = {
		from    : SENDER_MAIL,
		to      : 'philipp.braun@telekom.de',
		subject : 'Colloquium Planning',
		html    : `${html(
			`<p>Vortrag von ${goodUser} wurde eingetragen.</p>
			<p>${lateUser} muss noch einen Vortrag eintragen.</p>`
		)}`
	};

	mg.messages().send(data, function (error, body) {
		if (error) console.log(error);
	});
}

function bothlate (users) {
	console.log(`User ${users[0].Username} und User ${users[1].Username} haben noch keine Vorträge eingetragen!`);

	const data = {
		from    : SENDER_MAIL,
		to      : 'philipp.braun@telekom.de',
		subject : 'Colloquium Planning',
		html    : `${html(
			`<p>${users[0].FirstName} und User ${users[1].FirstName} haben noch keine Vorträge eingetragen!</p>
			<p> Bitte zeitnah einen Vortrag eintragen!`
		)}`
	};

	mg.messages().send(data, function (error, body) {
		if (error) console.log(error);
	});
}
function wednesday (users, moderator, Presentations) {
	const data = {
		from    : SENDER_MAIL,
		to      : 'philipp.braun@telekom.de',
		subject : 'Colloquium Planning',
		html    : `${html(
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
	});
}

function canceled () {
	console.log('Colloquium findet nicht statt. Nicht genug Leute anwesend!');

	const data = {
		from    : SENDER_MAIL,
		to      : 'philipp.braun@telekom.de, <philipp.braun@telekom.de>',
		subject : 'Colloquium Planning',
		html    : `${html(
			`<p>Das Colloquium wird diese Woche nicht stattfinden, da nicht genug Leute anwesend sind.</p>
			<p>Wir wünschen euch noch eine schöne Woche!</p>
			`
		)}`
	};

	mg.messages().send(data, function (error, body) {
		if (error) console.log(error);
	});
}

module.exports = sendMail;
