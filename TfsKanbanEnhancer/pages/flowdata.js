	
	
	
	function getBoard(response){
		return response.board;
	}

	function newLaneNode(name ){
		var header = {};
		header.name = name;
		header.next = null;
		header.find = function(find){
			if(this.name == find){
				return this
			}
			else if(!this.next){
				return null;
			}else{
				return this.next.find(find);
			}
		};

		header.insert = function(node){
			var tempNext = null
			if(!this.next){
				this.next = node;
			}else{
				node.next = this.next;
				this.next = node;
			}
		};

		header.toArray = function(){
			var array = null;
			if(!this.next){
				array = [];
				array.push(this.name) 
				return array;
			}else{
				array = this.next.toArray();
				if(this.name){
					array.push(this.name);
				}
				return array;
			}
		};

		return header;
	}

	function getLaneHeaders(response){
		var lanes = newLaneNode("");
		var lanesArray = [];
		var lastAdded
		var index, laneIndex ;
		for(index in response.snapshots){
			var snapshot = response.snapshots[index];
			var lastCheckedNode = lanes;
			for(laneIndex in snapshot.lanes){
				if(!lanes.find(snapshot.lanes[laneIndex].name)){
					var laneToInsert = newLaneNode(snapshot.lanes[laneIndex].name)
					lastCheckedNode.insert(laneToInsert);
				}
				lastCheckedNode = lanes.find(snapshot.lanes[laneIndex].name)
			} 
		}

		return lanes.toArray().reverse() ;
	}

	

	function getFlowData(response){
		var flowData = {};
		var index, laneIndex ;
		for(index in response.snapshots){
			var snapshot = response.snapshots[index];
			for(laneIndex in snapshot.lanes){
				var lane = snapshot.lanes[laneIndex];
				//console.log("Lane = "+lane.name);
				//console.log("lane.tickets.length = "+ lane.tickets.length );
				for(var i = 0 ; i < lane.tickets.length ; i++ ){
					var ticket = lane.tickets[i];
					var flowTicket;
					if(!flowData[ticket.id]){
						flowData[ticket.id]= {};
					}
					flowTicket = flowData[ticket.id];
					flowTicket.title = ticket.title;
					flowTicket.url = ticket.url
					flowTicket.id = ticket.id;
					if(!flowTicket.lanes){
						flowTicket.lanes = {};
					}
					if(!flowTicket.lanes[lane.name]){
						flowTicket.lanes[lane.name]={};
						flowTicket.lanes[lane.name].enter = snapshot.time;
						flowTicket.lanes[lane.name].enterMilliseconds = snapshot.milliseconds;
						
					}

					flowTicket.lanes[lane.name].exit = snapshot.time;
					flowTicket.lanes[lane.name].exitMilliseconds = snapshot.milliseconds;

				}
			} 
		}
		flowData.getEnterDate = function (id,lane){
			return this[id].lanes[lane].enter
		};

		flowData.getEnterMilliseconds = function (id,lane){
			return this[id].lanes[lane].enterMilliseconds;
		};
		return flowData;
	}

	function presentFlowData(flowData){
		var flowReport = "";
		for (var id in flowData){
			var flowTicket = flowData[id];
			flowReport += "<a href='"  + flowTicket.url + "'>" + flowTicket.id + "</a><strong> "+ flowTicket.title +"</strong> <br>"
			for(var laneName in flowTicket.lanes){
				var lane = flowTicket.lanes[laneName]
				flowReport += "    " + laneName + ": first = " + lane.enter + ", last = " + lane.exit + "<br>"
			} 
			flowReport += "<hr>";
		}

		document.getElementById("flowdata").innerHTML = flowReport; 
	}

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
			flowReport.push( [ flowTicket.id,flowTicket.title,"",""]);
			flowReport.push( [ flowTicket.id,flowTicket.url , "",""]);
			for(var laneName in flowTicket.lanes){
				var lane = flowTicket.lanes[laneName];
				flowReport.push( [ flowTicket.id, laneName, lane.enter, lane.exit] );
			} 
			flowReport.push( ["","","",""] );
		}
		
		return flowReport;
		
		
	}

	function daysSince(date){
		var day = 86400000;
		var now = new Date();
		return Math.floor((now-date)/day);
	}

	function highlightTime(days){
		if(days<2){
			return "new";
		}

		return days;
	}

	function buildSnapshot(snapshot, flowData){
		
		var snapshotDiv = document.createElement("div");

			for(laneIndex in snapshot.lanes){
				var laneDiv =document.createElement("div");
				snapshotDiv.appendChild(laneDiv);
				
				var lane = snapshot.lanes[laneIndex];
				var laneHeader = document.createElement("h2");
				laneHeader.textContent = lane.name;
				laneDiv.appendChild(laneHeader);
				var laneGrid = [];
				laneGrid.push(["Id","title","days in lane"]);
				for(var i = 0 ; i < lane.tickets.length ; i++ ){
					var ticket = lane.tickets[i];
					laneGrid.push(["<a href='"+ ticket.url +"'>" + ticket.id +"</a>", ticket.title, ,highlightTime(daysSince(flowData.getEnterMilliseconds(ticket.id,lane.name)))]);
				}
				if (laneGrid.length == 1){
					
					laneGrid = [["Lane is empty"]];
				}
				var dataTable = createDataTable(laneGrid);
				dataTable.setAttribute("class","presentationTable");
				laneDiv.appendChild(dataTable);
			} 
		
		return snapshotDiv;
	}

	

	function getLaneIndexes(lanes){
		var indexes = {};
		for(var lane = 0; lane<lanes.length; lane++){
			indexes[lanes[lane]] = 2*lane +2;
		}
		return indexes;
	}


	function setTableData(data , tableId){
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
    	var tableContainer = $("#tableContainer");
    	tableContainer.empty();
    	tableContainer.append(tableDiv);
    	setTableData(data,tableId);
    }

    function presentFlowReport(flowData){
		var flowReport = buildFlowReport(flowData)
		document.getElementById("csv").onclick = function(){ table2csv("FlowReport")};
		document.getElementById("json").onclick = function(){
			downloadAsJson(flowData,"FlowReport");
		};
		//createHandsOnTable(flowReport,"flowReportTable");
		var flowReportTable = createDataTable(flowReport);
    	flowReportTable.setAttribute("class","presentationTable");
		
    	var tableContainer = $("#tableContainer");
    	//setColumnWidths(snapshotPresentation,["80px","","150px"])
    	tableContainer.empty();
    	tableContainer.append(flowReportTable);

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
    	var tableContainer = $("#tableContainer");
    	setColumnWidths(snapshotPresentation,["80px","","150px"])
    	tableContainer.empty();
    	tableContainer.append(snapshotPresentation);
    	//createHandsOnTable(snapshotPresentation, "snapshotTable")
    	document.getElementById("csv").onclick = function(){alert("No csv downoload of snapshot")};
		document.getElementById("json").addEventListener("click", function (a){
			downloadAsJson(snapshot,"BoardSnapshot");
		});

    }

	function setup(board){
		var message = {type:"get-flow-data"};
		if(board){
			message.board = board;
		}
		chrome.runtime.sendMessage({type:"get-flow-data"}, function(response){
			var flowBoard = getBoard(response);
			var flowData = getFlowData(response);
			var lanes = getLaneHeaders(response);
			document.getElementById("snapshot").onclick= function(){presentBoardSnapshot(response.snapshots,flowData)};
			document.getElementById("flowDataGrid").onclick = function(){presentFlowDataGrid(flowData,lanes);};
			document.getElementById("flowReport").onclick = function(){presentFlowReport(flowData);};
			document.getElementById("rawDataJson").onclick = function(){ 
				downloadAsJson(response, "TfsFlowRawData");
			};
			document.getElementById("board").innerHTML = "Data collected from " + flowBoard;
			presentBoardSnapshot(response.snapshots,flowData);
		})
	}

setup();