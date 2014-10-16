
var _ = require('underscore');
var mongoose = require('mongoose');
var Admin = mongoose.model('Admin');


/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next()
  if (!req.app.locals.definedAdmin) return res.redirect('/admin/signup');
  if (req.method == 'GET') req.session.returnTo = req.originalUrl
  res.redirect('/admin/login')
}

/*
 *  Generic require login routing middleware
 */

exports.undefinedAdmin = function(req, res, next) {
	console.log('undefinedAdmin');
	Admin.findOne(function(err, admin){
		if (err) return res.render('500');
		if (!admin) next();
		else res.redirect('admin/login');
	});
}

exports.isAdminOrUndefinedAdmin = function(req, res, next) {
	console.log('isAdminOrUndefinedAdmin');
	Admin.findOne(function(err, admin){
		if (err) return res.render('500');
		if ((!admin) || (req.isAuthenticated())) return next();
		else res.redirect('admin/login');
	});
}

exports.isAdmin = function (req, res, next) {
	console.log('isAdmin');
	if (!req.app.locals.definedAdmin || req.isAuthenticated()) return next()	
	if (req.method == 'GET') req.session.returnTo = req.originalUrl
	res.redirect('/admin/login')
}

exports.adminExists = function (req, res, next) {
	console.log('adminExists');
	if (!req.app.locals.definedAdmin) res.redirect('/admin/signup');
}
