'use strict';

angular.module('mci.home', [
	'mci.news',
	'mci.events'
])
.config([
	'$stateProvider',
	function($stateProvider) {

		$stateProvider
			.state('home', {
				url: '/',
				controller: 'HomeController',
				templateUrl: '/views/pages/home.html',
				resolve: {
					NewsData: [
						'$q',
						'$window',
						'NewsService',
						function($q, $window, News) {

							if($window.mci.config.wpUrl) {
								return News.get(4);
							} else {
								return false;
							}

						}
					]
				}
			});

	}
])
.controller('HomeController', [
	'NewsData',
	'EventService',
	'$scope',
	function(NewsData, Event, $scope) {

		if(NewsData) {
			$scope.news = {
				first: NewsData.data[0],
				second: NewsData.data[1]
			};
		}

		var page = 0;

		$scope.homeEvents = Event.getFutureEvents(8);
		$scope.isFutureEvents = true;
		if(!$scope.homeEvents.length) {
			$scope.homeEvents = Event.getEvents().slice(0, 10);
			$scope.isFutureEvents = false;
		}

		$scope.nextPage = function() {
			page++;
			$scope.homeEvents = $scope.homeEvents.concat(Event.getEvents().slice(10*page, (10*page) + 10));
		};

		$scope.allEvents = Event.getEvents();
		$scope.allSpaces = Event.getSpaces();

	}
]);