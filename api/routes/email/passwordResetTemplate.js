function mailtemplate (DOMAIN_NAME, Hash, accountName) {
	return `
    <html><head>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
	</head>
	<body>
	<div dir="ltr">
	<div></div>
	<div data-ogsc="">
	<div>
	<div dir="ltr"></div>
	</div>
	<div><br>
	</div>
	<div class="ms-outlook-ios-signature"></div>
	</div>
	</div>
	<style type="text/css">
	<!--
	.x_btn, img
	  {display:block}
	.x_btn, .x_tableWith3Columns td
	  {text-align:center}
	#x_outlook a
	  {padding:0}
	.x_ExternalClass, .x_ReadMsgBody, body
	  {width:100%!important}
	a .x_yshortcuts, a:link, a:visited
	  {color:#369;
	  font-weight:400;
	  text-decoration:underline}
	.x_footerTable--hintText a, .x_footerTable--lastRowLinks a, .x_postContentDisclaimer a, img
	  {text-decoration:none}
	.x_btn
	  {font-family:inherit}
	.x_body, body
	  {background:#ededed;
	  color:#383838;
	  font:400 14px/14px TeleGroteskScreen,Arial,Helvetica,sans-serif;
	  padding:0}
	.x_wrapper
	  {margin:0 auto;
	  max-width:600px;
	  width:100%}
	img
	  {border:0;
	  height:auto;
	  line-height:100%;
	  max-width:100%;
	  outline:0}
	table, table tbody, table td, table tr
	  {border:0;
	  border-spacing:0;
	  margin:0;
	  padding:0}
	table td
	  {border-collapse:collapse;
	  vertical-align:top}
	.x_brandBar, .x_brandBar img
	  {vertical-align:middle}
	.x_mailserviceBanner, .x_mailserviceBanner img
	  {vertical-align:middle}
	.x_h1, .x_h2, .x_h3, .x_h4, .x_h5, .x_h6, h1, h2, h3, h4, h5, h6
	  {font-size:18px;
	  font-weight:700;
	  line-height:23px;
	  margin:0;
	  padding:0}
	.x_h2, h2
	  {font-weight:400}
	.x_backgroundTable
	  {background:#fff;
	  margin:0;
	  max-width:600px;
	  padding:0;
	  width:100%}
	.x_tableContainerOf3ColumnLayout--centerColumn, .x_tableContainerOf3ColumnLayout--leftColumn, .x_tableContainerOf3ColumnLayout--rightColumn
	  {width:100%;
	  padding-bottom:12px}
	.x_brandBar
	  {background:#e20074;
	  width:100%;
	  padding:0 24px;
	  height:60px}
	.x_mailserviceBanner
	  {background:#666666;
	  width:100%;
	  padding:0 24px;
	  height:60px}
	p
	  {font-size:16px;
	  line-height:120%;
	  margin:0}
	.x_btn, .x_h3NeedsTopMargin
	  {margin-top:18px}
	.x_upperHeadline
	  {text-transform:uppercase}
	.x_mailserviceHeadline
	  {text-transform:uppercase}
	.x_footerTable
	  {background:#262626;
	  margin-top:84px;
	  max-width:600px;
	  width:100%}
	.x_footerTable p
	  {color:#918984;
	  font-size:14px;
	  line-height:18px}
	.x_footerTable--lastRowFirstLevelChild, .x_tableWith2Columns td, .x_tableWith3Columns td
	  {display:table;
	  width:100%}
	.x_footerTable--hintText a
	  {color:#918984}
	.x_footerTable--hintText a:hover
	  {text-decoration:underline!important}
	.x_footerTable--lastRowFirstLevelChild a, .x_footerTable--lastRowFirstLevelChild p
	  {color:#918984}
	.x_footerTable--lastRowLinks
	  {padding-top:10px}
	.x_footerTable--lastRowLinks td
	  {padding:0 10px 6px 0;
	  display:inline-block}
	.x_footerTable--lastRowFirstLevelChild .x_footerTable--lastRowLinks a:hover
	  {text-decoration:underline}
	.x_postContentDisclaimer
	  {margin-top:8px;
	  max-width:600px}
	.x_postContentDisclaimer p
	  {color:#6c6c6c;
	  font-size:14px;
	  line-height:18px;
	  margin-top:16px}
	.x_layermodule
	  {width:auto;
	  height:auto;
	  background-color:#e20074;
	  padding:0 0 12px 12px;
	  text-align:left;
	  z-index:0}
	.x_layermodule h2, .x_layermodule p
	  {font-size:21px;
	  line-height:21px}
	.x_layermodule h2
	  {font-weight:700}
	.x_hasLeftAndRightSpacers
	  {padding-left:24px;
	  padding-right:24px;
	  width:100%}
	.x_tableWith2Columns, .x_tableWith3Columns
	  {margin-top:36px;
	  width:100%}
	.x_tableWith2Columns td img, .x_tableWith3Columns td img
	  {width:100%;
	  height:auto}
	.x_tableWith2Columns--rightColumn, .x_tableWith3Columns--centerColumn, .x_tableWith3Columns--rightColumn
	  {margin-top:36px}
	-->
	</style>
	<div style="background:#ededed; color:#383838; font:normal 14px/14px 'TeleGrotesk Next','Arial','Helvetica',sans-serif; padding:0; margin:0; width:100%!important">
	<div class="x_body" style="background:#ededed; color:#383838; font:normal 14px/14px 'TeleGrotesk Next','Arial','Helvetica',sans-serif; padding:0">
	<center>
	<div class="x_wrapper" style="margin:0 auto; max-width:600px; width:100%">
	<table border="0" cellspacing="0">
	<tbody>
	<tr>
	<td></td>
	<td>
	<table class="x_backgroundTable" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" style="border:0; border-spacing:0; margin:0; max-width:600px; padding:0; background:#fff">
	<tbody>
	<tr>
	<td class="x_brandBar" style="background:#e20074; border:0; border-collapse:collapse; border-spacing:0; margin:0; padding:0 24px; height:80px; vertical-align:middle">
	<img src="https://cthdevcdn.azureedge.net/mailassets/img/telekom-bar-logo@2x.png" width="auto" height="36" alt="Deutsche Telekom." style="border:0; display:block; height:36px; float:left; line-height:100%; max-width:100%; outline:none; text-decoration:none">
	<img src="https://cthdevcdn.azureedge.net/mailassets/img/telekom-bar-text@2x.png" width="auto" height="36" alt="Erleben, was verbindet." style="border:0; display:block; height:36px; float:right; line-height:100%; max-width:100%; outline:none; text-decoration:none">
	</td>
	</tr>
	<tr>
	<td class="x_mailserviceBanner" style="background:#666666; border:0; border-collapse:collapse; border-spacing:0; margin:0; padding:0 24px; height:40px; vertical-align:middle">
	<h1 class="x_mailserviceHeadline" style="color:#FFFFFF; font-size:20px; font-weight:700; line-height:120%; text-align:center; margin:0; padding:0; text-transform:uppercase; font-family:'TeleGrotesk Next','Arial','Helvetica',sans-serif">
	CSR - Passwort Service </h1>
	</td>
	</tr>
	<tr>
	<td class="x_introText x_hasLeftAndRightSpacers" style="border:0; border-collapse:collapse; border-spacing:0; margin:0; padding:19px 24px 0 24px">
	<p style="font-size:1.4em; font-weight:900; line-height:140%">Sehr geehrte Damen und Herren,<br>
		<br>
  </p>
  <p style="font-family:'TeleGrotesk Next','Arial','Helvetica',sans-serif; margin:0">

  <table>
  <tr>
      <td>
          hier der Link zum Setzen eines Passworts für den Account <em><strong>${accountName}</strong></em>.
		  <br><br><br>
      </td>
  </tr>
  <br>
  <tr>
      <td>
     
          <a href="${DOMAIN_NAME}/forgot?token=${Hash}" class="btn-primary" itemprop="url" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 5px; text-transform: capitalize; background-color: #348eda; margin: 0; border-color: #348eda; border-style: solid; border-width: 10px 20px;">Passwort ändern</a>
      </td>
  </tr>
</table>
  <br>
  <br>
	Mit freundlichen Grüßen<br>
	<em>Das Colloquium Team</em>
	</p>
	</td>
	</tr>
	<tr>
	<td align="center" style="border:0; border-collapse:collapse; border-spacing:0; margin:0; padding:80px 0 0 0">
	<table class="x_footerTable" border="0" cellpadding="0" cellspacing="0" style="background:#262626; border:0; border-spacing:0; margin:0; max-width:600px">
	<tbody>
	<tr>
	<td style="padding:24px">
	<table border="0" cellpadding="0" cellspacing="0" style="border:0; border-spacing:0; margin:0">
	<tbody>
	<tr>
	<td class="x_footerTable--hintText" align="center" colspan="2" style="border:0; border-collapse:collapse; border-spacing:0; margin:0; padding:0 0 24px 0">
	<p style="font-family:'TeleGrotesk Next','Arial','Helvetica',sans-serif; color:#918984; font-size:14px; line-height:18px; margin:0">
	Note: Do not reply directly to this e-mail. Messages sent to this mailbox will not be read. </p>
	</td>
	</tr>
	<tr>
	<td class="x_footerTable--lastRowFirstLevelChild" style="border:0; border-collapse:collapse; border-spacing:0; margin:0; padding:0; display:table">
	<p style="font-family:'TeleGrotesk Next','Arial','Helvetica',sans-serif; color:#918984; font-size:14px; line-height:18px; margin:0">
	© 2020 Philipp Braun</p>
	</td>
	<td class="x_footerTable--lastRowFirstLevelChild" style="border:0; border-collapse:collapse; border-spacing:0; margin:0; padding:0; display:table; vertical-align:inherit">
	<table class="x_footerTable--lastRowLinks" border="0" cellpadding="0" cellspacing="0" style="border:0; border-spacing:0; margin:0">
	<tbody>
	<tr>
	<td style="padding-right:10px; border:0; border-collapse:collapse; border-spacing:0; margin:0">
	<a href="https://3dstudis.net" target="_blank" title="Homepage" style="font-family:'TeleGrotesk Next','Arial','Helvetica',sans-serif; color:#918984; font-size:14px; line-height:18px; margin:0">Homepage</a>
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
	</tbody>
	</table>
	</td>
	</tr>
	</tbody>
	</table>
	<table class="x_postContentDisclaimer x_hasLeftAndRightSpacers" border="0" cellpadding="0" cellspacing="0" style="border:0; border-spacing:0; margin:0; max-width:600px; padding:0 24px 24px 24px">
	<tbody>
	<tr>
	<td style="border:0; border-collapse:collapse; border-spacing:0; margin:0; padding:0">
	<p style="font-family:'TeleGrotesk Next','Arial','Helvetica',sans-serif; color:#6c6c6c; font-size:14px; line-height:18px; margin:0; margin-top:16px">
	You receive this message because you are a registered user of the &quot;CSR Service&quot;. This e-mail has been sent for service or informational purposes.
	</p>
	</td>
	</tr>
	</tbody>
	</table>
	</td>
	<td></td>
	</tr>
	</tbody>
	</table>
	</div>
	</center>
	</div>
	</div>
	</body>
	</html>
        `;
}

module.exports = mailtemplate;
