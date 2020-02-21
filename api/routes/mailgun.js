const mailgun = require('mailgun-js');
const API_KEY = process.env.MAIL_API_KEY;
const PROXY = process.env.MAIL_PROXY //|| 'http://yourproxy.com';
const DOMAIN = process.env.MAIL_DOMAIN || 'mail.3dstudis.net';
const HOST = process.env.MAIL_HOST || 'api.eu.mailgun.net';
const SENDER_MAIL = process.env.MAIL_SENDER; //|| 'Colloquium Selector Robot <noreply@mail.domain.com>';
const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN, proxy: PROXY, host: HOST });

exports.mg = mg;
exports.sender = SENDER_MAIL;
