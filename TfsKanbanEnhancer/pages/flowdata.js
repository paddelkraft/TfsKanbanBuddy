	function FlowDataGrid(flowData , lanes){
		//internal helper functions
		function flowDataLaneNamesHeader(lanes){
			var columnIndexes = getLaneIndexes(lanes);
			var columnsInRow = 2*lanes.length+2;
			var row = new Array(columnsInRow);
			var columnName;
			for(columnName in columnIndexes){
				row[columnIndexes[columnName]] = columnName;
			}
			return row;
		}

		function flowDataEnterExitLaneHeader(numberOfLanes){
			var columnsInRow = 2*numberOfLanes+2;
			var row = new Array(columnsInRow);
			var index;
			row[0] = "TFS Id";
			row[1] = "Title";
			for(index =2; index<columnsInRow; index +=2){
				row[index] = "First";
				row[index + 1] = "Last";
			}
			return row;
		}

		function flowDataRow(flowTicket,columnIndexes,lanes){
			var row = new Array(lanes.length*2 + 2);
			var laneName;
			var lane;
			row[0]=  flowTicket.id;
			row[1] =  flowTicket.title;
			for(laneName in flowTicket.lanes){
				lane = flowTicket.lanes[laneName];
				row[columnIndexes[laneName]] = lane.enter();
				row[columnIndexes[laneName]+1] = lane.exit();
			}
			return row;
		}

		//construction
		function bulidFlowDataGrid(flowData , lanes){
			var columnIndexes = getLaneIndexes(lanes);
			var grid = [];
			var flowTicket;
			grid.push(flowDataLaneNamesHeader(lanes));
			grid.push(flowDataEnterExitLaneHeader(lanes.length));
			
			for (var id in flowData){
				flowTicket = flowData[id];
				grid.push(flowDataRow(flowTicket,columnIndexes,lanes));
			}
			return grid;
		}
		return bulidFlowDataGrid(flowData , lanes);
		
	} //flowdataGrid

		
	
		

	function buildFlowReport(flowData){
		var flowReport = [];
		//Header
		var row = ["Id", "Title","url","lane", "first" , "last"];
		flowReport.push(row);
		
		for (var id in flowData){
			var flowTicket = flowData[id];
			if(flowTicket.id){
				for(var laneName in flowTicket.lanes){
					var lane = flowTicket.lanes[laneName];
					flowReport.push( [ flowTicket.id, flowTicket.title, flowTicket.url(), laneName, lane.enter(), lane.exit()] );
				}
				flowReport.push( ["","","","","",""] );
			}
		}
		
		return flowReport;
	}


	function buildSnapshot(boardData){
		var snapshotDiv = document.createElement("div");
		var laneDiv;
		var laneIndex;
		var snapshot = boardData.getLatestSnapshot();//snapshots[snapshots.length-1];
		var flowData = boardData.flowData;
		
		for(laneIndex in snapshot.lanes){
			buildSnapshotForColumn(snapshot,flowData,laneIndex);
		}
		return snapshot;
	}

	function buildSnapshotForColumn(snapshot, flowData,laneIndex){
		var laneDiv =document.createElement("div");
		var lane = snapshot.lanes[laneIndex];
		var ticket;
		var i;
		for(i = 0 ; i < lane.tickets.length ; i++ ){
			ticket = lane.tickets[i];
			ticket.daysInColumn = daysInColumn(flowData,ticket.id,lane.name);
			ticket.daysOnBoard = daysOnBoard(flowData,ticket.id);
		}
	}


    function daysInColumn (flowData,ticketId,laneName) {
		return highlightTime(daysSince(flowData.getEnterMilliseconds(ticketId,laneName)));
    }

    function daysOnBoard (flowData,ticketId) {
		return highlightTime(daysSince(getEnterBoardMilliseconds(flowData,ticketId)));
    }
	
	function getEnterBoardMilliseconds (flowData,ticketId) {
		var enterMilliseconds = new Date();
		var flowTicket = flowData[ticketId];
		var laneName;
		var lane;
		for(laneName in flowTicket.lanes){
			lane = flowTicket.lanes[laneName];
			if(lane.enterMilliseconds<enterMilliseconds){
				enterMilliseconds = lane.enterMilliseconds;
			}
		}
		return enterMilliseconds;
	}

	function highlightTime(days){
		if(days<2){
			return "new";
		} else if(days>14){
			return days+" (old)";
		}
		return days;
	}
	
	function getLaneIndexes(lanes){
		var indexes = {};
		var lane;
		for(lane = 0; lane<lanes.length; lane++){
			indexes[lanes[lane]] = 2*lane +2;
		}
		return indexes;
	}


//setup();

var app = angular.module("flowData", []);

 app.controller("flowReportController", function($scope){
       function fetchFlowData(){
		var message = {type:"get-flow-data"};
		message.board = decodeURIComponent(document.URL.split("?")[1]);
		console.log(message.board);
		chrome.runtime.sendMessage(message, function(response){
			var boardData = new BoardData(response);
			var lanes = boardData.getLaneHeaders();
			$scope.snapshot = buildSnapshot(boardData);
			$scope.flowReport = buildFlowReport(boardData.flowData);
			$scope.flowReport.shift();
			$scope.flowDataGrid = new FlowDataGrid(boardData.flowData , boardData.getLaneHeaders());
			$scope.dataSize = "Data size = " +parseInt( boardData.size()/1024) +"KB";
			$scope.board = boardData.board;
			$scope.flowReportAction = function (){
				
					$scope.exportAsJson = function(){
						downloadAsJson(buildFlowReport(boardData.flowData),"flowReport")
					};
					$scope.exportAsCsv = function(){
						downloadAsCSV(buildFlowReport(boardData.flowData),"flowReport")
					};
					
					
					$scope.showSnapshot = false;
					$scope.showFlowDataGrid = false;
					$scope.showFlowReport = true;
					//$scope.$apply();
			};

			$scope.flowDataGridAction = function (){
					
						$scope.exportAsJson = function(){
						downloadAsJson(new FlowDataGrid(boardData.flowData, boardData.getLaneHeaders()),"flowDataGrid")
					};
					$scope.exportAsCsv = function(){
						downloadAsCSV(new FlowDataGrid(boardData.flowData, boardData.getLaneHeaders()),"flowDataGrid")
					};
					
					
					$scope.showSnapshot = false;
					$scope.showFlowDataGrid = true;
					$scope.showFlowReport = false;
					//$scope.$apply();
			};

			$scope.snapshotAction = function (){
				
				
					
					$scope.exportAsJson = function(){
						downloadAsJson($scope.snapshot,"boardSnapshot");
					};
					$scope.exportAsCsv = function(){
						alert("snapshot can not be exported as csv yet");
					};
					
					$scope.showSnapshot = true;
					$scope.showFlowDataGrid = false;
					$scope.showFlowReport = false;
					//$scope.$apply();	
			};

			$scope.exportRawData = function (){
				downloadAsJson(boardData,"boardSnapshot");
			};

			$scope.snapshotAction();
			$scope.$apply();
			
		});

	} 
  	fetchFlowData();
 });
