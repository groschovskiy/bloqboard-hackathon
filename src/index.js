import { request } from 'graphql-request';

function collateralization_chart_func() {
	var timeFormat = 'MM/DD/YYYY HH:mm';

	function myMap(item)
	{
		return {
			x: item.time,
			y: item.ratio
		};
	}

	function myMap2(item)
	{
		return {
			x: moment.unix(item.time).toDate(),
			y: item.close
		};
	}

	function reloadData(cdp_id)
	{
		var query = '{ getCup(id:' + cdp_id + ') { actions { nodes {time ratio} } } }';

		request('https://graphql.makerdao.com/v1', query).then(data => {
			var timeSeries = data.getCup.actions.nodes.map(myMap);

			axios.get('https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=USD&limit=30&aggregate=1')
			 	.then(function(response) {
			 		var rates = response.data.Data.map(myMap2);

			 		var ctx = document.getElementById("collateralization-chart");
					var myChart = new Chart(ctx, {
				type: 'line',
				data: {
					datasets: [{
						label: 'Line',
						backgroundColor: 'rgb(255, 99, 132)',
						borderColor: 'rgb(255, 99, 132)',
						fill: false,
						data: timeSeries
					},
					{
						label: 'Rates',
						backgroundColor: 'rgb(255, 99, 132)',
						borderColor: 'rgb(255, 99, 132)',
						fill: false,
						data: rates
					}]
				},
				options: {
					title: {
						text: 'CDP Chart'
					},
					scales: {
						xAxes: [{
							type: 'time',
							scaleLabel: {
								display: true,
								labelString: 'Date'
							},
							time:{
								unit: 'day'
							}
						}],
						yAxes: [{
							ticks: {
								min: 100
							},
							scaleLabel: {
								display: true,
								labelString: 'Сollateral-to-debt Ratio, %'
							}
						}]
					},
				}
			});
			});
		});
	};

	document.getElementById('update').addEventListener('click', function() {
		var cdp_id = document.getElementById('cdp-id').value;
		reloadData(cdp_id);
	});
};

collateralization_chart_func();