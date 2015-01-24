function FlowDataGrid(boardData){
	var flowData = boardData.flowData;
	var lanes = boardData.getLaneHeaders();
	lanes.push("Blocked");
	//internal helper functions
	function flowDataLaneNamesHeader(lanes){
		var columnIndexes = getLaneIndexes(lanes);
		var columnsInRow = lanes.length+2;
		var row = new Array(columnsInRow);
		var columnName;
		row[0] = "TFS Id";
		row[1] = "Title";
		for(columnName in columnIndexes){
			row[columnIndexes[columnName]] = columnName;
		}
		return row;
	}



	function flowDataRow(flowTicket,columnIndexes,lanes){
		var row = arrayOfNulls(lanes.length+ 2);
		var laneName;
		var lane;

		row[0]=  flowTicket.id;
		row[1] =  flowTicket.title;
		for(laneName in flowTicket.lanes){
			lane = flowTicket.lanes[laneName];
			//_.forEach()
			row[columnIndexes[laneName]] = timeUtil.timeFormat(flowTicket.getTotalTimeInLane(laneName));
			//row[columnIndexes[laneName]] = timeUtil.timeFormat(lane[0].firstSeen-lane[lane.length-1].lastSeen);
		}
		if(flowTicket.getTotalBlockedTime()){
			row[columnIndexes["Blocked"]] = timeUtil.timeFormat(flowTicket.getTotalBlockedTime());
		}
		
		return row;
	}

	function getLaneIndexes(lanes){
		var indexes = {};
		var lane;
		for(lane = 0; lane<lanes.length; lane++){
			indexes[lanes[lane]] = lane +2;
		}
		return indexes;
	}

	//construction
	function bulidFlowDataGrid(flowData , lanes){
		var columnIndexes = getLaneIndexes(lanes);
		var grid = [];
		var flowTicket;
		grid.push(flowDataLaneNamesHeader(lanes));
		
		for (var id in flowData){
			flowTicket = flowData[id];
			if(typeof flowTicket !== "function"){
				grid.push(flowDataRow(flowTicket,columnIndexes,lanes));
			}
		}
		return grid;
	}
	return bulidFlowDataGrid(flowData , lanes);
	
} //flowdataGrid


function buildFlowReport(flowData){
	var flowReport = [];
	var laneName;
	var blockageIndex;
	var blockage;
	var lane;
	var row = ["Id", "Title","url","lane", "first" , "last"];
	flowReport.push(row);
	
	for (var id in flowData){
		var flowTicket = flowData[id];
		if(flowTicket.id){
			for(laneName in flowTicket.lanes){
				_.forEach(flowTicket.lanes[laneName], function(laneRecord){
					lane = flowTicket.lanes[laneName];
					flowReport.push( [ flowTicket.id, flowTicket.title, flowTicket.url(), laneName, laneRecord.enter(), laneRecord.exit()] );
				});
			}
			for(blockageIndex in flowTicket.blockedRecords){
				blockage = flowTicket.blockedRecords[blockageIndex];
				flowReport.push([ flowTicket.id, flowTicket.title, flowTicket.url(), "Blocked", timeUtil.dateFormat(blockage.firstSeen), timeUtil.dateFormat(blockage.lastSeen)]);
			}
			flowReport.push( ["","","","","",""] );
		}
	}
	
	return flowReport;
}


function buildSnapshot(boardData){
	var laneIndex;
	var snapshot = boardData.getLatestSnapshot();//snapshots[snapshots.length-1];
	var flowData = boardData.flowData;
	
	for(laneIndex in snapshot.lanes){
		buildSnapshotForColumn(snapshot,flowData,laneIndex);
	}
	return snapshot;
}

function buildSnapshotForColumn(snapshot, flowData,laneIndex){
	var lane = snapshot.lanes[laneIndex];
	var ticket;
	var i;
	for(i = 0 ; i < lane.tickets.length ; i++ ){
		ticket = lane.tickets[i];
		ticket.daysInColumn = daysInColumn(flowData,ticket.id,lane.name);
		ticket.daysOnBoard = daysOnBoard(flowData,ticket.id);
		ticket.blockedSince = blockedDays(flowData[ticket.id]);
	}
}

function blockedDays (ticket) {
	if(! ticket.blockedSince()){
		return "";
	}
	return timeUtil.highlightTime(timeUtil.daysSince(ticket.blockedSince()),7);
}

function daysInColumn (flowData,ticketId,laneName) {
	return timeUtil.highlightTime(timeUtil.daysSince(flowData.getEnterMilliseconds(ticketId,laneName)),14);
}

function daysOnBoard (flowData,ticketId) {
	return timeUtil.highlightTime(timeUtil.daysSince(flowData[ticketId].enteredBoard()),40);
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
			$scope.dataSize = "Data size = " +parseInt( boardData.size()/1024) +"KB";
			$scope.board = boardData.board;
			$scope.showSnapshot = false;
			$scope.showFlowDataGrid = false;
			$scope.showFlowReport = false;	
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
			};
			$scope.snapshotAction();
			$scope.exportRawData = function (){
				downloadAsJson(boardData,"boardSnapshot");
			};

			$scope.deleteDataAction = function(){
				var answer = window.confirm("You are about to delete all flow data collected for "+ $scope.board + " this data is not recoverable");
				if(answer){
					chrome.runtime.sendMessage({type : "delete-flow-data",
												board : $scope.board}
											);
					location.reload();
				}
			};

			$scope.$apply();
			function loadFlowReportData(){
				$scope.flowReport = buildFlowReport(boardData.flowData);
				$scope.flowReport.shift();
				
				
				$scope.flowReportAction = function (){
					
						$scope.exportAsJson = function(){
							downloadAsJson($scope.flowReport,"flowReport")
						};
						$scope.exportAsCsv = function(){
							downloadAsCSV($scope.flowReport,"flowReport")
						};
						
						$scope.showSnapshot = false;
						$scope.showFlowDataGrid = false;
						$scope.showFlowReport = true;
						//$scope.$apply();
				};
				$scope.$apply();
			}

			function loadFlowDataGridData(){
				$scope.flowDataGrid = new FlowDataGrid(boardData);
				$scope.flowDataGridAction = function (){
						
							$scope.exportAsJson = function(){
							//downloadAsJson(new FlowDataGrid(boardData.flowData, boardData.getLaneHeaders()),"flowDataGrid");
							downloadAsJson($scope.flowDataGrid,"flowDataGrid");
						};
						$scope.exportAsCsv = function(){
							//downloadAsCSV(new FlowDataGrid(boardData.flowData, boardData.getLaneHeaders()),"flowDataGrid");
							downloadAsCSV($scope.flowDataGrid,"flowDataGrid");
						};
						
						
						$scope.showSnapshot = false;
						$scope.showFlowDataGrid = true;
						$scope.showFlowReport = false;
						//$scope.$apply();
				};
				
				$scope.$apply();
			} 
			setTimeout(loadFlowDataGridData,500);
			setTimeout(loadFlowReportData,1500);	
			
		});

	} 
  	fetchFlowData();

 });
