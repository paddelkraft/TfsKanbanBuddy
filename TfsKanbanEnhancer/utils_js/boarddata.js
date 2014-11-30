function log(msg){
    console.log ("BoardData | "+ msg);
}

function BoardData(data){
    if(!data){
        data = {};
    }
    this.ver="0.4.5";
    this.board = (data.board)?data.board:null;
    this.storageKey = "snapshots_" + this.board;
    this.genericItemUrl = (data.genericItemUrl)? data.genericItemUrl:"";
    this.snapshots = (data.snapshots) ? SnapshotsConstructor(data.snapshots) : [];//remove in later version
    this.boardDesignHistory = (data.boardDesignHistory)? new BoardDesignHistory(data.boardDesignHistory):
                                                        createBoardDesignHistoryFromSnapshots(this.snapshots);//remove when snapshot is removed
                                                        //BoardDesignHistoryConstructor(); //uncomment when snapshot is removed
    this.flowData = (data.flowData) ? new FlowData(data.flowData,this.genericItemUrl) : new FlowData() ;
    
    //functions

   
    this.addSnapshot = function(snapshot){
        snapshot = new SnapshotConstructor(snapshot);
        this.flowData.addSnapshot(snapshot);
        this.genericItemUrl = snapshot.genericItemUrl;
        this.board = snapshot.board;
        console.log("genericItemUrl " + this.genericItemUrl);
        this.boardDesignHistory.reportBoardDesign(snapshot.getBoardDesign(),snapshot.milliseconds);
        
    };


    this.getLatestSnapshot = function(){
        return this.getSnapshot(this.boardDesignHistory.getLatestBoardObservationTime());
    };

    this.getSnapshots = function(){
        var boardObservationTimes = this.boardDesignHistory.getBoardObservationTimes();
        var snapshots = [];
        var observationIndex;
        for(observationIndex in boardObservationTimes){
            snapshots.push(this.getSnapshot(boardObservationTimes[observationIndex]));
        }
        return snapshots;
    };


    this.getBoardState = function(milliseconds){
        var boardDesignRecord = this.findBoardDesignRecord(milliseconds);
        var boardState = boardDesignRecord.getBoardDesignForSnapshot();
        for(var index in boardState){
            var lane = boardState[index].name;
            var tickets = this.flowData.getTicketsInLane(lane,milliseconds);
            boardState[index].tickets = tickets;
            if(boardState[index].wip){
                boardState[index].wip.current = "";
            }
            if(boardState[index].wip && boardState[index].wip.limit!=="0" ){
                boardState[index].wip.current = (!isNaN(tickets.length))? tickets.length: "";
            }else if (boardState[index-1] && boardState[index-1].wip){
                boardState[index-1].wip.current += (!isNaN(tickets.length))? tickets.length: "";
            }

        }
        return boardState;
    };

    this.getSnapshot = function(milliseconds){
        var snapshot = {};
        if( this.findBoardDesignRecord(milliseconds)!=null){
           snapshot.milliseconds = milliseconds;
            snapshot.board = this.board;
            snapshot.genericItemUrl = this.genericItemUrl;
            snapshot.lanes = this.getBoardState(milliseconds);
        }
        
        return SnapshotConstructor(snapshot);
    };

    this.findBoardDesignRecord = function(milliseconds){
        var designRecordIndex;
        var boardDesignRecord = null;
        var seenIndex;
        for(designRecordIndex in this.boardDesignHistory.boardDesignRecords){
            boardDesignRecord = this.boardDesignHistory.boardDesignRecords[designRecordIndex];
            if(boardDesignRecord.firstSeen()<= milliseconds && boardDesignRecord.lastSeen()>= milliseconds){
                for(seenIndex in boardDesignRecord.seen){
                    if (boardDesignRecord.seen[seenIndex]===milliseconds){
                        return boardDesignRecord;
                    }
                }
                
            }
        }
        return null;
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
                array.push(this.name);
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
            flowItem.lanes[laneIndex].enter = readableTime(flowItem.lanes[laneIndex].enterMilliseconds);
            flowItem.lanes[laneIndex].exit = readableTime(flowItem.lanes[laneIndex].exitMilliseconds);
            
        }

        flowItem.merge = function(mergeItem){
            for(var lane in mergeItem.lanes){
                if(!this.lanes[lane]){
                    this.lanes[lane]= mergeItem.lanes[lane];
                }else{
                    if(this.lanes[lane].enterMilliseconds>mergeItem.lanes[lane].enterMilliseconds){
                        this.lanes[lane].enterMilliseconds=mergeItem.lanes[lane].enterMilliseconds;
                    }

                    if(this.lanes[lane].exitMilliseconds<mergeItem.lanes[lane].exitMilliseconds){
                        this.lanes[lane].exitMilliseconds=mergeItem.lanes[lane].exitMilliseconds;
                    }
                }
            }
        };
        
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
                var snapshotTicket = {
                    "id" : ticket.id,
                    "title" : ticket.title
                };
                tickets.push(snapshotTicket);
            }
        }
        return tickets;
    };

    this.merge = function(flowData){
        for(var id in flowData){
            if(!this[id]){
                this[id]=flowData[id];
            } else if(this[id].merge) {
                this[id].merge(flowData[id]);
            }
        }
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
                flowTicket = flowItemConstructor(this[ticket.id]);
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
            return timeFormat(milliseconds);
        };
    }

    if (flowData){
        for(var index in flowData){
            this[index] = flowItemConstructor(flowData[index],genericItemUrl);
        }
    }
}

function mergeBoardData(boardData,mergeData){
    var boardSnapshots = boardData.getSnapshots();
    var snapshotIndex;
    
    boardSnapshots = boardSnapshots.concat(mergeData.getSnapshots());
    function compare(a,b) {
          return  a.milliseconds - b.milliseconds;
    }
    boardSnapshots.sort(compare);
    boardData = new BoardData();
    for(snapshotIndex in boardSnapshots){
        boardData.addSnapshot(boardSnapshots[snapshotIndex]);
    }
    return boardData;
}

//TODO Remove this function when snapshpts is removed from boardData
//Function to migrate old data to new data format
function createBoardDesignHistoryFromSnapshots(snapshots){
    var boardDesignHistory = new BoardDesignHistory();
    for(var index in snapshots){
        boardDesignHistory.reportBoardDesign(snapshots[index].getBoardDesign(),snapshots[index].milliseconds);
    }
    return boardDesignHistory;
}



function BoardDesignHistory(boardDesignHistoryObject){
    if(!boardDesignHistoryObject){
        boardDesignHistoryObject = {};
        boardDesignHistoryObject.boardDesignRecords = [];
    }
    var boardDesignHistory = boardDesignHistoryObject;
    for (var index in boardDesignHistoryObject.boardDesignRecords){
        var boardDesignRecord = new BoardDesignRecord(boardDesignHistoryObject.boardDesignRecords[index]);
       boardDesignHistory.boardDesignRecords[index]= boardDesignRecord;
    }
    
    boardDesignHistory.reportBoardDesign = function(boardDesign,milliseconds){
        var numberOfRecords = this.boardDesignRecords.length;
        var boardDesignRecord
        if(numberOfRecords === 0){
            boardDesignRecord = new BoardDesignRecord(boardDesign,milliseconds);
            this.boardDesignRecords.push(boardDesignRecord);
        }else if(this.boardDesignRecords[numberOfRecords-1].equals(boardDesign) ){
            console.log("The boardDesign has not changed updating observation time");
            this.boardDesignRecords[numberOfRecords-1].designSeenAt(milliseconds);
        }else{
            console.log("The boardDesign has changed adding new design to history");
            boardDesignRecord = new BoardDesignRecord(boardDesign,milliseconds);
            this.boardDesignRecords.push(boardDesignRecord);
        }
    };

    boardDesignHistory.getBoardObservationTimes = function buildSnapshotsFromBoardData(boardData){
        var observations = [];
        var designRecordIndex = 0;
        var boardState;
        var boardDesignRecords = this.boardDesignRecords;
        var seenIndex = 0;
        for(designRecordIndex in boardDesignRecords){
            boardState = boardDesignRecords[designRecordIndex].boardDesign;
            for(seenIndex in boardDesignRecords[designRecordIndex].seen){
                observations.push(boardDesignRecords[designRecordIndex].seen[seenIndex]);
            }
        }
        return observations;
    };


    boardDesignHistory.getLatestBoardDesign = function(){
       return this.boardDesignRecords[this.boardDesignRecords.length -1].getBoardDesignForSnapshot();
    };

    

    boardDesignHistory.getLatestBoardObservationTime = function(){
        return this.boardDesignRecords[this.boardDesignRecords.length -1].lastSeen();
    };

    boardDesignHistory.getRecordForBoardDesign = function(design){
        for(var index in this.boardDesignRecords){
            if(this.boardDesignRecords[index].design == design){
                return this.boardDesignRecords[index];
            }
        }
        return null;
    };

    boardDesignHistory.sortByTime = function(){
        var records = this.boardDesignRecords;
        function compare(a,b) {
          if (a.firstSeen() < b.firstSeen())
             return -1;
          if (a.firstSeen() > b.firstSeen())
            return 1;
          return 0;
        }

        records.sort(compare);
        this.boardDesignRecords = records;
    };

    return boardDesignHistory;
}

function BoardDesignRecord(boardDesign, milliseconds){
    var boardDesignRecord = {};
    if(!milliseconds){
        boardDesignRecord = boardDesign;
        if(!boardDesignRecord.seen){ //Convert between intermediate formats this should be removed before releasing
            boardDesignRecord.seen =[];
            boardDesignRecord.seen.push(boardDesignRecord.firstSeen);
            boardDesignRecord.seen.push(boardDesignRecord.lastSeen);    
        }//end remove
    }else{
        boardDesignRecord.seen =[];

        boardDesignRecord.seen.push(milliseconds);
        boardDesignRecord.design = boardDesign;
    }

    boardDesignRecord.firstSeen = function(){return boardDesignRecord.seen[0];};
    boardDesignRecord.lastSeen =  function(){
        return boardDesignRecord.seen[boardDesignRecord.seen.length-1];
    };
    
    boardDesignRecord.equals = function(boardDesign){
        console.log("this.design = " + jsonEncode(this.design));
        console.log("boardDesign = " + jsonEncode(boardDesign));
        return jsonEncode(this.design) == jsonEncode(boardDesign);
    };

    boardDesignRecord.designSeenAt= function(milliseconds){
        boardDesignRecord.seen.push(milliseconds);
        boardDesignRecord.seen.sort();
    };

    boardDesignRecord.getBoardDesignForSnapshot = function(){
        var design = cloneObjectData(this.design);
        return design;
    };

    return boardDesignRecord;
}