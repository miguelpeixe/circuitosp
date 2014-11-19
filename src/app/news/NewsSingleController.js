'use strict';

module.exports = [
	'MetaService',
	'PostData',
	'$scope',
	'$sce',
	function(Meta, PostData, $scope, $sce) {

		$scope.post = PostData;

		Meta.setTitle($('<p>' + $scope.post.title + '</p>').text());
		Meta.setTags({'description': $($scope.post.excerpt).text()});

		$scope.getContent = function(post) {

			return $sce.trustAsHtml(post.content);

		};

	}
]