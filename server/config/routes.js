
/**
 * Module dependencies.
 */

var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var request = require('request');
var config = require('../../config');
var auth = require('./auth');
var sync = require('../lib/sync/data');

// Controllers
var admin = require('../app/controllers/admin');
var settings = require('../app/controllers/settings');
var events = require('../app/controllers/events');
var social = require('../app/controllers/social');
var news = require('../app/controllers/news');
var pages = require('../app/controllers/pages');

var mongoose = require('mongoose');
var Spaces = mongoose.model('Space');
var Events = mongoose.model('Event');

module.exports = function (app, passport) {


	// user routes
	app.get('/admin/login', admin.login);
	app.get('/admin/signup', auth.adminIsNotDefined, admin.signup);
	app.get('/admin/logout', admin.logout);
	app.post('/admin/new', admin.create);
	app.get('/admin', auth.requiresLogin, admin.index)
	app.post('/admin/session',
		passport.authenticate('local', {
			failureRedirect: 'login',
			failureFlash: 'Invalid email or password.'
	}), admin.session);
	app.post('/admin', auth.requiresLogin, settings.update);


	app.get('/api/v1/settings', settings.json);


	/*
	 * News (Connected to WP JSON API PLUGIN)
	 */

	app.get('/api/v1/news', news.all);
	app.get('/api/v1/news/:postId', news.post);


	/*
	 * Pages (Connected to WP JSON API PLUGIN)
	 */

	app.get('/api/v1/pages', pages.all);

	/*
	 * Main data
	 */

	var options = fs.existsSync('./options.json') ? JSON.parse(fs.readFileSync('./options.json', 'utf8')) : {};

	/*
	* Expose data
	*/


	app.get('/api/v1/data', function(req, res) {

		var config = req.app.locals.config;
		var spacesData;
		var eventsData;

		var loadData = function(doneLoadData) {
			async.parallel([function(doneLoadEvents){
				Events.find({}).populate('occurrences').lean().exec(function(err, results){
					eventsData = results;
					doneLoadEvents(err)
				});
			}, function(doneLoadSpaces){
				Spaces.find({}).lean().exec(function(err, results){
					spacesData = results;
					doneLoadSpaces(err)
				});
			}], doneLoadData);
		}

		loadData(function(){
			var data = {
				config: {
					wpUrl: config.wordpress.endpoint,
					hashtag: config.hashtag
				},
				options: options,
				events: eventsData,
				spaces: spacesData
			};
			res.json(data);
		})
	});

	/*
	 * Single events data
	 */

	app.get('/api/v1/events/:eventId', events.json);

	app.all('/agenda/limpar-cache', auth.requiresLogin, function(req, res) {

		var emptied = loadedEvents.slice(0);
		loadedEvents = [];

		res.send('cache cleared');
	});



	app.all('/agenda/atualizar', auth.requiresLogin, function(req, res) {

		loadedEvents = [];

		sync(app, function(err) {
			if (err) return res.send('error')
			res.send('data success');
		});

	});

	app.get('/api/v1/social', social.index);

	app.get('/*', function(req, res) {
		res.sendFile(config.root + '/dist/views/index.html');
	});
}
