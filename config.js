'use strict';

require('dotenv').load();

module.exports = {
	apiUrl: process.env.MCI_API_URL || 'http://spcultura.prefeitura.sp.gov.br/api',
	projectId: process.env.MCI_PROJECT_ID || 4,
	wpUrl: process.env.MCI_WP_URL || false,
	hashtag: process.env.MCI_HASHTAG || null,
	password: process.env.MCI_PASSWORD || false,
	socialApiKeys: {
		instagram: process.env.MCI_INSTAGRAM_CLIENT_ID || null,
		flickr: process.env.MCI_FLICKR_API_KEY || null
	}
}