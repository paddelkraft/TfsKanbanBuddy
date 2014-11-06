	

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
				lane = flowTicket.lanes[laneName]
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


	function buildSnapshot(snapshot, flowData){
		var snapshotDiv = document.createElement("div");
		var laneDiv
		for(var laneIndex in snapshot.lanes){			
			laneDiv = buildSnapshotColumn(snapshot,flowData,laneIndex);
			snapshotDiv.appendChild(laneDiv);
		} 	
		return snapshotDiv;
	}

	function buildSnapshotColumn(snapshot, flowData,laneIndex){
		var laneDiv =document.createElement("div");
		var lane = snapshot.lanes[laneIndex];
		var laneHeader = document.createElement("h2");
		var laneGrid = [];
		var ticket;
		var i;
		var dataTable;
		laneHeader.textContent = lane.name;
		laneDiv.appendChild(laneHeader);

		laneGrid.push(["Id","title","days in lane","days on board"]);
		for(i = 0 ; i < lane.tickets.length ; i++ ){
			ticket = lane.tickets[i];
			laneGrid.push(["<a href='"+ ticket.url() +"'>" + ticket.id +"</a>", ticket.title,daysInColumn(flowData,ticket.id,lane.name),daysOnBoard(flowData,ticket.id)]);
		}
		if (laneGrid.length == 1){				
			laneGrid = [["Lane is empty"]];
		}
		dataTable = createDataTable(laneGrid);
		dataTable.setAttribute("class","presentationTable");
		laneDiv.appendChild(dataTable);
		return laneDiv;
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
				enterMilliseconds = lane.enterMilliseconds
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


	function setHandsOnTableData(data , tableId){
   		$('#'+tableId).handsontable({
				data: data,
				minSpareRows: 1,
				colHeaders: true,
				contextMenu: false
  		});
    }

    function createHandsOnTable(data,tableId) {
    	var tableDiv = document.createElement("div");
    	tableDiv.setAttribute("id",tableId);
    	tableDiv.setAttribute("class", "handsontable")
    	setTableContainerContent(tableDiv);
    	setHandsOnTableData(data,tableId);
    }

    function setTableContainerContent(content){
    	var tableContainer = $("#tableContainer");
    	tableContainer.empty();
    	tableContainer.append(content);
    }

    function presentFlowReport(flowData){
		var flowReport = buildFlowReport(flowData)
		var flowReportTable;
		document.getElementById("csv").onclick = function(){ downloadAsCSV(jsonGridToCSV(flowReport),"FlowReport");};
		document.getElementById("json").onclick = function(){
			downloadAsJson(flowData,"FlowReport");
		};
		flowReportTable = createDataTable(flowReport);
   		flowReportTable.setAttribute("class","presentationTable");
		
    	setTableContainerContent(flowReportTable);

	}

    function presentFlowDataGrid(flowData , lanes){
		var flowDataGrid = new FlowDataGrid(flowData,lanes);
		createHandsOnTable(flowDataGrid,"flowDataTable");
		document.getElementById("csv").onclick = function(){ table2csv("FlowDataGrid")};
		document.getElementById("json").addEventListener("click", function (a){
			downloadAsJson(flowDataGrid,"FlowDataGrid");
		});
    }

    function presentBoardSnapshot(boardData){
		var snapshot = boardData.getLatestSnapshot();//snapshots[snapshots.length-1];
		var flowData = boardData.flowData;
		var snapshotPresentation = buildSnapshot(snapshot,flowData);
		console.log("Present Board snapshot");
		setColumnWidths(snapshotPresentation,["80px","","150px","150px"]);
		setTableContainerContent(snapshotPresentation);
		document.getElementById("csv").onclick = function(){alert("No csv downoload of snapshot")};
		document.getElementById("json").addEventListener("click", function (a){
			downloadAsJson(snapshot,"BoardSnapshot");
});

    }

	function setup(board){
		var message = {type:"get-flow-data"};
		message.board = decodeURIComponent(document.URL.split("?")[1]);
		console.log(message.board);
		//if(board){
		//	message.board = board;
		//}
		chrome.runtime.sendMessage(message, function(response){
			var boardData = new BoardData(response);
			var lanes = boardData.getLaneHeaders();
			document.getElementById("snapshot").onclick= function(){presentBoardSnapshot(boardData)};
			document.getElementById("flowDataGrid").onclick = function(){presentFlowDataGrid(boardData.flowData,lanes);};
			document.getElementById("flowReport").onclick = function(){presentFlowReport(boardData.flowData);};
			document.getElementById("rawDataJson").onclick = function(){ 
				downloadAsJson(response, "TfsFlowRawData");
			};
			document.getElementById("delete").onclick = function(){
				var answer = window.confirm("You are about to delete all flow data collected for "+ message.board + " this data is not recoverable");
				if(answer){
					chrome.runtime.sendMessage({type : "delete-flow-data",
												board : message.board}
											  );
					location.reload();
				}
			};
			document.getElementById("board").innerHTML = "Data collected from " + boardData.board;
			document.getElementById("dataSize").innerHTML = "Data size = " +parseInt( boardData.size()/1024) +"KB";
			presentBoardSnapshot(boardData);
		})
	}

setup();