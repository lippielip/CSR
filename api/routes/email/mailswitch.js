const pool = require('../database');
const html = require('./mailtemplate');
const mailgun = require('../mailgun');
const SENDER_MAIL = mailgun.sender;
const DOMAIN_NAME = process.env.DOMAIN_NAME;
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
			//canceled Mail
			data = {
				from: SENDER_MAIL,
				to: emails,
				subject: 'Colloquium Planning',
				html: `${html(
					`<p>Das nächste Colloquium wird nicht stattfinden, da nicht genug Leute anwesend sind.</p>
					<p>Wir wünschen euch noch eine schöne Woche!</p>
					`
				)}`
			};
			mg.messages().send(data, function (error, body) {
				if (error) console.log(error);
				//console.log(body);
			});
			break;

		case 0:
			// Choose Random Mail
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
					`<p>Es wurden noch keine Präsentationen für den nächsten Termin eingetragen.</p>
					<p>Wir wünschen euch noch eine schöne Woche!</p>
					`
				)}`
			};
			mg.messages().send(data, function (error, body) {
				if (error) console.log(error);
				//console.log(body);
			});
			break;

		case 2:
			//canceled Mail
			data = {
				from: SENDER_MAIL,
				to: users,
				subject: 'Colloquium Planning',
				html: `${html(
					`<p>Das nächste Colloquium wird am ${Presentations} stattfinden. Ist dieser Termin warnehmbar?</p>
					<a href="${DOMAIN_NAME}/confirmattendance?token=${moderator}&answer=1" class="btn-primary" itemprop="url" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 5px; text-transform: capitalize; background-color: #348eda; margin: 0; border-color: #348eda; border-style: solid; border-width: 10px 20px;">Ja</a>
					<a href="${DOMAIN_NAME}/confirmattendance?token=${moderator}&answer=0" class="btn-primary" itemprop="url" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 5px; text-transform: capitalize; background-color: #348eda; margin: 0; border-color: #348eda; border-style: solid; border-width: 10px 20px;">Nein</a>
					`
				)}`
			};
			mg.messages().send(data, function (error, body) {
				if (error) console.log(error);
				//console.log(body);
			});
			break;

		case 4:
			//Broad Info mail
			let htmlBlock = '';
			for (let i = 0; i < users.length; i++) {
				htmlBlock += `<tr>\
<td>${users[i].User_ID === Presentations[i].Presenter ? Presentations[i].Topic : 'Nicht eingetragen'}</td>\
<td>${users[i].FirstName}</td>\
<td>${users[i].User_ID === Presentations[i].Presenter ? Presentations[i].Presentation_Category : 'Nicht eingetragen'}</td>\
</tr>`;
			}
			console.dir(htmlBlock);
			data = {
				from: SENDER_MAIL,
				to: emails,
				subject: 'Colloquium Planning',
				html: `${html(
					`<p>hier die eingetragenen Themen des nächsten Colloquiums:</p>
				<table>
						<tr>
						  <th>Thema</th>
						  <th>Vortragender</th>
						  <th>Kategorie</th>
						</tr>
						${htmlBlock}
					  </table>`
				)}`
			};
			mg.messages().send(data, function (error, body) {
				if (error) console.log(error);
				//console.log(body);
			});
			break;
	}
}

module.exports = sendMail;
