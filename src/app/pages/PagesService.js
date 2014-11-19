'use strict';

module.exports = [
	'$rootScope',
	'$q',
	'LoadingService',
	function($rootScope, $q, Loading) {

		var pages = false;

		return {
			get: function(pageId) {

				var deferred = $q.defer();

				if(pages) {

					deferred.resolve(pages);

				} else {

					var loadId = Loading.add();

					$.ajax({
						url: '/api/v1/pages',
						dataType: 'json',
						success: function(data, text, xhr) {
							$rootScope.$apply(function() {
								Loading.remove(loadId);
								deferred.resolve(data);
							});
						}
					});
				}

				return deferred.promise;
			},
			getPage: function(pageId) {

				var deferred = $q.defer();

				this.get().then(function(data) {
					deferred.resolve(_.find(data, function(page) { return page.ID == pageId; }));
				});

				return deferred.promise;

			}
		}

	}
]