//require('dotenv').config({ path: '../Variables.env' });
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var schedule = require('node-schedule');

// allow cross origin post and get
var corsOptions = {
	allowedHeaders : 'Content-Type, Access-Control-Allow-Origin',
	orgin          : '*',
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
var MissingPeople = require('./routes/get/getMissingPeople');
var GetNewPresentations = require('./routes/get/getNewPresentations');
var CheckPresentationStatus = require('./routes/email/dailycheck');
var CancelPresentation = require('./routes/update/cancelPresentation');
var NewUserRouter = require('./routes/authentication/newUser');
var NewPasswordRouter = require('./routes/authentication/newPassword');
var ForgotPassword = require('./routes/authentication/forgotPassword');
var ForgotPasswordSubmit = require('./routes/authentication/forgotPasswordSubmit');
var app = express();
i = schedule.scheduleJob('0 5 * * mon', async function MondayJob () {
	console.log('executing weekly event...');
	const Missing = async () => {
		return await MissingPeople();
	};
	const Presentations = async () => {
		return await GetNewPresentations();
	};
	console.log(await Missing());
	console.log(await Presentations());
	await PickWeeklyPresenters(await Missing(), await Presentations());
});

var j = schedule.scheduleJob('30 5 * * *', function DailyCheck () {
	console.log('Fetching Presentation Status...');
	CheckPresentationStatus();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
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
app.use('/PendingState', MariaDbPendingState);
app.use('/update', MariaDbUpdate);
app.use('/change', MariaDbchange);
app.use('/delete', MariaDbdelete);
app.use('/cancel', CancelPresentation);
app.use('/NewPassword', NewPasswordRouter);
app.use('/NewUser', NewUserRouter);
app.use('/forgot', ForgotPassword);
app.use('/forgotPasswordSubmit', ForgotPasswordSubmit);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
