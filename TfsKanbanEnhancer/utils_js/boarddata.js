function log(msg){
    console.log ("BoardData | "+ msg);
}

function BoardData(data){
    var self = this;
    if(!data){
        data = {};
    }
    
    if (data.ver === "0.4.5"){
        data = convertTo050(data);
    }
    self.ver="0.5.0";
    self.board = (data.board)?data.board:null;
    self.storageKey = "snapshots_" + self.board;
    self.genericItemUrl = (data.genericItemUrl)? data.genericItemUrl:"";
    self.snapshotRecords = (data.snapshotRecords) ? data.snapshotRecords : [];//remove in later version
    self.boardDesignHistory = (data.boardDesignHistory)? new BoardDesignHistory(data.boardDesignHistory):
                                                         new BoardDesignHistory();
    self.flowData = (data.flowData) ? new FlowData(data.flowData,self.genericItemUrl) : new FlowData() ;
    
    var blockedPrefix=null;
    //functions

    function updateSnapshotRecord(milliseconds){
        _.last(self.snapshotRecords).lastSeen=milliseconds;
    }

    function newSnapshotRecord(milliseconds){
        self.snapshotRecords.push({"firstSeen":milliseconds,"lastSeen":milliseconds});
    }

    

    

    self.boardHasNotChanged = function (snapshot){
        var latestSnapshot = self.getLatestSnapshot();
        return latestSnapshot && snapshot.equals(latestSnapshot);
    };
   
    function setBlocked (snapshot){
        _.forEach(snapshot.lanes,function(lane){
            _.forEach(lane.tickets,function(ticket){
                if(ticket.title.split(" ")[0]===blockedPrefix){
                    ticket.blocked = true;
                }
            });
        });
        return snapshot;
    }

    self.addSnapshot = function(snapshot){
        if(blockedPrefix){
            snapshot = setBlocked(snapshot);
        }
        snapshot = new Snapshot(snapshot);
        self.boardDesignHistory.reportBoardDesign(snapshot.getBoardDesign(),snapshot.milliseconds);
        if(self.boardHasNotChanged(snapshot)){
            console.log("Snapshot has not changed since last observation");
            updateSnapshotRecord(snapshot.milliseconds);
        }else{
            console.log("Snapshot has changed since last observation");
            newSnapshotRecord(snapshot.milliseconds);
        }
        self.flowData.addSnapshot(snapshot);
        self.genericItemUrl = snapshot.genericItemUrl;
        self.board = snapshot.board;
        //console.log("genericItemUrl " + self.genericItemUrl);
        
        
    };


    self.getLatestSnapshot = function(){
        if(self.snapshotRecords.length>0){
            return self.getSnapshot(_.last(self.snapshotRecords).lastSeen);
        }
        return null;
    };

    self.getSnapshots = function(){
        var boardObservationTimes = getBoardObservationTimes();
        var snapshots = [];
        var observationIndex;
        for(observationIndex in boardObservationTimes){
            snapshots.push(self.getSnapshot(boardObservationTimes[observationIndex]));
        }
        return snapshots;
    };

    function getBoardObservationTimes(){
        var boardObservationTimes = [];
        _.forEach(self.snapshotRecords,function(record){
            boardObservationTimes.push(record.firstSeen);
            if(record.firstSeen!==record.lastSeen){
                boardObservationTimes.push(record.lastSeen);
            }
        });
        return boardObservationTimes;
    }

    self.getBoardState = function(milliseconds){
        var boardDesignRecord = self.findBoardDesignRecord(milliseconds);
        var boardState = boardDesignRecord.getBoardDesignForSnapshot();
        for(var index in boardState){
            var lane = boardState[index].name;
            var tickets = self.flowData.getTicketsInLane(lane,milliseconds);
            boardState[index].tickets = tickets;
        }
        return boardState;
    };

    self.getSnapshot = function(milliseconds){
        var snapshot = {};
        if( self.findBoardDesignRecord(milliseconds)!==null){
           snapshot.milliseconds = milliseconds;
            snapshot.board = self.board;
            snapshot.genericItemUrl = self.genericItemUrl;
            snapshot.lanes = self.getBoardState(milliseconds);
        }
        return new Snapshot(snapshot);
    };

    self.findBoardDesignRecord = function(milliseconds){
        var designRecordIndex;
        var snapshotTime;
        var boardDesign = null;
        _.forEach(self.snapshotRecords,function (record){
            if(record.firstSeen <= milliseconds && record.lastSeen>=milliseconds){
                snapshotTime = milliseconds;
                return false;
            }
        });
        _.forEach(self.boardDesignHistory.boardDesignRecords, function (boardDesignRecord){
            if(boardDesignRecord.firstSeen<= snapshotTime && boardDesignRecord.lastSeen>= snapshotTime){
                boardDesign = boardDesignRecord;
                return false;
            }
        });
        
        return boardDesign;
    };


    

    self.getLaneHeaders = function (){
        var lanes = newLaneNode("");
        var lanesArray = [];
        var lastAdded;
        var index, laneIndex ;
        for(index in self.boardDesignHistory.boardDesignRecords){
            var boardDesignRecord = self.boardDesignHistory.boardDesignRecords[index];
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

    self.size = function(){
        return jsonEncode(self).length * 2;
    };

    self.setBlockedPrefix = function (prefix){
        blockedPrefix = prefix;
    }

    
}//BoardData


function Snapshot(snapshot){
    var self = this;
    self.board =  snapshot.board;
    self.milliseconds = snapshot.milliseconds;
    self.genericItemUrl = snapshot.genericItemUrl;
    self.lanes = [];
    _.forEach(snapshot.lanes,function(lane){
        self.lanes.push( new SnapshotLane(snapshot.genericItemUrl,lane));
    });
    self.lanes = fixWip(self.lanes);

    function fixWip(lanes){
        var current = 0;
        for(var index in lanes){
            var tickets = lanes[index].tickets;
            
            if(lanes[index].wip){
               // console.log("limit = "+lanes[index].wip.limit);
                if( lanes[index].wip.limit===0){
                    current =lanes[index].wip.current;
                    
                    if (lanes[index-1] && lanes[index-1].wip && lanes[index-1].wip.limit>0){
                        lanes[index-1].wip.current += current;
                        lanes[index].wip.current = 0;
                    }
                }
            }
            
        }
        return lanes;

    }


    
    self.getBoardDesign = function (){
        var boardLayout = [];
        var lane;
        _.forEach (self.lanes,function(item){
             lane = {};
            lane.name = item.name;
            if(item.wip){
                lane.wip = {"limit": item.wip.limit};
            }
            boardLayout.push(lane);
        });
        return  boardLayout;
    };

    /*self.getLaneNames =function(){
        var laneNames = [];
        _.forEach(self.lanes,function(lane){
            laneNames.push(lane.name );
        });
        console.log("laneNames = "+ jsonEncode(laneNames));
        return laneNames;
    };*/

    self.getLaneNames = function (){
        var lanes = [];
        _.forEach(self.lanes,function (lane){
            var wip;
            if(!lane.wip){
                wip = 0;
            }else if(lane.wip.limit ===""){
                lane.wip.limit = 0;
                wip = 0;
            }else{
                wip = parseInt(lane.wip.limit);
            }
            lanes.push(lane.name + "("+wip+")");
        });
       // console.log("laneNames = "+ jsonEncode(lanes));
        return lanes;
    }

    self.equals = function(comp){
        
        var isEqual = arraysAreIdentical(self.getLaneNames() , comp.getLaneNames());
        var laneIndex;
        if(!isEqual){
            console.log("Snapshot.equals | BoardDesigns is not identical");
        }
        if(isEqual){

            for(laneIndex in self.lanes){
                isEqual = self.lanes[laneIndex].equals(comp.lanes[laneIndex]);
                if(!isEqual){
                    console.log("Snapshot.equals | lane " +self.lanes[laneIndex].name + " has changed");
                    return isEqual;
                }
            }

        }
        return isEqual;
    };


    return self;
}

function SnapshotLane (genericItemUrl,lane){
    
    var self = this;
    self.name = lane.name;
    if(lane.wip){
        if(lane.wip.limit === ""){
            lane.wip.limit = 0;
        }
        self.wip = {"limit":parseInt(lane.wip.limit), "current" : 0};
    }
    self.tickets = [];
    _.forEach(lane.tickets,function(ticket){
        self.tickets.push(new SnapshotTicket(genericItemUrl,ticket));
        if(lane.wip){
            self.wip.current++;
        }
    });


    self.equals = function(comp){
        var same = true;
        if(comp.tickets.length != self.tickets.length){
            return false;
        }
        var selfTickets = _.sortBy(self.tickets,function(ticket){return ticket.id;});
        var compTickets = _.sortBy(comp.tickets,function(ticket){return ticket.id;});
        var i ;
        for (i in selfTickets){
            same = selfTickets[i].equals(compTickets[i]);
            if(!same){
                console.log ("SnapshotLine | tickets not identical \n" +jsonEncode(selfTickets[i])+"\n!=\n"+ jsonEncode(compTickets[i]));
                return same;
            }
        }
        return same;
    };

    return self;
}

function SnapshotTicket(genericItemUrl,data){
    var self = this;
    self.id = data.id;
    self.title = data.title;
    if (data.blocked){
        self.blocked = data.blocked;
    }
    self.url = function(){
        return snapshot.genericItemUrl+self.id;
    };

    self.equals = function(comp){
        var same = true;
        if(!(self.id === comp.id && self.title === comp.title)){
            return false;
        } 
        
        return(self.blocked === comp.blocked);
    };
    return self;
}



function FlowData(flowData, genericItemUrl){
    var self = this;


    self.getEnterMilliseconds = function (id,lane){
        return self[id].lanes[lane][0].firstSeen;
    };

    
    self.getTicketsInLane = function (lane, time){
        var tickets = [];
        for(var id in self){
            var ticket = self[id];
            if(ticket.lanes && ticket.lanes[lane]&&
               (lane===ticket.wasInLane(time))){
                var snapshotTicket = {
                    "id" : ticket.id,
                    "title" : ticket.title,
                };
                
                if(ticket.wasBlocked(time)===true){
                    snapshotTicket.blocked = true;
                }
                tickets.push(snapshotTicket);
            }
        }
        return tickets;
    };

    self.merge = function(flowData){
        for(var id in flowData){
            if(!self[id]){
                self[id]=flowData[id];
            } else if(self[id].merge) {
                self[id].merge(flowData[id]);
            }
        }
    };

    
    function createOrUpdateFlowTicket (ticket,lane,snapshot){
        var flowTicket;
        
        if(!self[ticket.id]){
            self[ticket.id]= {"id":ticket.id};
        }
        flowTicket = new FlowTicket(self[ticket.id], snapshot.genericItemUrl);
        flowTicket.id = ticket.id;
        flowTicket.title = ticket.title;
        flowTicket.setBlockStatus(ticket,snapshot.milliseconds);
        flowTicket.setLane(lane.name,snapshot.milliseconds);
        self[ticket.id]=flowTicket;
        return flowTicket;
    };

    self.addSnapshot = function (snapshot){
        log("add snapshot millisecond = " + snapshot.milliseconds);
        var index, laneIndex ;
        for(laneIndex in snapshot.lanes){
            var lane = snapshot.lanes[laneIndex];
            //console.log("Lane = "+lane.name);
            //console.log("lane.tickets.length = "+ lane.tickets.length );
            for(var i = 0 ; i < lane.tickets.length ; i++ ){
                var ticket = lane.tickets[i];
                
                self[ticket.id] = createOrUpdateFlowTicket(ticket,lane, snapshot);
            }
        }
        
    };

    

    if (flowData){
        for(var index in flowData){
            self[index] = new FlowTicket(flowData[index],genericItemUrl);
        }
    }
    return self;
}

function FlowTicket(flowItemData, genericItemUrl){
    var self = this;
    self.title = (flowItemData.title)? flowItemData.title : null;
    self.id = (flowItemData.id)? flowItemData.id : null;
    self.lanes = (flowItemData.lanes) ? flowItemData.lanes : {};
    self.isBlocked = (flowItemData.isBlocked)? flowItemData.isBlocked : false;
    self.blockedRecords = (flowItemData.blockedRecords)?flowItemData.blockedRecords:[];
    self.inLane = (flowItemData.inLane)? flowItemData.inLane : null;
    //internal util functions
    function addEnterAndExitFunctions(item){
        item.enter = function(){
            return timeUtil.dateFormat(item.firstSeen);
        };
        item.exit = function(){
            return timeUtil.dateFormat(item.lastSeen);
        };
        return item;
    }

    //
    function createLaneRecord(laneName,milliseconds){
        var laneRecord={};
        console.log("ID = " + this.id +" Create lane record for lane "+laneName);
        laneRecord.firstSeen = milliseconds;
        laneRecord.lastSeen = milliseconds;
        laneRecord.name = laneName;
        laneRecord = addEnterAndExitFunctions(laneRecord);
        return laneRecord;
    }

    _.forEach(self.lanes ,function(laneRecords){
        _.forEach(laneRecords,function(laneRecord){
            addEnterAndExitFunctions(laneRecord);
        });
    });
    
    

    self.url = function(){
        return genericItemUrl + self.id;
    };

    self.enteredBoard = function () {
        var firstSeen = timeUtil.now();
        var laneName;
        var lane;
        for(laneName in self.lanes){
            lane = self.lanes[laneName][0];
            
            if(lane.firstSeen<firstSeen){
                firstSeen = lane.firstSeen;
            }
        }
        return firstSeen;
    };

    self.setLane = function(laneName,milliseconds){
        console.log("Set lane lane for ticket " + self.id +" = " + laneName);
        if(self.inLane!==laneName){
          self.addLaneIfMissing(laneName);
          self.lanes[laneName].push(createLaneRecord(laneName,milliseconds));
          console.log("After createLaneRecord "+ laneName + " has " + self.lanes[laneName].length + " records");
        }
        _.last(self.lanes[laneName]).lastSeen = milliseconds;
        self.inLane = laneName;
    };

    self.wasInLane = function(milliseconds){
        var inLane=null;
        _.forEach(self.lanes, function(lane){
            if(inLane!==null){
                return false;
            }
            _.forEach(lane,function(laneRecord){
                if(laneRecord.lastSeen >= milliseconds && milliseconds>= laneRecord.firstSeen){
                    inLane = laneRecord.name;
                    return false;
                }
            });
            
        });
        return inLane;
    };

    self.addLaneIfMissing = function (laneName){
        if(!self.lanes[laneName]){
            console.log("Creating lane record for "+ laneName);
            self.lanes[laneName]=[];
        }
        console.log("lane record added " + jsonEncode(self));
    };

    self.getCurrentLaneRecord = function (){
        return self.lanes[self.inLane][self.lanes[self.inLane].length-1];
    };

    self.getTotalTimeInLane = function(laneName){
        var timeInLane = 0;
        _.forEach(self.lanes[laneName],function(item){
            timeInLane += item.lastSeen - item.firstSeen;
        });
        return timeInLane;
    };

    self.setBlockStatus = function (snapshotTicket, milliseconds){
        if(snapshotTicket.blocked){
            if(!self.blockedRecords){
                    self.blockedRecords = [];
                }if(!self.isBlocked){
                    self.blockedRecords.push({"firstSeen": milliseconds});
                }
                self.blockedRecords[self.blockedRecords.length-1]["lastSeen"] = milliseconds;
        }
        self.isBlocked = snapshotTicket.blocked;
    };

    self.getTotalBlockedTime = function (){
        var totalBlockedTime = 0;
        var blockIndex ;
        for(blockIndex in self.blockedRecords){
            totalBlockedTime += (self.blockedRecords[blockIndex].lastSeen - self.blockedRecords[blockIndex].firstSeen);
        }
        return totalBlockedTime;
    };

    self.wasBlocked = function(milliseconds){
        var blockIndex ;
        for(blockIndex in self.blockedRecords){
            if(self.blockedRecords[blockIndex].lastSeen >= milliseconds && milliseconds>= self.blockedRecords[blockIndex].firstSeen){
                return true;
            }
        }
        return false;
    };

    self.blockedSince = function(){
        if(!self.isBlocked){
            return null;
        }
        return self.blockedRecords[self.blockedRecords.length-1].firstSeen;
    }

    
    return self;
}

function convertTo050(boardData, logger){
    if(!logger){
        logger = function (log){
            console.log("ConvertTo050 | "+ log);
        };
    }
    logger("Convert boardData from 0.4.5 to 0.5.0 = " );
    var snapshots = [];
    var converted = new BoardData();
    logger("converted = " + jsonEncode(converted));
    function getObservationTimes (boardDesignRecords){
        var observationTimes = [];
        _.forEach(boardDesignRecords,function(boardDesignRecord){
            observationTimes = observationTimes.concat(boardDesignRecord.seen);
        });
        logger("Observation times = " + jsonEncode(observationTimes));
        logger("Observation times length = " + observationTimes.length);
        return observationTimes;
    }
    
    function createSnapshotRecords(observationTimes){
        var snapshotRecords = [];
        _.forEach(observationTimes,function (observationTime){
            snapshotRecords.push({"firstSeen" : observationTime,
                                  "lastSeen" : observationTime });
        });
        logger ("snapshot records = " + jsonEncode(snapshotRecords) );
        logger ("snapshot records length = "+ snapshotRecords.length );
        return snapshotRecords;
    }

    function convertFlowTickets(flowData){
        _.forEach(flowData, function(flowTicket){
            var oldRecord;
            for(var laneIndex in flowTicket.lanes){
                oldRecord  = flowTicket.lanes[laneIndex]
                var newRecord = [];
                newRecord.push({"firstSeen" : oldRecord.enterMilliseconds,
                                "lastSeen"  : oldRecord.exitMilliseconds});
                newRecord[0].name = laneIndex;
                flowTicket.inLane = laneIndex; 
                flowTicket.lanes[laneIndex] = newRecord;
            }
        });
        
    }

    function setBoardDesignRecordsFirstAndLastSeen(boardDesignRecords){
        _.forEach(boardDesignRecords,function(boardDesignRecord){
            logger("Board design seen  = " + jsonEncode(boardDesignRecord.seen));
            boardDesignRecord.firstSeen = _.first(boardDesignRecord.seen);
            boardDesignRecord.lastSeen = _.last(boardDesignRecord.seen);
            boardDesignRecord.seen = null;
            logger("Board design firstSeen  = " + jsonEncode(boardDesignRecord.firstSeen));
            logger("Board design lastSeen  = " + jsonEncode(boardDesignRecord.lastSeen));
        });
    }

    if(boardData.ver === "0.4.5"){
        boardData.snapshotRecords = createSnapshotRecords(getObservationTimes(boardData.boardDesignHistory.boardDesignRecords));
        setBoardDesignRecordsFirstAndLastSeen(boardData.boardDesignHistory.boardDesignRecords);
        convertFlowTickets(boardData.flowData);
        boardData.ver = "0.5.0";
        boardData = new BoardData(boardData);
        snapshots = boardData.getSnapshots();
        logger(snapshots.length + " Snapshots generated ");
        _.forEach(snapshots,function(snapshot){
            logger("Adding snapshot = "+jsonEncode(snapshot));
            logger("snapshot time  = "+timeUtil.dateFormat(snapshot.milliseconds));
            converted.addSnapshot(snapshot);
        });
    }

    return converted;
    
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
        var boardDesignRecord;
        if(numberOfRecords === 0){
            boardDesignRecord = new BoardDesignRecord(boardDesign,milliseconds);
            this.boardDesignRecords.push(boardDesignRecord);
        }else if(this.boardDesignRecords[numberOfRecords-1].equals(boardDesign) ){
            console.log("The boardDesign has not changed updating observation time");
            this.boardDesignRecords[numberOfRecords-1].newObservation(milliseconds);
        }else{
            console.log("The boardDesign has changed adding new design to history");
            boardDesignRecord = new BoardDesignRecord(boardDesign,milliseconds);
            this.boardDesignRecords.push(boardDesignRecord);
        }
    };

    


    boardDesignHistory.getLatestBoardDesign = function(){
       return this.boardDesignRecords[this.boardDesignRecords.length -1].getBoardDesignForSnapshot();
    };

    

    boardDesignHistory.getLatestBoardObservationTime = function(){
        return this.boardDesignRecords[this.boardDesignRecords.length -1].lastSeen;
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
        //existing record
        boardDesignRecord = boardDesign;
        if(boardDesignRecord.seen){ //Convert between intermediate formats this should be removed 
           boardDesignRecord.firstSeen = _.first(boardDesignRecord.seen);
           boardDesignRecord.lastSeen  = _.last(boardDesignRecord.seen);
           boardDesignRecord.seen = null;
        }//end remove
    }else{
        //new boardDesign record
        boardDesignRecord.firstSeen = milliseconds;
        boardDesignRecord.lastSeen  = milliseconds;
        boardDesignRecord.design = boardDesign;
    }

    
    boardDesignRecord.equals = function(boardDesign){
        //console.log("this.design = " + jsonEncode(this.design));
        //console.log("boardDesign = " + jsonEncode(boardDesign));
        
        return arraysAreIdentical(getLaneNames(this.design),getLaneNames(boardDesign));
    };

    function getLaneNames(design){
        var lanes = [];
        _.forEach(design,function (lane){
            var wip;
            if(!lane.wip){
                wip = 0;
            }else if(lane.wip.limit ===""){
                lane.wip.limit = 0;
                wip = 0;
            }else{
                wip = parseInt(lane.wip.limit);
            }
            lanes.push(lane.name + "("+wip+")");
        });
        return lanes;
    }

    boardDesignRecord.newObservation= function(milliseconds){
        boardDesignRecord.lastSeen = milliseconds;
    };

    boardDesignRecord.getBoardDesignForSnapshot = function(){
        var design = cloneObjectData(this.design);
        return design;
    };

    return boardDesignRecord;
}