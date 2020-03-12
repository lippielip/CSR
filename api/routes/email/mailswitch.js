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
function getNextColloquium () {
	return new Promise(function (resolve, reject) {
		pool.getConnection(async function (err, connection) {
			if (err) {
				console.log(err);
				return;
			}
			connection.query(`Select Next_Colloquium from options WHERE Selected = 1`, async function (err, result) {
				if (err) {
					console.log(err);
					return;
				}
				let Colloquium_Date = new Date(result[0].Next_Colloquium);
				Colloquium_Date.setMinutes(Colloquium_Date.getMinutes() + 300);
				Colloquium_Date = Colloquium_Date.toISOString();
				Colloquium_Date = Colloquium_Date.split('T')[0];
				let Colloquium_DateNew = Colloquium_Date.split('-');
				Colloquium_Date = [
					Colloquium_DateNew[2],
					Colloquium_DateNew[1],
					Colloquium_DateNew[0]
				].join('.');
				resolve(Colloquium_Date);
			});
			connection.release();
		});
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
					`<p>Es wurden noch keine Präsentationen für den nächsten Termin am: <b>${await getNextColloquium()}</b> eingetragen.</p>
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
			//Decision Mail
			let myDate = new Date(Presentations);
			myDate.setMinutes(myDate.getMinutes() + 300);
			myDate = myDate.toISOString();
			myDate = myDate.split('T')[0];
			let newDate = myDate.split('-');
			myDate = [
				newDate[2],
				newDate[1],
				newDate[0]
			].join('.');
			data = {
				from: SENDER_MAIL,
				to: users,
				subject: 'Colloquium Planning',
				html: `${html(
					`
					Das nächste Colloquium wird am <b>${myDate}</b> stattfinden. Ist dieser Termin warnehmbar?<br>
					<br>
					<br>
					<a class="x_btn" href="${DOMAIN_NAME}/confirmattendance?token=${moderator}&answer=1" style="display:block; margin-left:auto; margin-right:auto; font-family:'TeleGrotesk Next','Arial','Helvetica',sans-serif; background:#ededed; border:1px solid #b2b2b2; border-radius:4px; color:#383838!important; display:block; font-size:18px; line-height:18px; margin-top:12px; padding:8px 0; text-align:center; text-decoration:none!important; width:151px">
					 Ja</a>
					 <a class="x_btn" href="${DOMAIN_NAME}/confirmattendance?token=${moderator}&answer=0" style="display:block; margin-left:auto; margin-right:auto; font-family:'TeleGrotesk Next','Arial','Helvetica',sans-serif; background:#ededed; border:1px solid #b2b2b2; border-radius:4px; color:#383838!important; display:block; font-size:18px; line-height:18px; margin-top:12px; padding:8px 0; text-align:center; text-decoration:none!important; width:151px">
					 Nein</a><br>`
				)}`
			};
			mg.messages().send(data, function (error, body) {
				if (error) console.log('No Email address');
				//console.log(body);
			});
			break;

		case 4:
			//Broad Info mail
			let htmlBlock = '';
			console.log(await getNextColloquium());
			for (let i = 0; i < users.length; i++) {
				htmlBlock += `<tr>\
<td>${users[i].User_ID === Presentations[i].Presenter ? Presentations[i].Topic : 'Nicht eingetragen'}</td>\
<td>${users[i].FirstName}</td>\
<td>${users[i].User_ID === Presentations[i].Presenter ? Presentations[i].Presentation_Category : 'Nicht eingetragen'}</td>\
</tr>`;
			}
			data = {
				from: SENDER_MAIL,
				to: emails,
				subject: 'Colloquium Planning',
				html: `${html(
					`<p>hier die bisher eingetragenen Themen des nächsten Colloquiums am: <b>${await getNextColloquium()}</b></p>
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
