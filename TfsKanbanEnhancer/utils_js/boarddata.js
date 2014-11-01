function log(msg){
    console.log ("BoardData | "+ msg);
}

function BoardData(data){
    if(!data){
        data = {};
    }
    this.ver="0.3.0";
    this.board = (data.board)?data.board:null;
    this.storageKey = "snapshots_" + this.board;
    this.genericItemUrl = (data.genericItemUrl)? data.genericItemUrl:"";
    this.snapshots = (data.snapshots) ? SnapshotsConstructor(data.snapshots) : [];//remove in later version
    this.boardDesignHistory = (data.boardDesignHistory)? BoardDesignHistoryConstructor(data.boardDesignHistory):
                                                        createBoardDesignHistoryFromSnapshots(this.snapshots);//remove when snapshot is removed
                                                        //BoardDesignHistoryConstructor(); //uncomment when snapshot is removed
    this.flowData = (data.flowData) ? new FlowData(data.flowData,this.genericItemUrl) : new FlowData() ;
    
    //functions

   
    this.addSnapshot = function(snapshot){
        snapshot = SnapshotConstructor(snapshot);
        this.flowData.addSnapshot(snapshot);
        this.genericItemUrl = snapshot.genericItemUrl;
        console.log("genericItemUrl " + this.genericItemUrl);
        this.boardDesignHistory.reportBoardDesign(snapshot.getBoardDesign(),snapshot.milliseconds);
        
    };

    this.getLatestBoardState = function(){
        //Hämta board design
        var boardState = this.boardDesignHistory.getLatestBoardDesign();
        var milliseconds = this.boardDesignHistory.getLatestBoardObservationTime();
        for(var index in boardState){
            var lane = boardState[index].name;
            var tickets = this.flowData.getTicketsInLane(lane,milliseconds);
            boardState[index].tickets = tickets;
            if(boardState[index].wip && boardState[index].wip.limit!=="" ){
                boardState[index].wip.current = tickets.length;
            }else if (boardState[index-1] && boardState[index-1].wip){
                boardState[index-1].wip.current += tickets.length;
            }
        }
        return boardState;
    };

    this.getLatestSnapshot = function(){
        snapshot = {};
        snapshot.milliseconds = this.boardDesignHistory.getLatestBoardObservationTime();
        snapshot.board = this.board;
        snapshot.genericItemUrl = this.genericItemUrl;
        snapshot.lanes = this.getLatestBoardState();
        return SnapshotConstructor(snapshot);
    };

    this.getLaneHeaders = function (){
        var lanes = newLaneNode("");
        var lanesArray = [];
        var lastAdded;
        var index, laneIndex ;
        for(index in this.boardDesignHistory.boardDesignRecords){
            var boardDesignRecord = this.boardDesignHistory.boardDesignRecords[index];
            var lastCheckedNode = lanes;
            for(laneIndex in boardDesignRecord.design){
                if(!lanes.find(boardDesignRecord.design[laneIndex].name)){
                    var laneToInsert = newLaneNode(boardDesignRecord.design[laneIndex].name);
                    lastCheckedNode.insert(laneToInsert);
                }
                lastCheckedNode = lanes.find(boardDesignRecord.design[laneIndex].name);
            }
        }
        return lanes.toArray().reverse() ;
    };

    //util
    function newLaneNode(name ){
        var header = {};
        header.name = name;
        header.next = null;
        header.find = function(find){
            if(this.name == find){
                return this;
            }
            else if(!this.next){
                return null;
            }else{
                return this.next.find(find);
            }
        };

        header.insert = function(node){
            var tempNext = null;
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

    this.size = function(){
        return jsonEncode(this).length * 2;
    };


    function SnapshotConstructor(snapshotDataObject){
        snapshot = snapshotDataObject;
        
        snapshot.getBoardDesign = function (){
            var boardLayout = [];
            var lane;
            for (var index in snapshot.lanes){
                 lane = {};
                lane.name = snapshot.lanes[index].name;
                if(snapshot.lanes[index].wip){
                    lane.wip = {"limit": snapshot.lanes[index].wip.limit};
                }
                
                boardLayout.push(lane);
            }
            return  boardLayout;

        };

        for (var lane in snapshot.lanes){
            for(var ticket in snapshot.lanes[lane].tickets){
                snapshot.lanes[lane].tickets[ticket].url = function(){
                    return snapshot.genericItemUrl+this.id;
                };

                snapshot.lanes[lane].tickets[ticket].time = function(){
                    return timestamp(this.milliseconds);
                };
            }
        }
        return snapshot;
    }

    function SnapshotsConstructor(snapshotsDataObject){
        var snapshots = snapshotsDataObject;
        for(var snapshot in snapshots){
            
            snapshots[snapshot] =  SnapshotConstructor(snapshots[snapshot]);
        }
        return snapshots;
    }

    this.snapshots = null;
    
}//BoardData



function FlowData(flowData, genericItemUrl){
    
    function flowItemConstructor(flowItemData, genericItemUrl){
        var flowItem = flowItemData;
        flowItem.url = function(){
            return genericItemUrl + this.id;
        };
        for(var laneIndex in flowItem.lanes){
            flowItem.lanes[laneIndex].enter = readableTime(flowItem.enterMilliseconds);
            flowItem.lanes[laneIndex].exit = readableTime(flowItem.exitMilliseconds);
        }
        return flowItem;
    }

    this.getEnterDate = function (id,lane){
        return this[id].lanes[lane].enter;
    };

    this.getEnterMilliseconds = function (id,lane){
        return this[id].lanes[lane].enterMilliseconds;
    };

    this.getEnterBoardMilliseconds = function (id,lane){
        //TODO New implementation, current implementation in flowdata
        return this[id].lanes[lane].enterMilliseconds;
    };

    this.getTicketsInLane = function (lane, time){
        var tickets = [];
        for(var id in this){
            var ticket = this[id];
            if(ticket.lanes && ticket.lanes[lane]&&
               time>=ticket.lanes[lane].enterMilliseconds &&
               time<=ticket.lanes[lane].exitMilliseconds){
                var snapshotTicket = {"title" : ticket.title,
                                      "id" : ticket.id};
                tickets.push(snapshotTicket);
            }
        }
        return tickets;
    };

     this.addSnapshot = function (snapshot){
        log("add snapdhot " + snapshot.time);
        var index, laneIndex ;
        for(laneIndex in snapshot.lanes){
            var lane = snapshot.lanes[laneIndex];
            //console.log("Lane = "+lane.name);
            //console.log("lane.tickets.length = "+ lane.tickets.length );
            for(var i = 0 ; i < lane.tickets.length ; i++ ){
                var ticket = lane.tickets[i];
                var flowTicket;
                if(!this[ticket.id]){
                    this[ticket.id]= {};
                }
                flowTicket = this[ticket.id];
                flowTicket.title = ticket.title;
                flowTicket.url = ticket.url;
                flowTicket.id = ticket.id;
                if(!flowTicket.lanes){
                    flowTicket.lanes = {};
                }
                if(!flowTicket.lanes[lane.name]){
                    flowTicket.lanes[lane.name]={};
                    flowTicket.lanes[lane.name].enterMilliseconds = snapshot.milliseconds;
                    flowTicket.lanes[lane.name].enter = readableTime(flowTicket.lanes[lane.name].enterMilliseconds);
                    
                }

                flowTicket.lanes[lane.name].exitMilliseconds = snapshot.milliseconds;
                flowTicket.lanes[lane.name].exit = readableTime(flowTicket.lanes[lane.name].exitMilliseconds);
                

            }
        }
        
    };

    function readableTime(milliseconds){
        return function(){
            return timestamp(milliseconds);
        };
    }

    if (flowData){
        for(var index in flowData){
            this[index] = flowItemConstructor(flowData[index],genericItemUrl);
        }
    }
}

//TODO Remove this function when snapshpts is removed from boardData
//Function to migrate old data to new data format
function createBoardDesignHistoryFromSnapshots(snapshots){
    var boardDesignHistory = BoardDesignHistoryConstructor();
    for(var index in snapshots){
        boardDesignHistory.reportBoardDesign(snapshots[index].getBoardDesign(),snapshots[index].milliseconds);
    }
    return boardDesignHistory;
}

function BoardDesignHistoryConstructor(boardDesignHistoryObject){
    if(!boardDesignHistoryObject){
        boardDesignHistoryObject = {};
        boardDesignHistoryObject.boardDesignRecords = [];
    }
    var boardDesignHistory = boardDesignHistoryObject;
    for (var index in boardDesignHistoryObject.boardDesignRecords){
        var boardDesignRecord = BoardDesignRecordConstructor(boardDesignHistoryObject.boardDesignRecords[index]);
       boardDesignHistory.boardDesignRecords[index]= boardDesignRecord;
    }
    
    boardDesignHistory.reportBoardDesign = function(boardDesign,milliseconds){
        var numberOfRecords = this.boardDesignRecords.length;
        if(numberOfRecords === 0){
            var boardDesignRecord = BoardDesignRecordConstructor(boardDesign,milliseconds);
            this.boardDesignRecords.push(boardDesignRecord);
        }else if(this.boardDesignRecords[numberOfRecords-1].equals(boardDesign) ){
            console.log("The boardDesign has not changed updating observation time");
            this.boardDesignRecords[numberOfRecords-1].designSeenAt(milliseconds);
        }else{
            console.log("The boardDesign has changed adding new design to history");
            var boardDesignRecord = BoardDesignRecordConstructor(boardDesign,milliseconds);
            this.boardDesignRecords.push(boardDesignRecord);
        }
        
    };

    boardDesignHistory.getLatestBoardDesign = function(){
        return this.boardDesignRecords[this.boardDesignRecords.length -1].getBoardDesignForSnapshot();
    };

    boardDesignHistory.getLatestBoardObservationTime = function(){
        return this.boardDesignRecords[this.boardDesignRecords.length -1].lastSeen;
    };

    return boardDesignHistory;
}

function BoardDesignRecordConstructor(boardDesign, milliseconds){
    var boardDesignRecord = {};
    if(!milliseconds){
        boardDesignRecord = boardDesign;
    }else{
        boardDesignRecord.firstSeen = milliseconds;
        boardDesignRecord.lastSeen =  milliseconds;
        boardDesignRecord.design = boardDesign;
    }
    
    boardDesignRecord.equals = function(boardDesign){
        console.log("this.design = " + jsonEncode(this.design));
        console.log("boardDesign = " + jsonEncode(boardDesign));
        return jsonEncode(this.design) == jsonEncode(boardDesign);
    };

    boardDesignRecord.designSeenAt= function(milliseconds){
        if (this.lastSeen<milliseconds){
            this.lastSeen = milliseconds;
        }

        if (this.firstSeen>milliseconds){
            this.firstSeen = milliseconds;
        }
    };

    boardDesignRecord.getBoardDesignForSnapshot = function(){
        var design = jsonDecode(jsonEncode(this.design));
        return design;
    };

    return boardDesignRecord;



}