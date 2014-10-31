#!/usr/bin/env node

var fs = require('fs');
var request = require('request');
var _ = require('underscore');
var async = require('async');
var moment = require('moment');
var tryJSON = require('../tryParseJSON')
var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var Occurrence = mongoose.model('Occurrence');


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

	function fetchProjects(doneFetchProjects) {
		var projectId = config.mapasCulturais.projectId;

		var projectReq = {
			url: config.mapasCulturais.endpoint + '/project/findOne',
			qs: {
				'@select': 'childrenIds',
				'id': 'EQ('+projectId+')'
			}
		};

		request(_.extend(defaultReq, projectReq), function(err, res, body) {
			if(err) return doneFetchProjects(err);
			var projectsIds = [];

			_.each(tryJSON(body).childrenIds, function(id){
				projectsIds.push(parseInt(id));
			});
			projectsIds.push(parseInt(projectId));
			fetchEvents(projectsIds, doneFetchProjects);
		});
	}

	function fetchEvents(projectsIds, doneFetchEvents){
		var eventsReq = {
			url: config.mapasCulturais.endpoint + '/event/find',
			qs: {
				'@select': 'id,name,shortDescription,classificacaoEtaria,terms,traducaoLibras,descricaoSonora',
				'@files': '(avatar,header):url',
				'project': 'in(' + projectsIds.join(',') + ')'
			}
		};

		request(_.extend(defaultReq, eventsReq), function(err, res, body) {
			if (err) return done(err);

			var events = tryJSON(body);

			if(!events)
				return false;

			if(!events.length)
				throw new Error('This project has no events');


			async.parallel([function(doneParallel){
					parseEvents(events, doneParallel);
			}, function(doneParallel){
					fetchOccurrences(events, doneParallel);
			}], function(err){
				if (err) console.log(err);
				doneFetchEvents(err);
			});
		});
	}

	function fetchOccurrences(events, doneFetchOccurrences) {
		var eventsIds = [];

		_.each(events, function(event) {
			eventsIds.push(event.id);
		});

		eventsIds = eventsIds.join(',');

		var occursReqUrl = {
			url: config.mapasCulturais.endpoint + '/eventOccurrence/find?event=in(' + eventsIds + ')',
			qs: {
				'@select': 'id,eventId,rule',
				'@order': '_startsAt'
			}
		};


		// var occursReqUrl = {
		// 	url: config.mapasCulturais.endpoint + '/eventOccurrence/find',
		// 	qs: {
		// 		// '@select': 'id,spaceId,eventId,startsAt,duration,endsAt,frequency,startsOn,until,description,price',
		// 		'@select': 'id,eventId,rule',
		// 		'@order': '_startsAt',
		// 		'event': 'in(' + eventsIds + ')'
		// 	}
		// };

		request(_.extend(defaultReq, occursReqUrl), function(err, res, body) {

			if(err) return doneFetchOccurrences(err);

			var occurrences = tryJSON(body) || [];

			var spaceIds = [];

			console.log(occurrences);

			_.each(occurrences, function(occurrence) {

				// Store space id for following spaces request
				spaceIds.push(occurrence.rule.spaceId);


			});

			async.parallel([function(doneParallel){
					parseOccurrences(occurrences, doneParallel);
			}, function(){
					console.log(spaceIds);
					doneParallel();
			}], doneFetchOccurrences);
		});
	}

	function parseEvents(events, done) {
		async.eachSeries(events, function(event, doneEach){
			// console.log(event);
			var occurrences = event.occurrences;
			event['_id'] = event.id;
			delete event.occurrences;
			Event.update({_id: event['id']}, event, {upsert:true}, doneEach);
		}, done)
	}

	function parseOccurrences(occurrences, done) {
		// console.log(occurrences);
		async.eachSeries(occurrences, function(occurrence, doneEach){
			Occurrence.update({_id: occurrence.id}, occurrence.rule, {upsert: true}, doneEach);
		}, done);
	}


	fetchProjects(function(){
		console.log('Data sync complete');
	});

	// function fetchEvents(done) {
	// 	var eventsReq = {
	// 		url: config.mapasCulturais.endpoint + '/event/find',
	// 		qs: {
	// 			'@select': 'id,name,shortDescription,classificacaoEtaria,terms,traducaoLibras,descricaoSonora',
	// 			'@files': '(avatar,header):url',
	// 			'project': 'in(@Project:' + config.mapasCulturais.projectId + ')'
	// 		}
	// 	};
	//
	// 	request(_.extend(defaultReq, eventsReq), function(err, res, body) {
	// 		if(err) {
	// 			done(err);
	// 		} else {
	//
	// 			var events = tryJSON(body);
	//
	// 			if(!events)
	// 				return false;
	//
	// 			if(!events.length)
	// 				throw new Error('This project has no events');
	//
	// 			var eventIds = [];
	//
	// 			_.each(events, function(event) {
	// 				eventIds.push(event.id);
	// 			});
	//
	// 			eventIds = eventIds.join(',');
	// 		}
	// 	});
	//
	//
	// }


	// var eventsReq = {
	// 	url: config.mapasCulturais.endpoint + '/event/find',
	// 	qs: {
	// 		'@select': 'id,name,shortDescription,classificacaoEtaria,terms,traducaoLibras,descricaoSonora',
	// 		'@files': '(avatar,header):url',
	// 		'project': 'in(@Project:' + config.mapasCulturais.projectId + ')'
	// 	}
	// };
	//
	// request(_.extend(defaultReq, eventsReq), function(err, res, body) {
	// 	if(err) {
	// 		done(err);
	// 	} else {
	//
	// 		var events = tryJSON(body);
	//
	// 		if(!events)
	// 			return false;
	//
	// 		if(!events.length)
	// 			throw new Error('This project has no events');
	//
	// 		var eventIds = [];
	//
	// 		_.each(events, function(event) {
	// 			eventIds.push(event.id);
	// 		});
	//
	// 		eventIds = eventIds.join(',');
	//
	// 		var occursReq = {
	// 			url: config.mapasCulturais.endpoint + '/eventOccurrence/find?event=in(' + eventIds + ')',
	// 			qs: {
	// 				'@select': 'id,eventId,rule',
	// 				'@order': '_startsAt'
	// 			}
	// 		};
	//
	// 		var occursReqUrl = config.mapasCulturais.endpoint + '/eventOccurrence/find?@select=id,eventId,rule&event=in(' + eventIds + ')&@order=_startsAt';
	//
	// 		request(occursReqUrl, function(err, res, body) {
	//
	// 			if(err) {
	//
	// 				done(err);
	//
	// 			} else {
	//
	// 				var occurrences = tryJSON(body) || [];
	//
	// 				var spaceIds = [];
	//
	// 				parseOccurrences(occurrences);
	//
	// 				_.each(occurrences, function(occurrence) {
	//
	// 					// Store space id for following spaces request
	//
	// 					spaceIds.push(occurrence.rule.spaceId);
	//
	// 					// Find event
	// 					var event = _.find(events, function(e) { return e.id == occurrence.eventId; });
	//
	// 					// Push occurrence to event
	// 					if(!event.occurrences)
	// 						event.occurrences = [];
	//
	// 					event.occurrences.push(occurrence.rule);
	//
	// 				});
	//
	// 				// Remove events without occurrence
	// 				events = _.filter(events, function(e) { return e.occurrences && e.occurrences.length; });
	//
	// 				// Organize event by time of first occurrence
	// 				events = _.sortBy(events, function(e) {
	// 					return moment(e.occurrences[0].startsOn + ' ' + e.occurrences[0].startsAt, 'YYYY-MM-DD HH:mm').unix();
	// 				});
	//
	// 				// Remove duplicate spaces
	// 				spaceIds = _.uniq(spaceIds).join(',');
	//
	// 				var spacesReq = {
	// 					url: config.mapasCulturais.endpoint + '/space/find',
	// 					qs: {
	// 						'@select': 'id,name,shortDescription,endereco,location',
	// 						'id': 'in(' + spaceIds + ')',
	// 						'@order': 'name'
	// 					}
	// 				};
	//
	// 				request(_.extend(defaultReq, spacesReq), function(err, res, body) {
	//
	// 					if(err) {
	// 						done(err);
	// 					} else {
	//
	// 						var spaces = tryJSON(body) || [];
	// 						parseEvents(events);
	//
	//
	//
	// 						app.locals.data.events = events;
	// 						app.locals.data.occurrences = occurrences;
	// 						app.locals.data.spaces = spaces;
	// 						done();
	// 					}
	// 				})
	// 			}
	// 		});
	// 	}
	// });

};

if(!module.parent) {
	module.exports();
}
