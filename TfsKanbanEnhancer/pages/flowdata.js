	
	
	var flowDataGrid
	
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
						flowTicket.lanes[lane.name].exit = snapshot.time;
					}else{
						flowTicket.lanes[lane.name].exit = snapshot.time;
					}

				}
			} 
		}
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
		flowDataGrid = grid;
		
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
		document.getElementById("csv").onclick = function(){ table2csv("FlowReport")};
		document.getElementById("json").onclick = function(){
				downloadAsJson(flowData,"FlowReport");
			};
		createHandsOnTable(flowReport,"flowReportTable");
		
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



	function showFlowData(board){
		var message = {type:"get-flow-data"};
		if(board){
			message.board = board;
		}
		chrome.runtime.sendMessage({type:"get-flow-data"}, function(response){
			var flowBoard = getBoard(response);
			var lanes = getLaneHeaders(response);
			console.log("Lanes = " + jsonEncode(lanes));
			var flowData = getFlowData(response);
			bulidFlowDataGrid(flowData,lanes);
			createHandsOnTable(flowDataGrid,"flowDataTable");
			document.getElementById("update").onclick = function(){showFlowData(flowBoard);};
			document.getElementById("csv").onclick = function(){ table2csv("FlowDataGrid")};
			document.getElementById("json").addEventListener("click", function (a){
				downloadAsJson(flowDataGrid,"FlowDataGrid");
			});
			document.getElementById("flowReport").onclick = function(){buildFlowReport(flowData);};
		})
	}

showFlowData();