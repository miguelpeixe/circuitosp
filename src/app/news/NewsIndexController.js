'use strict';

module.exports = [
	'MetaService',
	'$sce',
	'$state',
	'$stateParams',
	'NewsData',
	'NewsService',
	'$scope',
	function(Meta, $sce, $state, $stateParams, NewsData, News, $scope) {

		Meta.setTitle('Notícias');
		Meta.setTags(false);

		$scope.query = NewsData;

		$scope.items = $scope.query.data.slice(0);

		$scope.$on('$stateChangeSuccess', function(event, toState) {
			if(toState.name == 'news')
				$scope.query = NewsData;
		});

		$scope.$watch('query', function(query) {
			$scope.query = query;
			$scope.items = query.data;
		});

		$scope.getExcerpt = function(post) {
			return $sce.trustAsHtml(post.excerpt);
		};

		$scope.getDate = function(post) {
			return moment(post.date).format('LLLL');
		};

		$scope.getFeaturedImage = function(post) {
			if(post.featured_image) {
				if(post.featured_image.attachment_meta.sizes.large)
					return post.featured_image.attachment_meta.sizes.large.url;
				else
					return post.featured_image.source;
			}
			return false;
		}

		$scope.$watch('search', _.debounce(function(text, prevText) {

			if(text) {

				$state.go('news.search', { text: text });

			} else if(prevText) {

				$state.go('news');

			}

		}, 400));

		$scope.nextPage = function() {
			if(!$scope.loading) {
				$scope.loading = true;
				$scope.query.nextPage().then(function(items) {
					$scope.loading = false;
					$scope.items = $scope.items.concat(items);
				});
			}
		};

		$scope.hasNextPage = function() {
			return $scope.query.totalPages() > $scope.query.currentPage(); 
		};

	}
]