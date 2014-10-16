
/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
var validate = require('mongoose-validate');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var moment = require('moment');
var _ = require('underscore');
var oAuthTypes = ['facebook', 'google'];

/**
 * Schema
 */

var AdminSchema = new Schema({
	email: { type: String, default: '', validate: [validate.email, 'E-mail inválido.'] },
	hashed_password: { type: String, default: '' },
	salt: { type: String, default: '' }
});

/**
 * Virtuals
 */

AdminSchema
	.virtual('password')
	.set(function(password) {
		this._password = password
		this.salt = this.makeSalt()
		this.hashed_password = this.encryptPassword(password)
	})
	.get(function() { return this._password });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
	return value && value.length;
}

// the below 5 validations only apply if you are signing up traditionally

AdminSchema.path('email').validate(function (email) {
	return (email && email.length);
}, 'Entre com um endereço de e-mail.');

/**
 * Methods
 */

AdminSchema.methods = {


	authenticate: function (plainText) {
		return this.encryptPassword(plainText) === this.hashed_password
	},

	/**
	 * Make salt
	 *
	 * @return {String}
	 * @api public
	 */

	makeSalt: function () {
		return Math.round((new Date().valueOf() * Math.random())) + ''
	},

	/**
	 * Encrypt password
	 *
	 * @param {String} password
	 * @return {String}
	 * @api public
	 */

	encryptPassword: function (password) {
		if (!password) return ''
		var encrypred
		try {
			encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
			return encrypred
		} catch (err) {
			return ''
		}
	},

}

/**
 * Register
 */

mongoose.model('Admin', AdminSchema)
