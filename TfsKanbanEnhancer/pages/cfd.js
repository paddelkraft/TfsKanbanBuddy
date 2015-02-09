var message = {type:"get-flow-data"};
var boardData;
var cfdData;
message.board = decodeURIComponent(document.URL.split("?")[1]);
console.log(message.board);
chrome.runtime.sendMessage(message, function(response){
	boardData = new BoardData(response);
	cfdData = boardData.buildCfdChartData(boardData.getCfdData());
	cumulativeFlowDiagram(cfdData,'#chart1');
	
});

function cumulativeFlowDiagram(cfdData,chartSelector){
	var colors = d3.scale.category20();
	keyColor = function(d, i) {return colors(d.key);};

	var chart;
	nv.addGraph(function() {
		chart = nv.models.stackedAreaChart()
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
	
	d3.select(chartSelector)
		.datum(cfdData)
		.transition().duration(1000)
		.call(chart)
		// .transition().duration(0)
		.each('start', function() {
			setTimeout(function() {
				d3.selectAll(chartSelector +' *').each(function() {
					console.log('start',this.__transition__, this);
					// while(this.__transition__)
					if(this.__transition__)
						this.__transition__.duration = 1;
				});
			}, 0);
		});

		nv.utils.windowResize(chart.update);

		return chart;
	});
}