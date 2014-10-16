
/*!
 * Module dependencies.
 */

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('Admin');

/**
 * Expose
 */

module.exports = function (passport, config) {
	// serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id)
	})

	passport.deserializeUser(function(id, done) {
		User.findOne({ _id: id }, function (err, user) {
			done(err, user);
		})
	})

	// use these strategies
	passport.use(new LocalStrategy(
		function(username, password, done) {
			User.findOne({}, function (err, user) {
				console.log(err);
				console.log(user);

				if (err) return done(err)

				if (!user) {
					return done(null, false, { message: 'Unknown user' });
				}
				if (!user.authenticate(password)) {
					return done(null, false, { message: 'Invalid password' });
				}
				return done(null, user);
			});
		})
	);
};
