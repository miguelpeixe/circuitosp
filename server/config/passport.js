
/*!
 * Module dependencies.
 */

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var Admin = mongoose.model('Admin');

/**
 * Expose
 */

module.exports = function (passport, config) {
	// serialize sessions
	passport.serializeUser(function(admin, done) {
		done(null, admin.id)
	})

	passport.deserializeUser(function(id, done) {
		Admin.findOne({ _id: id }, function (err, admin) {
			done(err, admin);
		})
	})

	// use these strategies
	passport.use(new LocalStrategy(
		function(username, password, done) {
			Admin.findOne({}, function (err, admin) {
				console.log(err);
				console.log(admin);

				if (err) return done(err)

				if (!admin) {
					return done(null, false, { message: 'Unknown admin' });
				}
				if (!admin.authenticate(password)) {
					return done(null, false, { message: 'Invalid password' });
				}
				return done(null, admin);
			});
		})
	);
};
