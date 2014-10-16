
/**
 * Module dependencies
 */

var 
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
/*
 * Schemma
 */	

var SettingsSchema = new Schema({
	siteUrl: String,
	hashtags: String,
	mapasculturais: {
		endpoint: {type: String, default: 'http://spcultura.prefeitura.sp.gov.br/api'},
		projectId: String
	},
	google: {
		analyticsId: String
	},
	facebook: {
		pageUrL: String,
		apiKey: String
	},
	twitter: {
		pageUrL: String,
		apiKey: String
	},
	wordpress: {
		apiUrl: String
	},
	smtp: {
		host: { type: String },
		secureConnection: {type: Boolean, default: true}, // use SSL
		port: {type: Number, default: 465}, // port for secure SMTP
		user: { type: String, default: '' },
		pass: { type: String, default: '' }
	}
})

SettingsSchema.statics = {
	load: function(done) {
		var self = this;
		
		self.findOne(function(err, settings){
			if (err) done(err)
			else
				if (!settings){
					settings = new self();
					settings.save(function(err){
						done(err, settings);
					});
				} else {
					done(null, settings);
				}
 		})
	}
}

mongoose.model('Settings', SettingsSchema);