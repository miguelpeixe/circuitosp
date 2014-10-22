
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
	footerImgPath: String,
	mapasCulturais: {
		endpoint: {type: String, default: 'http://spcultura.prefeitura.sp.gov.br/api'},
		projectId: { type: String, default: '11'}
	},
	google: {
		analyticsId: String
	},
	facebook: {
		pageId: String
	},
	twitter: {
		username: String,
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


		function clearSettingsAndDone(settings) {
			// clear db info
			settings = settings.toObject();
			delete settings._id;
			delete settings.__v;
			delete settings.smtp;
			done(null, settings);
		}
		
		self.findOne(function(err, settings){
			if (err) return done(err)
			else
				if (!settings){
					settings = new self();
					settings.save(function(err){
						if (err) return done(err)
						clearSettingsAndDone(settings);
					});
				} else {
					clearSettingsAndDone(settings);
				}
 		})
	}
}

mongoose.model('Settings', SettingsSchema);