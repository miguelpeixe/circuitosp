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

.directive('occurrenceSlider', [
	'$timeout',
	'$interval',
	function($timeout, $interval) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {

				scope.$watch(function() {
					return scope.filteredOccurs.length;
				}, function() {
					scope.current = 0;
				});

				scope.current = 0;

				scope.setOccur = function(id) {
					scope.current = id;
					$timeout(function() {
						$(window).trigger('resize');
					}, 500);
				};

				scope.nextOccur = function() {
					if(scope.filteredOccurs[scope.current+1]) {
						scope.setOccur(scope.current+1);
					} else {
						scope.setOccur(0);
					}
				}

				scope.prevOccur = function() {
					if(scope.filteredOccurs[scope.current-1]) {
						scope.setOccur(scope.current-1);
					} else {
						scope.setOccur(scope.filteredOccurs.length-1);
					}
				}

			}
		}
	}
])

.factory('EventService', require('./EventService'))
.factory('RelativeDateService', require('./RelativeDateService'))
.controller('EventController', require('./EventController'))
.controller('EventIndexController', require('./EventIndexController'))
.controller('EventFeaturedController', require('./EventFeaturedController'))
.controller('EventSingleController', require('./EventSingleController'))
.controller('MapController', require('./MapController'));

require('./EventFilters');