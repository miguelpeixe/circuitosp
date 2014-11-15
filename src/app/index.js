'use strict';

require('./helpers');

/*
 * Modules
 */

require('./home');
require('./events');
require('./spaces');
require('./news');
require('./social');

require('./facebook');

/*
 * App
 */

angular.module('mci', [
	'ui.router',
	'FacebookPluginDirectives',
	'mci.home',
	'mci.events',
	'mci.spaces',
	'mci.news',
	'mci.social'
])

.config([
	'$stateProvider',
	'$urlRouterProvider',
	'$locationProvider',
	'$httpProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
		$locationProvider.hashPrefix('!');

		$stateProvider
			.state('about', {
				url: '/sobre/',
				templateUrl: '/views/pages/about.html'
			})
			.state('press', {
				url: '/imprensa/',
				templateUrl: '/views/pages/press.html'
			});

		/*
		 * Trailing slash rule
		 */
		$urlRouterProvider.rule(function($injector, $location) {
			var path = $location.path(),
				search = $location.search(),
				params;

			// check to see if the path already ends in '/'
			if (path[path.length - 1] === '/') {
				return;
			}

			// If there was no search string / query params, return with a `/`
			if (Object.keys(search).length === 0) {
				return path + '/';
			}

			// Otherwise build the search string and return a `/?` prefix
			params = [];
			angular.forEach(search, function(v, k){
				params.push(k + '=' + v);
			});
			
			return path + '/?' + params.join('&');
		});

	}
])

/* 
 * Track history and push navigation to Google Analytics
 */
.run([
	'$rootScope',
	'$location',
	'$window',
	function($rootScope, $location, $window) {

		/*
		 * Store nav history
		 */
		$window.mci.history = [];
		$rootScope.$on('$stateChangeSuccess', function() {

			if($window._gaq) {
				$window._gaq.push(['_trackPageview', $location.path()]);
			}
			$window.mci.history.push($window.location.pathname);

		});

	}
])

.filter('offset', function() {
	return function(input, start) {
		start = parseInt(start, 10);
		return input.slice(start);
	};
})

.directive('fromnow', [
	'$interval',
	function($interval) {
		return {
			scope: {
				date: '=date'
			},
			template: '{{fromNow}}',
			link: function(scope, element, attrs) {

				var today = moment();

				var date = moment(scope.date*1000);

				scope.fromNow = date.from(today);
				var interval = $interval(function() {
					scope.fromNow = date.from(today);
				}, 1000*60);

				scope.$watch('date', function() {
					date = moment(scope.date*1000);
					scope.fromNow = date.from(today);
					$interval.cancel(interval);
					interval = $interval(function() {
						scope.fromNow = date.from(today);
					}, 1000*60);
				});
			}
		}
	}
])

.controller('NavCtrl', [
	'RelativeDateService',
	'$state',
	'$scope',
	'$sce',
	function(RelativeDate, $state, $scope, $sce) {

		$scope.nav = [
			{
				title: 'Programação',
				href: '/agenda/'
			},
			{
				title: 'Notícias',
				href: '/noticias/'
			},
			{
				title: 'Locais',
				href: '/locais/'
			},
			{
				title: 'Na rede',
				href: '/na-rede/'
			},
			{
				title: 'Inscrições',
				href: '/inscricoes/'
			},
			{
				title: 'Sobre',
				href: '/sobre/'
			}
		];

		var relativeDates = RelativeDate.get();

		$scope.nav[0].child = [];
		for(var slug in relativeDates) {
			$scope.nav[0].child.push({
				title: slug,
				href: $state.href('events.filter', {startDate: relativeDates[slug][0].format('YYYY-MM-DD'), endDate: relativeDates[slug][1].format('YYYY-MM-DD')})
			});
		}

	}
])

/*
 * Loading module
 */

.config([
	'$httpProvider',
	function($httpProvider) {
		$httpProvider.interceptors.push('loadingStatusInterceptor');
	}
])

.service('LoadingService', [
	function() {

		var loads = [];

		return {
			get: function() {
				return loads;
			},
			add: function(text, id) {
				if(typeof id == 'undefined')
					id = Math.random();

				var load = {
					_id: id,
					msg: text
				};

				loads.push(load);
				loads = loads; // trigger digest?
				return load._id;
			},
			remove: function(id) {
				loads = loads.filter(function(load) { return load._id !== id; });
				loads = loads;
				return loads;
			}
		}

	}
])

.directive('loadingStatusMessage', [
	'LoadingService',
	function(service) {
		return {
			link: function($scope, $element, attrs) {
				$scope.$watch(function() {
					return service.get();
				}, function(loads) {
					$scope.loads = loads;
				});
			},
			template: '<div class="loading-message"><span ng-repeat="load in loads" ng-show="load.msg">{{load.msg}}<br/></span></div>'
		};
	}
])

.factory('loadingStatusInterceptor', [
	'$q',
	'$rootScope',
	'$timeout',
	'LoadingService',
	function($q, $rootScope, $timeout, service) {
		return {
			request: function(config) {

				if(config.loadingMessage)
					config.loadingId = service.add(config.loadingMessage);

				return config || $q.when(config);
			},
			response: function(response) {

				if(response.config.loadingId)
					service.remove(response.config.loadingId);

				return response || $q.when(response);
			},
			responseError: function(rejection) {


				if(rejection.config.loadingId)
					service.remove(rejection.config.loadingId);

				return $q.reject(rejection);
			}
		};
	}
]);

$(document).ready(function() {
	$('#loading').addClass('active');
	$.get('/api/v1/data', function(data) {
		window.mci = data;
		$('#loading').removeClass('active');
		angular.bootstrap(document, ['mci']);
	}, 'json');
});