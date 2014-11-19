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
					],
					SocialData: [
						'SocialService',
						function(Social) {
							return Social.get(3);
						}
					]
				}
			});

	}
])
.controller('HomeController', [
	'MetaService',
	'NewsData',
	'SocialData',
	'EventService',
	'$interval',
	'$timeout',
	'$scope',
	function(Meta, NewsData, SocialData, Event, $interval, $timeout, $scope) {

		Meta.setTitle(false);
		Meta.setTags({
			'description': 'Uma nova política de programação cultural que integra todas as regiões de São Paulo por meio da Música, Dança, Teatro, Circo e atrações artísticas para o público infantil. A cidade conectada pela arte.'
		});

		if(NewsData)
			$scope.news = NewsData.data.slice(0,5);

		$scope.current = 0;

		$scope.setArticle = function(id) {
			$scope.current = id;
			$interval.cancel(rotate);
			rotate = $interval($scope.nextArticle, 8000);
		};

		$scope.nextArticle = function() {
			if($scope.news[$scope.current+1]) {
				$scope.setArticle($scope.current+1);
			} else {
				$scope.setArticle(0);
			}
		}

		$scope.prevArticle = function() {
			if($scope.news[$scope.current-1]) {
				$scope.setArticle($scope.current-1);
			} else {
				$scope.setArticle($scope.news.length-1);
			}
		}

		var rotate = $interval($scope.nextArticle, 8000);

		$scope.socialItems = SocialData.data;

		$scope.homeEvents = Event.getFutureEvents(8);
		$scope.isFutureEvents = true;
		$scope.eventsTitle = 'Próximos eventos';
		if(!$scope.homeEvents.length) {
			$scope.homeEvents = Event.getEvents().slice(0, 8);
			$scope.isFutureEvents = false;
			$scope.eventsTitle = 'Últimos eventos';
		}

		$scope.nextPage = function() {
			page++;
			$scope.homeEvents = $scope.homeEvents.concat(Event.getEvents().slice(10*page, (10*page) + 10));
		};

		$scope.allEvents = Event.getEvents();
		$scope.allSpaces = Event.getSpaces();

	}
]);