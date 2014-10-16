
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
	hashtag: String,
	mapasCulturais: {
		endpoint: {type: String, default: 'http://spcultura.prefeitura.sp.gov.br/api'},
		projectId: { type: String, default: '11'}
	},
	google: {
		analyticsId: String
	},
	facebook: {
		apiKey: String
	},
	twitter: {
		apiKey: String
	},
	flickr: {
		apiKey: String
	},
	instagram: {
		apiKey: String
	},
	wordpress: {
		endpoint: String
	},
	smtp: {
		host: { type: String },
		secureConnection: {type: Boolean, default: true}, // use SSL
		port: {type: Number, default: 465}, // port for secure SMTP
		user: { type: String, default: '' },
		password: { type: String, default: '' }
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