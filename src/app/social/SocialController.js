'use strict';

module.exports = [
	'$sce',
	'$scope',
	function($sce, $scope) {

		$scope.getMedia = function(item) {

			var media = '';

			if(item.media_provider == 'youtube') {
				media = '<iframe src="' + item.content + '" width="100%" height="300" frameborder="0" />';
			} else {
				media = '<img src="' + item.content + '" />';
			}

			return $sce.trustAsHtml(media);

		};

		$scope.getMediaIcon = function(item) {

			var icon;

			switch(item.media_provider) {
				case 'youtube':
					icon = 'video';
					break;
				case 'instagram':
					icon = 'instagram';
					break;
				case 'flickr':
					icon = 'flickr';
					break;
			}

			return $sce.trustAsHtml(icon);

		};

	}
]