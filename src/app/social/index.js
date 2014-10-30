'use strict';

angular.module('mci.social', [
	'ui.router',
	'infinite-scroll',
	'wu.masonry',
	'ngDialog'
])
.config([
	'$stateProvider',
	function($stateProvider) {

		$stateProvider
			.state('social', {
				url: '/na-rede/',
				controller: 'SocialIndexController',
				templateUrl: '/views/social/index.html',
				resolve: {
					'SocialData': [
						'SocialService',
						function(Social) {
							return Social.get(20);
						}
					]
				}
			});

	}
])
.factory('SocialService', require('./SocialService'))
.controller('SocialIndexController', require('./SocialIndexController'))
.controller('SocialController', require('./SocialController'));