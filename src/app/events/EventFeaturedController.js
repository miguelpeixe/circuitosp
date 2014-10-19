'use strict';

module.exports = [
	'$q',
	'$interval',
	'$timeout',
	'$state',
	'EventService',
	'$scope',
	function($q, $interval, $timeout, $state, Event, $scope) {

		$scope.service = Event;

		$scope.events = Event.getEvents();

		$scope.spaces = Event.getSpaces();

		// update space data
		_.each($scope.spaces, function(space) {
			space.events = angular.copy(_.filter($scope.events, function(e) {
				return _.find(e.occurrences, function(occur) {
					return occur.spaceId == space.id;
				});
			}));
		});

		$scope.featuredEvent = function(geocode) {

			var amount = 3;

			var getCloseSpaces = function(amount) {

				var orderedSpaces = _.sortBy($scope.spaces, function(s) { return s._distance; });

				orderedSpaces = _.filter(orderedSpaces, function(s) { return s.events.length && Event.getFutureEvents(null, s.events).length; });

				if(orderedSpaces.length)
					return orderedSpaces;

				return false;

			};

			var closestSpaces = false;
			var occurrences = [];
			var featured = false;

			if(geocode) {
				var closestSpaces = getCloseSpaces(amount);
			}

			// geolocation is broken or couldnt find close space
			if(!closestSpaces.length || !closestSpaces[0]._distance || closestSpaces[0]._distance > 10 * 1000) {

				occurrences = _.filter(Event.getOccurrences(), function(occur) { return occur.isFuture; });

				var label;
				var type;

				if(!occurrences.length) {
					occurrences = _.sample(Event.getOccurrences(), amount);
					label = 'Destaque';
					type = 'old';
				} else {
					occurrences = _.sample(occurrences.slice(0, 10), amount);
					label = 'Em breve';
					type = 'far';
				}

				featured = {
					label: label,
					type: type,
					events: []
				};

				_.each(occurrences, function(occur) {
					featured.events.push({
						event: Event.getOccurrenceEvent(occur),
						occurrence: occur,
						space: Event.getOccurrenceSpace(occur)
					});
				});

			} else {

				var i = 0;
				_.each(closestSpaces, function(space) {
					_.each(Event.getOccurrences(), function(occur) {
						if(i >= 10)
							return false;
						if(occur.spaceId == space.id && occur.isFuture) {
							occurrences.push(occur);
							i++;
						}
					});
				});

				occurrences = _.sample(occurrences, amount);

				featured = {
					type: 'near',
					label: 'Perto de você',
					events: []
				};

				_.each(occurrences, function(occur) {
					featured.events.push({
						event: Event.getOccurrenceEvent(occur),
						occurrence: occur,
						space: Event.getOccurrenceSpace(occur)
					});
				});

			}

			return featured;

		};

		$scope.featured = $scope.featuredEvent(false);

		/*
		 * Load space distances and rerender featured event
		 */
		Event.initUserLocation().then(function() {
			_.each($scope.spaces, function(space) {
				var d = Event.getSpaceDistance(space);
				space._distance = d;
				space.kmDistance = Math.round(d/10)/100;
			});
			$scope.featured = $scope.featuredEvent(true);
		});

		$scope.openFeatured = function(event, featEvent) {
			if(featEvent != $scope.openedFeatured) {

				$scope.featured.image = '';
				if(featEvent.event['@files:header']) {
					$scope.featured.image = featEvent.event['@files:header'].url;
				}

				if(event) {
					event.stopPropagation();
					event.preventDefault();
				}

				$scope.openedFeatured = featEvent;

				$interval.cancel(featuredInterval);
				featuredInterval = $interval(function() {
					var toOpen = $scope.featured.events[$scope.featured.events.indexOf($scope.openedFeatured)+1] || $scope.featured.events[0];
					$scope.openFeatured(false, toOpen);
				}, 8000);

			}
		};

		var featuredInterval = $interval(function() {
			var toOpen = $scope.featured.events[$scope.featured.events.indexOf($scope.openedFeatured)+1] || $scope.featured.events[0];
			$scope.openFeatured(false, toOpen);
		}, 8000);

		$scope.$watch('featured', function(featured) {
			if(featured && featured.events.length)
				$scope.openFeatured(null, featured.events[0]);
		});

	}

];