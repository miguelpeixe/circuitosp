
/**
 * Module dependencies
 */

var config = require('../config');
var fs = require('fs');
var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var syncSocial = require('./lib/sync/social');
var env = process.env.NODE_ENV || 'development';

/*
 * Init server
 */

// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models
fs.readdirSync(__dirname + '/app/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file);
});

var app = express();

// When mongoose is ready
mongoose.connection.on('connected', function(){

  var syncData = require('./lib/sync/data');

	// Set flag for defined admin
	mongoose.model('Admin').findOne(function(err, admin){
		if (err) return console.log('error loading admin info');
		app.locals.adminDefined = admin ? true : false;
	});

	// Start update process
	mongoose.model('Settings').load(function(err, settings){
		if (err) console.log('Error loading settings.');

		// Init data sync
		app.locals.data = { events: [], spaces: [] }
		app.locals.config = settings;
    console.log('Data sync started.')
		syncData(app);
		syncSocial(app);

		if (env !== 'development') {
			setInterval(function() {
        console.log('Data sync started.')
				syncData(app);
				syncSocial(app);
			}, 1000 * 60 * 10);
		}
	});
});

// Bootstrap passport config
require('./config/passport')(passport, config);

// Bootstrap application settings
require('./config/express')(app, passport);

// Bootstrap routes
require('./config/routes')(app, passport);


var port = process.env.PORT || 8000;
app.listen(port);
console.log('App started on port ' + port);
