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
					icon = '&#127916;';
					break;
				case 'instagram':
					icon = '&#62253;';
					break;
				case 'flickr':
					icon = '&#62211;';
					break;
			}

			return $sce.trustAsHtml(icon);

		};

	}
]