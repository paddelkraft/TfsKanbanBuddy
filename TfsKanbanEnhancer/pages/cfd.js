var message = {type:"get-flow-data"};
message.board = decodeURIComponent(document.URL.split("?")[1]);
console.log(message.board);
chrome.runtime.sendMessage(message, function(response){
	var boardData = new BoardData(response);
	var cfd = boardData.buildCfdChartData(boardData.getCfdData());
	var colors = d3.scale.category20();
	keyColor = function(d, i) {return colors(d.key);};

	var chart;
	nv.addGraph(function() {
		chart = nv.models.stackedAreaChart()
						// .width(600).height(500)
						.useInteractiveGuideline(true)
						.x(function(d) { return d[0]; })
						.y(function(d) { return d[1]; })
						.color(keyColor)
						.transitionDuration(300);
						//.clipEdge(true);

	// chart.stacked.scatter.clipVoronoi(false);

		chart.xAxis
			.tickFormat(function(d) { return d3.time.format('%Y-%m-%d')(new Date(d)); });
		chart.yAxis
			.tickFormat(d3.format(',.2f'));
	
	d3.select('#chart1')
		.datum(cfd)//histcatexplong)
		.transition().duration(1000)
		.call(chart)
		// .transition().duration(0)
		.each('start', function() {
			setTimeout(function() {
				d3.selectAll('#chart1 *').each(function() {
					console.log('start',this.__transition__, this);
					// while(this.__transition__)
					if(this.__transition__)
						this.__transition__.duration = 1;
				});
			}, 0);
		});

		nv.utils.windowResize(chart.update);

		// chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
		return chart;
	});
});
//var cfd = [{"key":"In production","values":[[0,0],[86400000,0],[172800000,0],[259200000,1]]},{"key":"Dev DONE","values":[[0,0],[86400000,0],[172800000,1],[259200000,1]]},{"key":"Dev IP","values":[[0,0],[86400000,1],[172800000,1],[259200000,1]]},{"key":"ToDo","values":[[0,1],[86400000,1],[172800000,1],[259200000,1]]}]
