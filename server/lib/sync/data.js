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
var Space = mongoose.model('Space');

var clearDB = function (done) {
  async.parallel([
    function (cb) {
      Event.collection.remove(cb)
    },
    function (cb) {
      Occurrence.collection.remove(cb)
    },
    function (cb) {
      Space.collection.remove(cb)
    }
  ], done)
}



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

  /**
  * Projects
  **/

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
      if (err) return doneFetchProjects(err);

      var projectsIds = [];

      _.each(tryJSON(body).childrenIds, function(id){
        projectsIds.push(parseInt(id));
      });
      projectsIds.push(parseInt(projectId));
      fetchEvents(projectsIds, doneFetchProjects);
    });
  }

  /**
  * Events
  **/

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
        saveEvents(events, doneParallel);
      }, function(doneParallel){
        fetchOccurrences(events, doneParallel);
      }], function(err){
        if (err) console.log(err);
        doneFetchEvents(err);
      });
    });
  }

  function saveEvents(events, done) {
    async.eachSeries(events, function(event, doneEach){
      var occurrences = event.occurrences;
      delete event.occurrences;
      Event.update({_id: event['id']}, event, {upsert:true}, doneEach);
    }, done)
  }


  /**
  * Occurrences
  **/

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

    request(_.extend(defaultReq, occursReqUrl), function(err, res, body) {

      if(err) return doneFetchOccurrences(err);

      var occurrences = tryJSON(body) || [];

      var spaceIds = [];

      _.each(occurrences, function(occurrence) {
        // Store space id for following spaces request
        spaceIds.push(occurrence.rule.spaceId);
      });

      async.parallel([function(doneParallel){
        saveOccurrences(occurrences, doneParallel);
      }, function(doneParallel){
        fetchSpaces(spaceIds, doneParallel);
      }], doneFetchOccurrences);
    });
  }

  function saveOccurrences(occurrences, done) {
    async.eachSeries(occurrences, function(occurrence, doneEach){

      async.series ([ function(cb) {
        Occurrence.update({_id: occurrence.id}, occurrence.rule, {upsert: true}, cb);
      }, function(cb){
        Event.update({_id: occurrence.eventId}, {$addToSet: {'occurrences': occurrence.id }}, {upsert: true}, cb);
      }], doneEach);
    }, done);
  }

  /**
  * Spaces
  **/

  function fetchSpaces(spacesIds, doneFetchSpaces) {

    var i, j, chunk = 500, chunked = [];

    for(i = 0, j = spacesIds.length; i<j; i += chunk) {
      chunked.push(spacesIds.slice(i, i+chunk));
    }

    var spaces = [];

    async.eachSeries(chunked, function(chunk, cb) {

      var ids = chunk.join(',');

      var req = {
        url: config.mapasCulturais.endpoint + '/space/find',
        qs: {
          '@select': 'id,name,shortDescription,endereco,location,acessibilidade',
          '@files': '(avatar.viradaSmall,avatar.viradaBig):url',
          'id': 'in(' + ids + ')',
        }
      };

      request(_.extend(defaultReq, req), function(err, res, body) {

        if(err) {
          cb(err);
        } else {
          spaces = spaces.concat(tryJSON(body) || []);
          cb();
        }

      });

    }, function(err) {

      async.eachSeries(spaces, function(space, doneEach){
        // space['_id'] = space.id;
        Space.update({ _id: space.id}, space, {upsert: true}, doneEach);
      }, doneFetchSpaces);

    });

    // // create string from array
    // spacesIds = spacesIds.join(',');
    //
    // // request config
    // var spacesReqUrl =
    //
    // // fetch data
    // request(_.extend(defaultReq, spacesReqUrl), function(err, res, body) {
    // 	if(err) return doneFetchSpaces(err);
    //
    // 	// parse result
    // 	var spaces = tryJSON(body) || [];
    //
    // 	// persist spaces to db
    // });
  }

  clearDB(fetchProjects(function(err){
    if (err) {
      console.log('Data sync had errors:');
      console.log(err);
    } else console.log('Data sync completed.');
  }));

};

if(!module.parent) {
  module.exports();
}
