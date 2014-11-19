'use strict';

module.exports = [
	'MetaService',
	'SocialData',
	'$scope',
	function(Meta, SocialData, $scope) {

		Meta.setTitle('Na Rede');
		Meta.setTags(false);

		$scope.items = SocialData.data;

		$scope.nextPage = function() {
			$scope.loading = true;
			SocialData.nextPage().then(function(data) {
				$scope.loading = false;
				if(data) {
					if(data.pagination.currentPage == data.pagination.totalPages)
						$scope.lastPage = true;
					$scope.items = $scope.items.concat(data.data);
				}
			});
		};

	}
]