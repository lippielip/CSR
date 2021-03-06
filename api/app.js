//require('dotenv').config({ path: '../Variables.env' });
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var pool = require('./routes/database');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;

// allow cross origin post and get
var corsOptions = {
	allowedHeaders : 'Content-Type, Access-Control-Allow-Origin',
	origin         : 'https://3dstudis.net', //origin: 'http://localhost:3000',  //change to webapp domain name
	allowedMethods : 'POST,GET'
};
// import of all routes
var MariaDbGetter = require('./routes/get/getter');
var healthCheck = require('./routes/healthcheck');
var MariaDbAdd = require('./routes/add/add');
var MariaDbAddOOO = require('./routes/add/addOOO');
var MariaDbUpdate = require('./routes/update/update');
var MariaDbchange = require('./routes/update/changeAmount');
var MariaDbPendingState = require('./routes/update/setPendingState');
var MariaDbdelete = require('./routes/update/delete');
var usersRouter = require('./routes/authentication/users');
var TokenRouter = require('./routes/authentication/checkToken');
var PickWeeklyPresenters = require('./routes/chooseRandom');
var CheckPresentationStatus = require('./routes/email/dailycheck');
var CancelPresentation = require('./routes/update/cancelPresentation');
var NewUserRouter = require('./routes/authentication/newUser');
var ForgotPassword = require('./routes/authentication/forgotPassword');
var ForgotPasswordSubmit = require('./routes/authentication/forgotPasswordSubmit');
var ChangePasswordSubmit = require('./routes/authentication/ChangePasswordSubmit');
var ChangeUsernameSubmit = require('./routes/authentication/ChangeUsernameSubmit');
var ChangeEmailSubmit = require('./routes/authentication/ChangeEmailSubmit');
var ChangeSettingsSubmit = require('./routes/authentication/ChangeSettingsSubmit');
var checkResetToken = require('./routes/authentication/checkResetToken');
var checkConfirmToken = require('./routes/update/setPendingEmailState');
var instantCheck = require('./routes/email/instantCheck');
var changeNextColloquium = require('./routes/update/changeNextColloquium');
var app = express();

let ChooseRandom = new CronJob(
	'0 16 * * mon-fri',
	async function() {
		PickWeeklyPresenters();
	},
	null,
	true,
	'Europe/Berlin'
);

let EmailJob = new CronJob(
	'0 5 * * mon-fri',
	async function() {
		CheckPresentationStatus();
	},
	null,
	true,
	'Europe/Berlin'
);

let schedule = new CronJob(
	'*/60 * * * * *',
	async function() {
		instantCheck();
	},
	null,
	false,
	'Europe/Berlin'
);
// Testing Parameter for creating cronjobs
//ChooseRandom.setTime(new CronTime('0 * * * * *'));
//EmailJob.setTime(new CronTime('5 * * * * *'));
ChooseRandom.start();
EmailJob.start();
schedule.start();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// comment out for production build
//app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

//make server respond to requests on specific addresses
app.use('/healthz', healthCheck);
app.use('/getter', MariaDbGetter);
app.use('/add', MariaDbAdd);
app.use('/addOOO', MariaDbAddOOO);
app.use('/users', usersRouter);
app.use('/checkToken', TokenRouter);
app.use('/checkResetToken', checkResetToken);
app.use('/PendingState', MariaDbPendingState);
app.use('/update', MariaDbUpdate);
app.use('/change', MariaDbchange);
app.use('/delete', MariaDbdelete);
app.use('/cancel', CancelPresentation);
app.use('/NewUser', NewUserRouter);
app.use('/forgot', ForgotPassword);
app.use('/forgotPasswordSubmit', ForgotPasswordSubmit);
app.use('/changePasswordSubmit', ChangePasswordSubmit);
app.use('/changeEmailSubmit', ChangeEmailSubmit);
app.use('/changeSettingsSubmit', ChangeSettingsSubmit);
app.use('/changeUsernameSubmit', ChangeUsernameSubmit);
app.use('/confirmattendance', checkConfirmToken);
app.use('/changenextColloquium', changeNextColloquium);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
