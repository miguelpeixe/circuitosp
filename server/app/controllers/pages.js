var request = require('request');

var cache = {};

exports.all = function(req, res) {

	var config = req.app.locals.config;

	if(!config.wordpress.endpoint)
		return res.status(404).send('WordPress API not defined');

	var key = require('crypto').createHash('md5').update('all-' + JSON.stringify(req.query)).digest('hex');

	request({
		url: config.wordpress.endpoint + '/wp-json/pages',
		qs: req.query
	}, function(request, response, body) {


		if(!body) {

			res.send([]);

		} else {
			var send = false;

			if(!cache[key]) {
				send = true;
				cache[key] = {};
			}

			cache[key].body = body;
			cache[key].headers = {};

			if(response && response.headers) {
				for(var headerKey in response.headers) {
					if(send)
						res.setHeader(headerKey, response.headers[headerKey]);
					cache[key].headers[headerKey] = response.headers[headerKey];
				}
			}

			if(send)
				res.send(body);
		}

	});

	if(cache[key]) {
		for(var headerKey in cache[key].headers) {
			res.setHeader(headerKey, cache[key].headers[headerKey]);
		}
		res.send(cache[key].body);
	}

}