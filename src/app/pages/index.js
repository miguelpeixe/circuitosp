'use strict';

angular.module('mci.pages', [
	'ui.router'
])
.config([
	'$stateProvider',
	function($stateProvider) {

		$stateProvider
			.state('page', {
				url: '/p/:pageId/',
				controller: 'NewsSingleController',
				templateUrl: '/views/pages/single.html',
				resolve: {
					'PostData': [
						'$stateParams',
						'PagesService',
						function($stateParams, Page) {
							return Page.getPage($stateParams.pageId);
						}
					]
				}
			});

	}
])
.factory('PagesService', require('./PagesService'));