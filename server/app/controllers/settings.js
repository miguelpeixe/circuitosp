var _ = require('underscore');
var fs = require('fs');
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

		if (req.files.footerImage) {
			fs.readFile(req.files.footerImage.path, function (err, data) {
				if (err) return res.render('500');
				var filename = 'footer.' + req.files.footerImage.extension;
				var newPath = __dirname + "/../../../dist/img/" + filename;

				fs.writeFile(newPath, data, function (err) {
					if (err) return res.render('500');
					settings.footerImgPath = 'img/' + filename;
					saveSettings()
				});
			});
		} else saveSettings();

		function saveSettings() {
			settings.save(function(err){
				if (err) return res.render('500');

				// clear unwanted info
				clearedSettings = settings.toObject();
				delete clearedSettings._id;
				delete clearedSettings.__v;
				delete clearedSettings.smtp;
		
				req.app.locals.config = clearedSettings;

				res.render('admin/index', {settings: settings});
			});			
		}
	});
}