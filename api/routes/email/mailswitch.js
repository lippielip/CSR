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
			//canceled Mail
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
					<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
					<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.5;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
					<div style="font-size: 14px; line-height: 1.5; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 21px;"><span style="font-size: 16px;">Das nächste Colloquium wird am <b>${myDate}</b> stattfinden. Ist dieser Termin warnehmbar?</span></div>
					</div>
					<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
					<!--[if (mso)|(IE)]></td><td align="center" width="125" style="background-color:transparent;width:125px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
					<div class="col num3" style="max-width: 320px; min-width: 125px; display: table-cell; vertical-align: top; width: 125px;">
					<div style="width:100% !important;">
					<!--[if (!mso)&(!IE)]><!-->
					<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
					<!--<![endif]-->
					<div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">

					<!--[if mso]></td></tr></table><![endif]-->
					<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${DOMAIN_NAME}/confirmattendance?token=${moderator}&answer=1" style="height:31.5pt; width:94.5pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#3AAEE0"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="${DOMAIN_NAME}/confirmattendance?token=${moderator}&answer=1" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #3AAEE0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width: auto; width: auto; border-top: 1px solid #3AAEE0; border-right: 1px solid #3AAEE0; border-bottom: 1px solid #3AAEE0; border-left: 1px solid #3AAEE0; padding-top: 5px; padding-bottom: 5px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; mso-line-height-alt: 32px;">Yes</span></span></a>
					<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
					</div>
					<!--[if (!mso)&(!IE)]><!-->
					</div>
					<!--<![endif]-->
					</div>
					</div>
					<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
					<!--[if (mso)|(IE)]></td><td align="center" width="125" style="background-color:transparent;width:125px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
					<div class="col num3" style="max-width: 320px; min-width: 125px; display: table-cell; vertical-align: top; width: 125px;">
					<div style="width:100% !important;">
					<!--[if (!mso)&(!IE)]><!-->
					<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
					<!--<![endif]-->
					<div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
					<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${DOMAIN_NAME}/confirmattendance?token=${moderator}&answer=0" style="height:31.5pt; width:94.5pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#3AAEE0"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="${DOMAIN_NAME}/confirmattendance?token=${moderator}&answer=0" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #3AAEE0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width: auto; width: auto; border-top: 1px solid #3AAEE0; border-right: 1px solid #3AAEE0; border-bottom: 1px solid #3AAEE0; border-left: 1px solid #3AAEE0; padding-top: 5px; padding-bottom: 5px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; mso-line-height-alt: 32px;">No</span></span></a>
					<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
					</div>
					<!--[if (!mso)&(!IE)]><!-->
					</div>
					<!--<![endif]-->
					</div>
					</div>`
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
