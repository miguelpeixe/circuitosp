var _ = require('underscore');
var mongoose = require('mongoose');
var Settings = mongoose.model('Settings');

exports.json = function(req, res) {
	res.json(req.app.locals.config);
}

exports.update = function(req, res) {
	Settings.findOne({}, function(err, settings){
		if (err) return res.render('500');
		if (!settings) settings = new Settings(req.body.settings);
		else settings = _.extend(settings, req.body.settings);

		settings.smtp.secureConnection = req.body.settings.smtp.secureConnection ? true : false;

		settings.save(function(err){
			if (err) return res.render('500');

			// clear unwanted info
			settings = settings.toObject();
			delete settings._id;
			delete settings.__v;
			delete settings.smtp;
	
			req.app.locals.config = settings;

			res.render('admin/index', {settings: settings});
		});
	});
}