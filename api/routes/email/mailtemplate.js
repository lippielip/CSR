function mailtemplate (textElement) {
	return `
	<html lang="en">
	<head>
	   <meta charset="utf-8">
	   <meta name="description" content="WebRem Password Reset">
	   <meta name="author" content="Philipp Braun">
	   <style>
		  /* Remove space around the email design. */
		  html,
		  body {
		  margin: 0 auto !important;
		  padding: 0 !important;
		  height: 100% !important;
		  width: 100% !important;
		  }
		  /* Stop Outlook resizing small text. */
		  * {
		  -ms-text-size-adjust: 100%;
		  }
		  /* Stop Outlook from adding extra spacing to tables. */
		  table,
		  td {
		  mso-table-lspace: 0pt !important;
		  mso-table-rspace: 0pt !important;
		  }
		  /* Use a better rendering method when resizing images in Outlook IE. */
		  img {
		  -ms-interpolation-mode:bicubic;
		  }               
		  /* Prevent Windows 10 Mail from underlining links. Styles for underlined links should be inline. */            
		  a {
		  text-decoration: none;
		  }
	   </style>
	</head>
	<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly;">
	   <table role="presentation" border="0" width="600" cellspacing="0" cellpadding="20" style="margin-left:auto;margin-right:auto">
		  <tbody>
			 <tr>
				<td style="border-collapse: collapse;" align="center" valign="top">
				   <table role="presentation" style="background-color: #fff; background-image: none; background-repeat: repeat; background-position: top left;" border="0" width="100%" cellspacing="0" cellpadding="0">
					  <tbody>
						 <tr>
							<td style="border-collapse: collapse;" align="center" valign="top">
							   <table role="presentation" style="background-color: #ffffff; background-image: none; background-repeat: repeat; background-position: top left;" border="0" width="100%" cellspacing="0" cellpadding="0">
								  <tbody>
									 <tr>
										<td style="border-collapse: collapse; background-color: #e20074;" align="center" valign="middle"><img src="https://t-newsletter-pics.telekom.de/0ff8d40e40d46f7fe949f563648ba3c1.png" alt="T-Systems International GmbH" width="600" height="" style="display: block; font-size: 15px; line-height: 60px; width: 100%; max-width: 600px; height: auto; color: #ffffff; background: #e20074;" /></td>
									 </tr>
								  </tbody>
							   </table>
							</td>
						 </tr>
						 <tr>
							<td style="border-collapse: collapse;" align="center" valign="top">
							   <table role="presentation" border="0" width="100%" cellspacing="0" cellpadding="0">
								  <tbody>
									 <tr>
										<td align="center" valign="middle" bgcolor="" width="249">&nbsp;</td>
										<td align="center" valign="middle" bgcolor="" width="102">&nbsp;</td>
										<td align="center" valign="middle" bgcolor="" width="249">&nbsp;</td>
									 </tr>
								  </tbody>
							   </table>
							</td>
						 </tr>
						 <tr>
							<td style="border-collapse: collapse;" align="center" valign="top">
							   <table role="presentation" border="0" width="100%" cellspacing="0" cellpadding="40">
								  <tbody>
									 <tr>
										<td style="border-collapse: collapse;" align="left" valign="middle">Hallo in die Runde,</td>
									 </tr>
								  </tbody>
							   </table>
							</td>
						 </tr>
						 <tr>
							<td style="border-collapse: collapse;" align="center" valign="top">
							   <table role="presentation" border="0" width="100%" cellspacing="0" cellpadding="0">
								  <tbody>
									 <tr>
										<td style="border-collapse: collapse;" align="center" valign="middle">
										   <div style="text-align: left; padding: 0 20px 20px; font-size: 14px; line-height: 1.5; width: 80%;">
											  ${textElement}
										   </div>
										</td>
									 </tr>
								  </tbody>
							   </table>
							</td>
						 </tr>
						 <tr>
							<td style="border-collapse: collapse;" align="center" valign="top">
							   <table role="presentation" style="border-top-width: 1px; border-top-style: solid; border-top-color: #eee;" border="0" width="100%" cellspacing="0" cellpadding="30">
								  <tbody>
									 <tr>
										<td style="border-collapse: collapse;" align="center" valign="middle">
										   <div>Mit Freundlichen Grüßen</div>
										   <div>das Colloquium Team</div>
										</td>
									 </tr>
								  </tbody>
							   </table>
							</td>
						 </tr>
					  </tbody>
				   </table>
				</td>
			 </tr>
			 <tr>
				<td style="border-collapse: collapse;" align="center" valign="top">
				   <table role="presentation" style="color: #7f7f7f; font-size: 12px;" border="0" width="100%" cellspacing="0" cellpadding="0">
					  <tbody>
						 <tr>
							<td style="border-collapse: collapse;" align="center" valign="top">
							   <p>&nbsp;</p>
							   <table style="background: 0 0!important; border-collapse: collapse; border-spacing: 0; margin: 20px auto 0 auto; padding: 0; text-align: inherit; vertical-align: top; width: 580px;" align="center">
								  <tbody>
									 <tr style="padding: 0; vertical-align: top;">
										<th style="color: #322f37; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 400; line-height: 1.3; margin: 0; padding: 0;">
										   <p style="color: #322f37; font-family: Helvetica,Arial,Verdana,'Trebuchet MS'; font-size: 16px; font-weight: 400; line-height: 24px; margin: 0; margin-top: 5px; margin-bottom: 10px; padding: 0; padding-bottom: 10px; text-align: center;"><small style="color: #706a7c; font-size: 14px;">&copy; 2020 T-Systems International GmbH, All Rights Reserved</small></p>
										</th>
										<th style="color: #322f37; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 400; line-height: 1.3; margin: 0; padding: 0!important; text-align: left; width: 0;">&nbsp;</th>
									 </tr>
								  </tbody>
							   </table>
							</td>
						 </tr>
					  </tbody>
				   </table>
				</td>
			 </tr>
		  </tbody>
	   </table>
	   <p>&nbsp;</p>
	</body>
 </html>
  `;
}

module.exports = mailtemplate;
