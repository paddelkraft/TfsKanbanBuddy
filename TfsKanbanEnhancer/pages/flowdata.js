
	

	function bulidFlowDataGrid(flowData , lanes){
		var columnsInRow = 2*lanes.length + 2;
		var columnIndexes = getLaneIndexes(lanes);
		var grid = [];
		var row = new Array(columnsInRow);
		for(var columnName in columnIndexes){
			row[columnIndexes[columnName]] = columnName;
		}
		grid.push(row);
		row = new Array(columnsInRow);
		row[0] = "TFS Id";
		row[1] = "Title";
		for(var columnName in columnIndexes){
			row[columnIndexes[columnName]] = "First";
			row[columnIndexes[columnName] +1] = "Last";
		}
		grid.push(row);
		for (var id in flowData){
			row = new Array(columnsInRow);
			var flowTicket = flowData[id];
			row[0]=  flowTicket.id;
			row[1] =  flowTicket.title;
			for(var laneName in flowTicket.lanes){
				var lane = flowTicket.lanes[laneName]
				row[columnIndexes[laneName]] = lane.enter;
				row[columnIndexes[laneName]+1] = lane.exit;
				 
			} 
			grid.push(row);
		}
		return grid;
		
	}

	function buildFlowReport(flowData){
		var flowReport = [];
		var row = ["Id", "Flow report", "first" , "last"];
		flowReport.push(row);
		for (var id in flowData){
			var flowTicket = flowData[id];
			if(flowTicket.id){
				flowReport.push( [ flowTicket.id,flowTicket.title,"",""]);
				flowReport.push( [ flowTicket.id,flowTicket.url , "",""]);
				for(var laneName in flowTicket.lanes){
					var lane = flowTicket.lanes[laneName];
					flowReport.push( [ flowTicket.id, laneName, lane.enter, lane.exit] );
				} 
				flowReport.push( ["","","",""] );
			}
		}
		
		return flowReport;
	}


	function buildSnapshot(snapshot, flowData){
		var snapshotDiv = document.createElement("div");
		for(laneIndex in snapshot.lanes){				
			var laneDiv = buildSnapshotColumn(snapshot,flowData,laneIndex)
			snapshotDiv.appendChild(laneDiv);
		} 	
		return snapshotDiv;
	}

	function buildSnapshotColumn(snapshot, flowData,laneIndex){
		var laneDiv =document.createElement("div");
		var lane = snapshot.lanes[laneIndex];
		var laneHeader = document.createElement("h2");
		laneHeader.textContent = lane.name;
		laneDiv.appendChild(laneHeader);
		var laneGrid = [];
		laneGrid.push(["Id","title","days in lane","days on board"]);
		for(var i = 0 ; i < lane.tickets.length ; i++ ){
			var ticket = lane.tickets[i];
			laneGrid.push(["<a href='"+ ticket.url +"'>" + ticket.id +"</a>", ticket.title,daysInColumn(flowData,ticket.id,lane.name),daysOnBoard(flowData,ticket.id,lane.name)]);
		}
		if (laneGrid.length == 1){				
			laneGrid = [["Lane is empty"]];
		}
		var dataTable = createDataTable(laneGrid);
		dataTable.setAttribute("class","presentationTable");
		laneDiv.appendChild(dataTable);
		return laneDiv;
	}


    function daysInColumn (flowData,ticketId,laneName) {
		return highlightTime(daysSince(flowData.getEnterMilliseconds(ticketId,laneName)));
    }

    function daysOnBoard (flowData,ticketId,laneName) {	
		return highlightTime(daysSince(getEnterBoardMilliseconds(flowData,ticketId)));
    }
	
	function getEnterBoardMilliseconds (flowData,ticketId) {
		var enterMilliseconds = new Date();
		
		for (var id in flowData){
			var flowTicket = flowData[id];
			if(flowTicket.id = ticketId) {
				for(var laneName in flowTicket.lanes){
					var lane = flowTicket.lanes[laneName];
					if(lane.enter<enterMilliseconds){
						enterMilliseconds = lane.enter
					}
				} 
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
		for(var lane = 0; lane<lanes.length; lane++){
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
		document.getElementById("csv").onclick = function(){ table2csv("FlowReport")};
		document.getElementById("json").onclick = function(){
			downloadAsJson(flowData,"FlowReport");
		};
		var flowReportTable = createDataTable(flowReport);
    	flowReportTable.setAttribute("class","presentationTable");
		
    	setTableContainerContent(flowReportTable);

	}

    function presentFlowDataGrid(flowData , lanes){
    	
		var flowDataGrid = bulidFlowDataGrid(flowData,lanes);
		createHandsOnTable(flowDataGrid,"flowDataTable");
		document.getElementById("csv").onclick = function(){ table2csv("FlowDataGrid")};
		document.getElementById("json").addEventListener("click", function (a){
			downloadAsJson(flowDataGrid,"FlowDataGrid");
		});
    }

    function presentBoardSnapshot(snapshots,flowData){
    	var snapshot = snapshots[snapshots.length-1];
    	var snapshotPresentation = buildSnapshot(snapshot,flowData);
    	console.log("Present Board snapshot");
    	setColumnWidths(snapshotPresentation,["80px","","150px"]);
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
			document.getElementById("snapshot").onclick= function(){presentBoardSnapshot(boardData.snapshots,boardData.flowData)};
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
			presentBoardSnapshot(boardData.snapshots,boardData.flowData);
		})
	}

setup();