var env = process.env.NODE_ENV || 'development';
var express = require('express');
var session = require('express-session');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var winston = require('winston');
var bodyParser = require('body-parser');
var multer = require('multer');
var methodOverride = require('method-override');
var csrf = require('csurf');
var swig = require('swig');
var fs = require('fs');
var pkg = require('../../package.json');


var mongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var helpers = require('view-helpers');

var config = require('../../config');

module.exports = function (app, passport) {

	app.use(require('prerender-node'));
	app.use(require('compression')());

	// Use winston on production
	var log;
	if (env !== 'development') {
		log = {
			stream: {
				write: function (message, encoding) {
					winston.info(message);
				}
			}
		};
	} else {
		log = { format: 'dev' };
	}

	// Don't log during tests
	// Logging middleware
	if (env !== 'test') app.use(morgan("dev", log));

	// Swig templating engine settings
	if (env === 'development' || env === 'test') {
		swig.setDefaults({
			cache: false
		});
	}


	// set views path, template engine and default layout
	app.engine('html', swig.renderFile);
	app.set('views', __dirname + '/../app/views');
	app.set('view engine', 'html');

	// expose package.json to views
	app.use(function (req, res, next) {
		res.locals.pkg = pkg;
		res.locals.env = env;
		next();
	});

	// bodyParser should be above methodOverride
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(multer());
	app.use(methodOverride(function (req, res) {
		if (req.body && typeof req.body === 'object' && '_method' in req.body) {
			// look in urlencoded POST bodies and delete it
			var method = req.body._method;
			delete req.body._method;
			return method;
		}
	}));


	// CookieParser should be above session
	app.use(cookieParser());
	app.use(cookieSession({ secret: 'secret' }));
	app.use(session({
		resave: true,
		saveUninitialized: true,
		secret: pkg.name,
		store: new mongoStore({
			url: config.db,
			collection : 'sessions'
		})
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	// connect flash for flash messages - should be declared after sessions
	app.use(flash());

	// should be declared after session and flash
	app.use(helpers(pkg.name));

	// adds CSRF support
	if (process.env.NODE_ENV !== 'test') {
		app.use(csrf());

		// This could be moved to view-helpers :-)
		app.use(function (req, res, next) {
			res.locals.csrf_token = req.csrfToken();
			next();
		});
	}

	app.use('/', express.static(__dirname + '/../../dist'));


}