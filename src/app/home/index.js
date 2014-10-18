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

		if(NewsData)
			$scope.news = NewsData.data.slice(0,5);

		$scope.current = 0;

		$scope.nextArticle = function() {
			if($scope.news[$scope.current+1]) {
				$scope.current++;
			} else {
				$scope.current = 0;
			}
		}

		$scope.prevArticle = function() {
			if($scope.news[$scope.current-1]) {
				$scope.current--;
			} else {
				$scope.current = $scope.news.length-1;
			}
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