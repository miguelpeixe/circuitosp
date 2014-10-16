
/**
 * Module dependencies.
 */

var utils = require('../../lib/utils');
var _ = require('underscore')
var mongoose = require('mongoose');
var Admin = mongoose.model('Admin');
var Settings = mongoose.model('Settings');

var login = function (req, res) {
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/admin';
  delete req.session.returnTo;
  res.redirect(redirectTo);
};
exports.authCallback = login;
exports.session = login;

exports.login = function(req, res) {
	res.render('admin/login');
}

exports.signin = function (req, res) {};

exports.signup = function(req, res) {
	res.render('admin/signup');
}

exports.logout = function (req, res) {
  req.logout();
  res.redirect('admin/login');
};

exports.index = function (req, res) {
	Settings.findOne({}, function(err, settings){
		if (err) return res.render('500');
		if (!settings) settings = new Settings();
		res.render('admin/index', {settings: settings});
	})
};

exports.update = function(req, res) {
	Settings.findOne({}, function(err, settings){
		if (err) return res.render('500');
		if (!settings) settings = new Settings(req.body.settings);
		else settings = _.extend(settings, req.body.settings);
		settings.save(function(err){
			if (err) return res.render('500');
			res.render('admin/index', {settings: settings});
		});
	});
}

exports.create = function(req, res) {
	var admin = new Admin({
		email: req.body.email,
		password: req.body.password
	})
	admin.save(function(err){
		console.log(err);
		if (err) {
			res.render('admin/signup', {
				admin: admin,
				error: utils.errors(err.errors || err)
			});
		} else {
			req.app.locals.definedAdmin = true;
			res.redirect('login');
		}
	})
}

/**
 * Update admin profile settings
 */
exports.profileUpdate = function(req, res) {
	Admin.findOne(function(err, admin){
		if (err) return res.render('500');
		admin.email = req.body.email;
		admin.password = req.body.password;
		admin.save(function(err){
			if (err) {
				res.render('admin/profile', {
					admin: admin,
					error: utils.errors(err.errors || err)
				});
			} else res.render('admin/profile');
		})
	});
}