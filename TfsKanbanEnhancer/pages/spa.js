//spa.js
var app = angular.module("kanban",['ngRoute','ui.bootstrap']);






app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});

function cumulativeFlowDiagram  (cfdData,svg,id){
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
      
      svg.datum(cfdData)
        .transition().duration(1000)
        .call(chart)
        // .transition().duration(0)
        .each('start', function() {
          setTimeout(function() {
            d3.selectAll( "#"+id+' *').each(function() {
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

app.directive( 'cfdGraph', [
  function () {
    return {
      restrict: 'E',
      scope: {
        data: '='

      },
      link: function (scope, element) {
        var id = "cfd";
        var svg = d3.select(element[0])
          .append("svg")
          .attr('id', id)
          .attr("style", "height: 500px;");
          
        //Render graph based on 'data'
        scope.render = function(data) {
          cumulativeFlowDiagram(data,svg,id);
        };
 
         //Watch 'data' and run scope.render(newVal) whenever it changes
         //Use true for 'objectEquality' property so comparisons are done on equality and not reference
          scope.$watch('data', function(){
              scope.render(scope.data);
          }, true);
        }
    };
  }
]);

app.factory("cfdFactory", function(){
  var factory = {};
  

  factory.filterCfdChartData = function(cfdRawChartData,start){
        var filteredCfdData = [];
        _.forEach(cfdRawChartData,function(laneData){
          var filteredLane = {};
          filteredLane.key = laneData.key;
          filteredLane.values = filterArray(laneData.values,function(value){
            return value[0]>=start;
          });
          filteredCfdData.push(filteredLane);
        });
        return filteredCfdData;
    };

  factory.buildCfdChartData = function(cfdData){
      var chartData = [];
      var lane,day;
      var laneData;
      console.log("buildCfdChartData");
      if(cfdData.length === 0){
        return cfdData;
      }
      for(lane = 1; lane<cfdData[0].length;lane++){
          laneData = {};
          laneData.key = cfdData[0][lane];
          laneData.values = [];
          for(day = 1 ; day < cfdData.length ; day++){
              laneData.values.push([cfdData[day][0],cfdData[day][lane]]);
          }
          chartData.push(laneData);
      }
      return chartData;
  };

  factory.readableDatesOnCfdData= function (data){
      var copy = _.cloneDeep(data);
      var index;
      for(index = 1 ;index<data.length; index++){
        
        if(!isNaN(data[index][0])){
          copy[index][0] = timeUtil.isoDateFormat(data[index][0]);
        }
      }
      return copy;
  };

  factory.doneStartsFrom0 = function(cfdChartData){
      cfdChartData = _.cloneDeep(cfdChartData);
      var doneAccumulated = cfdChartData[0].values[0][1];
      _.forEach(cfdChartData[0].values, function(value){
        value[1]= value[1] - doneAccumulated;
      });
      return cfdChartData;
  };

  return factory;
});

app.factory("boardDataFactory",function(){
	var factory = {};
	factory.getBoardData = function(board){
		var message = {type:"get-flow-data"};
		message.board = board;
		return sendExtensionMessage(message);
	};
	return factory;
});

app.factory("snapshotFactory",function(){
    var factory = {};
    factory.buildSnapshot = function(boardData){
        var laneIndex;
        var snapshot = boardData.getLatestSnapshot();//snapshots[snapshots.length-1];
        var flowData = boardData.flowData;

        for(laneIndex in snapshot.lanes){
            factory.buildSnapshotForColumn(snapshot,flowData,laneIndex);
        }
        return snapshot;
    };

    factory.buildSnapshotForColumn = function (snapshot, flowData,laneIndex){
        var lane = snapshot.lanes[laneIndex];
        var ticket;
        var i;
        for(i = 0 ; i < lane.tickets.length ; i++ ){
            ticket = lane.tickets[i];
            ticket.daysInColumn = factory.daysInColumn(flowData,ticket.id,lane.name);
            ticket.daysOnBoard = factory.daysOnBoard(flowData,ticket.id);
            ticket.blockedSince = factory.blockedDays(flowData[ticket.id]);
        }
    };

    factory.blockedDays = function (ticket) {
        if(! ticket.blockedSince()){
            return "";
        }
        return timeUtil.highlightTime(timeUtil.daysSince(ticket.blockedSince()),7);
    };

    factory.daysInColumn = function (flowData,ticketId,laneName) {
        return timeUtil.highlightTime(timeUtil.daysSince(flowData.getEnterMilliseconds(ticketId,laneName)),14);
    };

    factory.daysOnBoard = function (flowData,ticketId) {
        return timeUtil.highlightTime(timeUtil.daysSince(flowData[ticketId].enteredBoard()),40);
    };

    return factory;
});

app.controller("TabController",[
                                '$scope',
                                '$location',
                                function($scope,$location){
      $scope.tabs = [];
      $scope.tabs.push({"caption": "CFD", "active":false, "route":"/cfd/"});
      $scope.tabs.push({"caption": "Snapshot", "active":false, "route":"/snapshot/"});
      $scope.tabs.push({"caption": "FlowGrid", "active":true, "route":"/flowgrid/"});
      $scope.tabs.push({"caption": "FlowReport", "active":true, "route":"/flowreport/"});
      $scope.boardUrl = _.last($location.url().split("/"));
      
      $scope.setActiveTab = function(url){
        _.forEach($scope.tabs,function(tab){
          if(url.indexOf(tab.route)>-1){
            tab.active=true;
          }
          tab.active = false;
        });
      };

      $scope.goTo = function(route){
        $location.url(route + $scope.boardUrl);
      };

      $scope.setActiveTab($location.url());
    }
  ]
);

app.controller("SnapshotController", ['$scope','$route', '$routeParams', 'boardDataFactory','snapshotFactory',function( $scope, $route, $routeParams, boardDataFactory,snapshot){
    $scope.board = decodeUrl($routeParams.board);
    var boardData;
    $scope.snapshot;
    boardDataFactory.getBoardData($scope.board).then(function(response){
        boardData = new BoardData(response);
        $scope.snapshot = snapshot.buildSnapshot(boardData);
        $scope.$apply();
    },function(error){
        console.log("send message failed");
    });

    $scope.downloadAsJson = function(){
        downloadAsJson($scope.snapshot,"Snapshot");
    };
}]);

app.controller("CfdController", ['$scope','$route', '$routeParams', 'boardDataFactory','cfdFactory',function( $scope, $route, $routeParams, boardDataFactory,cfd){
      
  $scope.cfdData = [];
  $scope.dt = 0;
  $scope.zeroDone = false;
  $scope.filter = "";
  var cfdDownloadData = [];
  var cfdRawChartData = [];
      
    function updateCfd(cfdTableData){
      var cfdChartData;
      if(cfdTableData.length===0){
        return;
      }
      cfdDownloadData= cfdTableData;
      cfdRawChartData = cfd.buildCfdChartData(cfdDownloadData);
      cfdChartData = cfd.filterCfdChartData(cfdRawChartData,$scope.dt);
      if($scope.zeroDone){
        cfdChartData=cfd.doneStartsFrom0(cfdChartData);
      }
      $scope.cfdData = cfdChartData;
      $scope.start = cfdRawChartData[0].values[0][0];
      $scope.dt = $scope.cfdData[0].values[0][0];
    }

      $scope.toggleMin = function() {
        $scope.start = $scope.start ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };


    $scope.board = decodeUrl($routeParams.board);


    boardDataFactory.getBoardData($scope.board).then(function(response){
      $scope.boardData = new BoardData(response);
      updateCfd($scope.boardData.getCfdData());
      $scope.$apply();
     },function(error){
      console.log("send message failed");
    });

    $scope.startDateChanged = function() {
       updateCfd(cfdDownloadData);
    };
    
    $scope.filterChanged = function() {
       var parameter = {"text": $scope.filter};
       cfdDownloadData = $scope.boardData.getCfdData(parameter);
       updateCfd(cfdDownloadData);
    };

    $scope.downloadAsJson = function(){
      var download = readableDatesOnCfdData(cfdDownloadData);
      downloadAsJson(download,"CFD_Data");
    };

    $scope.downloadAsCSV = function(){
      var download = readableDatesOnCfdData(cfdDownloadData);
      downloadAsCSV(download,"CFD_Data");
    };

 }]);


app.config(['$routeProvider',
    function($routeProvider) {
            $routeProvider.
      when('/cfd/:board', {
        templateUrl: 'templates/cumulative-flow-diagram.html',
        controller: 'CfdController'
      }).when('/snapshot/:board', {
        templateUrl: 'templates/snapshot.html',
        controller: 'SnapshotController'
      }).when('/flowreport/:board', {
        templateUrl: 'templates/cumulative-flow-diagram.html',
        controller: 'CfdController'
      }).otherwise({
        redirectTo: '/cfd/:board'
      });
	}
]);
