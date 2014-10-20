
var _ = require('underscore');
var mongoose = require('mongoose');
var Admin = mongoose.model('Admin');

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next()
  if (!req.app.locals.definedAdmin) return res.redirect('admin/signup');
  if (req.method == 'GET') req.session.returnTo = req.originalUrl
  res.redirect('/admin/login')
}

exports.adminIsNotDefined = function(req, res, next) {
	Admin.findOne(function(err, admin){
		if (err) return res.render('500');
		if (!admin) next();
		else res.redirect('/admin/login');
	});
}