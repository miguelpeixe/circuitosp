var _ = require('underscore');
var mongoose = require('mongoose');
var Settings = mongoose.model('Settings');

exports.json = function(req, res) {
	Settings.findOne({}, function(err, settings){
		if (err) return res.render('500');
		if (!settings) settings = new Settings();
		settings.save(function(err){
			if (err) return res.render('500');

			// clear db info
			settings = settings.toObject();
			delete settings._id;
			delete settings.__v;

			res.json(settings);
		})
	});
}

exports.update = function(req, res) {
	console.log(req.body.settings);
	Settings.load(function(err, settings){
		if (err) return res.render('500');
		if (!settings) settings = new Settings(req.body.settings);
		else settings = _.extend(settings, req.body.settings);

		settings.smtp.secureConnection = req.body.settings.smtp.secureConnection ? true : false;

		settings.save(function(err){
			if (err) return res.render('500');
			res.render('admin/index', {settings: settings});
		});
	});
}