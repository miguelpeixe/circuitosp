'use strict';

angular.module('mci.events', [
	'ui.router',
	'pickadate',
	'leaflet-directive',
	'wu.masonry',
	'infinite-scroll',
	'ngDialog'
])
.config([
	'$stateProvider',
	function($stateProvider) {

		$stateProvider
			.state('events', {
				url: '/agenda/',
				controller: 'EventIndexController',
				templateUrl: '/views/events/index.html'
			})
			.state('events.filter', {
				url: ':tag/:startDate/:endDate/:linguagem/:search/:space/:past/:classificacao/'
			})
			.state('eventsSingle', {
				url: '/agenda/:eventId/',
				controller: 'EventSingleController',
				templateUrl: '/views/events/single.html',
				resolve: {
					'EventData': [
						'$stateParams',
						'EventService',
						function($stateParams, Event) {
							return Event.getEvent($stateParams.eventId);
						}
					]
				}
			});

	}
])

.factory('EventService', require('./EventService'))
.controller('EventController', require('./EventController'))
.controller('EventIndexController', require('./EventIndexController'))
.controller('EventFeaturedController', require('./EventFeaturedController'))
.controller('EventSingleController', require('./EventSingleController'))
.controller('MapController', require('./MapController'));

require('./EventFilters');