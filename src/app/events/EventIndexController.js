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

		$scope.linguagens = Event.getTaxTerms('linguagem');
		$scope.tags = Event.getTaxTerms('tag');

		/*
		 * NAVIGATION
		 */

		var nav = function(list, perPage, listContainer) {

			return {
				list: list,
				perPage: perPage,
				curPage: 0,
				offset: 0,
				pageCount: function() {
					return Math.ceil($scope.$eval(list).length/this.perPage)-1;
				},
				nextPage: function() {
					var self = this;
					if(this.curPage < this.pageCount()) {
						if(typeof listContainer !== 'undefined' && $(listContainer).length)
							$('html,body').animate({
								scrollTop: $(listContainer).position().top - 40
							}, 300);
						this.curPage++;
						$scope.$broadcast('mci.page.next', self);
					}
				},
				prevPage: function() {
					var self = this;
					if(this.curPage > 0) {
						if(typeof listContainer !== 'undefined' && $(listContainer).length)
							$('html,body').animate({
								scrollTop: $(listContainer).position().top - 40
							}, 300);
						this.curPage--;
						$scope.$broadcast('mci.page.prev', self);
					}
				},
				hasNextPage: function() {
					return this.curPage !== this.pageCount();
				},
				hasPrevPage: function() {
					return this.curPage !== 0;
				}
			};

		};

		/*
		 * Event nav
		 */

		$scope.eventNav = nav('filteredEvents', 12, '#event-list');

		if($state.params.page) {
			$scope.eventNav.curPage = $state.params.page-1;
			$scope.eventNav.offset = $scope.eventNav.perPage * $scope.eventNav.curPage;
		}

		$scope.$watch('eventNav.curPage', function(page, prevPage) {
			if(page || prevPage) {
				$state.go('events.filter', {page:page});
			}
		});

		// update terms filter and state
		$scope.$watch('eventSearch.terms', function(terms, prevTerms) {
			$scope.eventFilter.terms = terms;
			if(terms || prevTerms) {
				$state.go('events.filter', {linguagem:terms});
			}
		}, true);

		// update text search filter and clear pagination (parent object watch doesnt get search text changes)
		$scope.$watch('eventSearch.$', function(text, oldText) {
			$scope.eventFilter.$ = text;
		});

		// update text search state
		$scope.$watch('eventSearch.$', _.debounce(function(text, prevText) {
			if(text || prevText) {
				$state.go('events.filter', {search:text});
			}
		}, 600));

		$scope.isEventFiltering = function() {
			return $scope.eventSearch && (
				$scope.eventSearch.$ ||
				$scope.eventSearch.terms ||
				$scope.eventSearch.startDate ||
				$scope.eventSearch.endDate ||
				$scope.eventSearch.isFuture
			);
		};

		// notworking
		$scope.showFromNow = function(event) {
			var limit = 1000 * 60 * 60 * 4; // Four hours in milliseconds
			return event._timestamp <= Event.getToday().unix() + limit;
		};

		/*
		 * Datepicker
		 */

		var occurrences = Event.getOccurrences();
		$scope.datepicker = {
			format: 'dd/MM/yyyy',
			clear: function() {
				$scope.eventSearch.startDate = '';
				$scope.eventSearch.endDate = '';
			},
			start: {
				minDate: occurrences[0].moment.format('YYYY-MM-DD'),
				maxDate: occurrences[occurrences.length-1].moment.format('YYYY-MM-DD'),
				toggle: function(off) {
					$scope.datepicker.end.opened = false;
					if($scope.datepicker.start.opened || off)
						$scope.datepicker.start.opened = false;
					else
						$scope.datepicker.start.opened = true;
				},
				opened: false
			},
			end: {
				maxDate: occurrences[occurrences.length-1].moment.format('YYYY-MM-DD'),
				setMinDate: function() {
					$scope.datepicker.end.minDate = moment($scope.eventSearch.startDate).add('days', 1).format('YYYY-MM-DD');
				},
				toggle: function(off) {
					$scope.datepicker.start.opened = false;
					if($scope.datepicker.end.opened || off)
						$scope.datepicker.end.opened = false;
					else
						$scope.datepicker.end.opened = true;
				},
				opened: false
			}
		};

		$scope.$watch('eventSearch.startDate', function(date, prevDate) {
			$scope.datepicker.start.toggle(true);
			$scope.datepicker.start.view = moment(date).format('DD/MM');
			if($scope.eventSearch.endDate && date > $scope.eventSearch.endDate) {
				$scope.eventSearch.endDate = '';
			}
			$scope.datepicker.end.setMinDate();
			if(date || prevDate) {
				$state.go('events.filter', {startDate: date});
			}
		});

		$scope.$watch('eventSearch.endDate', function(date, prevDate) {
			$scope.datepicker.end.toggle(true);
			$scope.datepicker.end.view = moment(date).format('DD/MM');
			if(date || prevDate) {
				$state.go('events.filter', {endDate: date});
			}
		});

		/*
		 * Manage filter states
		 */
		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

			if(fromParams.page == toParams.page) {
				$scope.eventNav.curPage = 0;
				$scope.eventNav.offset = 0;
			}

			if(toParams.tag && toParams.tag !== fromParams.tag) {
				$scope.tag = toParams.tag;
			} else if(!toParams.tag) {
				$scope.tag = false;
			}

			if(toParams.space && toParams.space !== fromParams.space) {
				$scope.space = _.find(Event.getSpaces(), function(space) { return space.id == toParams.space; });
			} else if(!toParams.space) {
				$scope.space = false;
			}

			if(!parseInt(toParams.past) && Event.isHappening() && !toParams.startDate) {
				$scope.isFutureEvents = true;
			} else {
				$scope.isFutureEvents = false;
			}

			if(!toParams.space && !toParams.tag && (!toParams.past && Event.isHappening())) {
				$scope.events = Event.getEvents();
			}

			/*
			 * Init search (filter) vals with state params
			 */

			$scope.eventSearch = {
				$: toParams.search || '',
				terms: toParams.linguagem || '',
				startDate: toParams.startDate || '',
				endDate: toParams.endDate || '',
				isFuture: toParams.future || ''
			};

			$scope.eventFilter = {
				$: $scope.eventSearch.$,
				terms: $scope.eventSearch.terms
			};

		});

		$scope.toggleFutureEvents = function() {

			if($scope.isFutureEvents) {
				$state.go('events.filter', {past: 1});
			} else {
				$state.go('events.filter', {past: 0});
			}

		};

		/*
		 * Featured event
		 */

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
					label = 'Acontecendo agora';
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

		/*
		 * Space nav
		 */

		$scope.spaceNav = nav('filteredSpaces', 6);

		$scope.$watch('spaceSearch', function() {
			$scope.spaceNav.curPage = 0;
			$scope.spaceNav.offset = 0;
		});

	}
];