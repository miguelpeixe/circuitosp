#!/usr/bin/env node

var fs = require('fs');
var request = require('request');
var _ = require('underscore');
var moment = require('moment');
var tryJSON = require('../tryParseJSON')

module.exports = function(app, done) {

	var config = app.locals.config;

	var storeDir = 'dist/data';

	var defaultReq = {
		method: 'GET'
	};

	// if callback is not defined, print error to console
	if (!done) {
		done = function(err) {
			if (err) console.log(err);
		}
	}

	var eventsReq = {
		url: config.mapasCulturais.endpoint + '/event/find',
		qs: {
			'@select': 'id,name,shortDescription,classificacaoEtaria,terms,traducaoLibras,descricaoSonora',
			'@files': '(avatar,header):url',
			'project': 'in(@Project:' + config.mapasCulturais.projectId + ')'
		}
	};

	request(_.extend(defaultReq, eventsReq), function(err, res, body) {
		if(err) {
			done(err);
		} else {

			var events = tryJSON(body);

			if(!events)
				return false;

			if(!events.length)
				throw new Error('This project has no events');

			var eventIds = [];

			_.each(events, function(event) {
				eventIds.push(event.id);
			});

			eventIds = eventIds.join(',');

			var occursReq = {
				url: config.mapasCulturais.endpoint + '/eventOccurrence/find?event=in(' + eventIds + ')',
				qs: {
					'@select': 'id,eventId,rule',
					'@order': '_startsAt'
				}
			};

			var occursReqUrl = config.mapasCulturais.endpoint + '/eventOccurrence/find?@select=id,eventId,rule&event=in(' + eventIds + ')&@order=_startsAt';

			request(occursReqUrl, function(err, res, body) {

				if(err) {

					done(err);

				} else {

					var occurrences = tryJSON(body) || [];

					var spaceIds = [];

					_.each(occurrences, function(occurrence) {

						// Store space id for following spaces request

						spaceIds.push(occurrence.rule.spaceId);

						// Find event
						var event = _.find(events, function(e) { return e.id == occurrence.eventId; });

						// Push occurrence to event
						if(!event.occurrences)
							event.occurrences = [];

						event.occurrences.push(occurrence.rule);

					});

					// Remove events without occurrence
					events = _.filter(events, function(e) { return e.occurrences && e.occurrences.length; });

					// Organize event by time of first occurrence
					events = _.sortBy(events, function(e) {
						return moment(e.occurrences[0].startsOn + ' ' + e.occurrences[0].startsAt, 'YYYY-MM-DD HH:mm').unix();
					});

					// Remove duplicate spaces
					spaceIds = _.uniq(spaceIds).join(',');

					var spacesReq = {
						url: config.mapasCulturais.endpoint + '/space/find',
						qs: {
							'@select': 'id,name,shortDescription,endereco,location',
							'id': 'in(' + spaceIds + ')',
							'@order': 'name'
						}
					};

					request(_.extend(defaultReq, spacesReq), function(err, res, body) {

						if(err) {
							done(err);
						} else {

							var spaces = tryJSON(body) || [];

							app.locals.data.events = events;
							app.locals.data.occurrences = occurrences;
							app.locals.data.spaces = spaces;
							done();
						}
					})
				}
			});
		}
	});

};

if(!module.parent) {
	module.exports();
}
