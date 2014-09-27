var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var config = require('../../config');

module.exports = function (app) {

	app.use(require('prerender-node'));
	app.use(require('compression')());
	app.set('view engine', 'jade');
	app.set('views', __dirname + '/../../src/views/');

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.use('/', express.static(__dirname + '/../../dist'));


}