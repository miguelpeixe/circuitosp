'use strict';

module.exports = [
	function() {

		var relativeDates = {
			'Hoje': [
				moment.tz('America/Sao_Paulo'),
				moment.tz('America/Sao_Paulo')
			],
			'Amanhã': [
				moment.tz('America/Sao_Paulo').add(1, 'day'),
				moment.tz('America/Sao_Paulo').add(1, 'day')
			],
			'Este final de semana': [
				moment.tz('America/Sao_Paulo').day(5),
				moment.tz('America/Sao_Paulo').day(7)
			],
			'Próximo final de semana': [
				moment.tz('America/Sao_Paulo').day(7+5),
				moment.tz('America/Sao_Paulo').day(7+7)
			],
			'Este mês': [
				moment.tz('America/Sao_Paulo').date(1),
				moment.tz('America/Sao_Paulo').endOf('month')
			]
		};

		return {
			get: function(slug) {
				if(relativeDates[slug])
					return relativeDates[slug];
				else
					return relativeDates;
			},
			wich: function(startDate, endDate) {

				startDate = startDate || moment.tz('America/Sao_Paulo');

				if(typeof startDate == 'string')
					startDate = moment.tz(startDate, 'America/Sao_Paulo');

				endDate = endDate || startDate;

				if(typeof endDate == 'string')
					endDate = moment.tz(endDate, 'America/Sao_Paulo');

				var date = [startDate, endDate];

				for(var filter in relativeDates) {
					if(date[0].isSame(relativeDates[filter][0], 'day') && date[1].isSame(relativeDates[filter][1], 'day')) {
						return filter;
					}
				}

				return false;

			}
		}

	}
];