'use strict';

angular.module('mci.spaces', [
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
			.state('spaces', {
				url: '/locais/',
				controller: 'SpaceIndexController',
				templateUrl: '/views/spaces/index.html'
			})
			.state('spacesSingle', {
				url: '/locais/:spaceId/',
				controller: 'SpaceSingleController',
				templateUrl: '/views/spaces/single.html',
			});

	}
])

.controller('SpaceController', [
	'$scope',
	function($scope) {

	}
])

.controller('SpaceIndexController', [
	'MetaService',
	'$q',
	'$interval',
	'$timeout',
	'$state',
	'EventService',
	'$scope',
	function(Meta, $q, $interval, $timeout, $state, Event, $scope) {

		Meta.setTitle('Locais');
		Meta.setTags(false);

		$scope.service = Event;

		$scope.spaces = Event.getSpaces();

		// Geolocate
		Event.initUserLocation().then(function() {
			_.each($scope.spaces, function(space) {
				var d = Event.getSpaceDistance(space);
				space._distance = d;
				space.kmDistance = Math.round(d/10)/100;
			});
		});

		/*
		 * Space nav
		 */

		$scope.filteredSpaces = [];

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
						this.curPage++;
						$scope.$broadcast('mci.page.next', self);
					}
				},
				prevPage: function() {
					var self = this;
					if(this.curPage > 0) {
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

		$scope.spaceNav = nav('filteredSpaces', 12);

		$scope.$watch('spaceSearch', function() {
			$scope.spaceNav.curPage = 0;
			$scope.spaceNav.offset = 0;
		});

	}

])

.controller('SpaceSingleController', [
	'$scope',
	function($scope) {

	}
])