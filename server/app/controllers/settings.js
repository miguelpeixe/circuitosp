var mongoose = require('mongoose');
var Settings = mongoose.model('Settings');

exports.json = function(req, res) {
	Settings.findOne({}, function(err, settings){
		if (err) return res.render('500');
		if (!settings) settings = new Settings();
		settings.save(function(err){
			if (err) return res.render('500');
			res.json(settings);
		})
	});
}
