'use strict';

var path = require('path');

require('dotenv').load();

module.exports = {
	db: 'mongodb://localhost/circuitosp',
	root: path.normalize(__dirname),
	wpUrl: process.env.MCI_WP_URL || false,
	hashtag: process.env.MCI_HASHTAG || null,
	password: process.env.MCI_PASSWORD || false,
	socialApiKeys: {
		instagram: process.env.MCI_INSTAGRAM_CLIENT_ID || null,
		flickr: process.env.MCI_FLICKR_API_KEY || null
	}
}