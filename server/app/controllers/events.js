
var _ = require('underscore');
var request = require('request');


var loadedEvents = [];


exports.json = function(req, res) {

	var config = req.app.locals.config;

	var eventId = req.params.eventId;
	var eventSelect = [
		'id',
		'location',
		'name',
		'_type',
		'shortDescription',
		'longDescription',
		'createTimestamp',
		'status',
		'isVerified',
		'parent',
		'children',
		'owner',
		'emailPublico',
		'emailPrivado',
		'telefonePublico',
		'telefone1',
		'telefone2',
		'acessibilidade',
		'capacidade',
		'endereco',
		'site',
		'twitter',
		'facebook',
		'googleplus'
	];
	var eventReq = {
		url: config.mapasCulturais.endpoint + '/event/find',
		qs: {
			'@select': eventSelect.join(','),
			'@files': '(gallery)',
			'id': 'EQ(' + eventId + ')' 
		}
	}

	var loaded = _.find(loadedEvents, function(e) { return e.id == eventId; });

	// 10 minutes cache
	if(!loaded || (loaded._age + (1000 * 60 * 10)) < new Date().getTime()) {
		if(loaded) {
			loadedEvents = _.without(loadedEvents, loaded);
		}
		request(eventReq, function(reqErr, reqRes, body) {
			if(reqErr) {
				res.send(reqErr);
			} else {
				var e = JSON.parse(body)[0];
				if(!e || typeof e == 'undefined')
					e = {};
				else {
					e._age = new Date().getTime();
					loadedEvents.push(e);
				}
				res.send(e);
			}
		});

	} else {
		res.send(loaded);
	}

}
