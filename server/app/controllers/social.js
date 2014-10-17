
exports.index = function(req, res) {

	var data = req.app.locals.social || [];

	var perPage = parseInt(req.query.perPage || 20);
	var page = parseInt(req.query.page || 1);
	var offset = (page-1) * perPage;

	if(offset > data.length) {
		res.status(404).send('Not found');
	} else {
		res.send({
			pagination: {
				currentPage: parseInt(page),
				perPage: parseInt(perPage),
				totalPages: Math.floor(data.length/perPage)
			},
			data: data.slice(offset, offset+perPage)
		});
	}

}