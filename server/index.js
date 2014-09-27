var fs = require('fs'),
	url = require('url'),
	express = require('express'),
	request = require('request'),
	_ = require('underscore'),
	loadData = require('./data'),
	loadSocial = require('./social');


/* 
 * Init server
 */ 

var app = express();

// Express settings
require('./config/express')(app);

// Define rotues
require('./config/routes')(app);

// Init data sync
app.locals.data = { events: [], spaces: [] }
loadData(function(data) {
	app.locals.data = data;
});

var port = process.env.PORT || 8000;
app.listen(port);
console.log('App started on port ' + port);