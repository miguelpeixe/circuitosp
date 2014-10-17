var request = require('request');

exports.all = function(req, res) {

	var config = req.app.locals.config;

	console.log(config);

	if(!config.wordpress.endpoint)
		return res.status(404).send('WordPress API not defined');

	request({
		url: config.wordpress.endpoint + '/wp-json/posts',
		qs: req.query
	}, function(request, response, body) {
		for(var key in response.headers) {
			res.setHeader(key, response.headers[key]);
		}
		res.send(body);
	});

}

exports.post = function(req, res) {

	var config = req.app.locals.config;

	if(!config.wordpress.endpoint)
		return res.status(404).send('WordPress API not defined');

	request({
		url: config.wordpress.endpoint + '/wp-json/posts/' + req.params.postId,
		qs: req.body
	}, function(request, response, body) {
		for(var key in response.headers) {
			res.setHeader(key, response.headers[key]);
		}
		res.send(body);
	});

}