function log(msg){
    console.log ("BoardData | "+ msg);
}

//Entry point for all saved data from a kanban board
//the constructor takes the saved data structures and recreates it with added functions

function BoardData(data){
    var self = this;
    if(!data){
        data = {};
    }
    
    self.ver="0.5.0";
    self.updated=null;
    self.board = (data.board)?data.board:null;
    self.boardUrl = (data.boardUrl) ? data.boardUrl : null;
    self.storageKey = "snapshots_" + self.boardUrl;
    self.genericItemUrl = (data.genericItemUrl)? data.genericItemUrl:"";
    // records of individual board states holds times for when it was first and last seen every time theboard changes
    // there is a new record generated 
    self.snapshotRecords = (data.snapshotRecords) ? data.snapshotRecords : [];
    // storage for historical and current board designs with firstSeen and lastSeen
    self.boardDesignHistory = (data.boardDesignHistory)? new BoardDesignHistory(data.boardDesignHistory):
                                                         new BoardDesignHistory();
    self.flowData = (data.flowData) ? new FlowData(data.flowData,self.genericItemUrl) : new FlowData() ;
    
    var blockedPrefix=null;
    //functions

    //set new lastseen if snapshot is identical to last one 
    function updateSnapshotRecord(milliseconds){
        _.last(self.snapshotRecords).lastSeen=milliseconds;
    }

    //generates new snapshot record when the board state has changed since last snapshot
    function newSnapshotRecord(milliseconds){
        self.snapshotRecords.push({"firstSeen":milliseconds,"lastSeen":milliseconds});
    }

    

    
    // used to see if the snapshot new snapshot is identical to the one last added
    self.boardHasNotChanged = function (snapshot){
        var latestSnapshot = self.getLatestSnapshot();
        return latestSnapshot && snapshot.equals(latestSnapshot);
    };
   
    //sets blocked for blocked tickets in snapshots before adding the snapshpt to flowdata
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

    //utility to set the blocked prefix. for setBlocked to work this function needs to be called with
    //the blocked prefix before you add a new snapshot to boarddata
    self.setBlockedPrefix = function (prefix){
        blockedPrefix = prefix;
    };

    // New incomming snapshot of kanban board is added to boardData
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
        //self.flowData.updateTicketsNotOnBoard(snapshot.milliseconds, _.last(snapshot.lanes).name);
        self.genericItemUrl = snapshot.genericItemUrl;
        self.board = snapshot.board;
        self.boardUrl = snapshot.boardUrl;
        if(snapshot.doneState){
            self.doneState = snapshot.doneState;
        }

        self.updated = timeUtil.dateFormat(snapshot.milliseconds);

    };

    self.updateStateForTicketsNotOnBoard = function(tickets){
        _.forEach(tickets, function(ticket){
            if(_.indexOf(self.doneState,ticket.state)!==-1)
                self.flowData[ticket.id].state = "done";
            else{
                self.flowData[ticket.id].state = "removed";
            }
        });
        self.updateDoneTickets();
    };

    self.getTicketsMissingOnBoard = function(){
        var tickets = [];
        var milliseconds = self.getLatestSnapshotTime();
        _.forEach(self.flowData,function(ticket){
            if(! _.isFunction(ticket)){
                if(ticket.lastSeen() < milliseconds && !ticket.state ){
                    tickets.push(ticket.id)
                }
            }
        });

        return tickets
    };

    self.updateDoneTickets = function(){
        var milliseconds = self.getLatestSnapshotTime();
        var lastLaneOnBoard = self.getLastLaneOnBoard();
        _.forEach(self.flowData,function(ticket){
            if(! _.isFunction(ticket)){
                if(ticket.lastSeen() < milliseconds && ticket.state && ticket.state === "done"){
                    ticket.setLane(lastLaneOnBoard,milliseconds);
                }
            }
        });
    };

    self.getLatestSnapshotTime = function (){
       return _.last(self.snapshotRecords).lastSeen;
    };

    self.getLastLaneOnBoard = function(){
       return _.last(_.last(self.boardDesignHistory.boardDesignRecords).design).name;
    }

    self.getLatestSnapshot = function(){
        if(self.snapshotRecords.length>0){
            return self.getSnapshot(self.getLatestSnapshotTime());
        }
        return null;
    };

    //returns all snapshots needed to recreate all data in this boarddata
    self.getSnapshots = function(){
        var boardObservationTimes = getBoardTransisionTimes();
        var snapshots = [];
        var observationIndex;
        for(observationIndex in boardObservationTimes){
            snapshots.push(self.getSnapshot(boardObservationTimes[observationIndex]));
        }
        return snapshots;
    };

    // util function that finds all transition times for recorded data
    function getBoardTransisionTimes(){
        var boardObservationTimes = [];
        _.forEach(self.snapshotRecords,function(record){
            boardObservationTimes.push(record.firstSeen);
            if(record.firstSeen!==record.lastSeen){
                boardObservationTimes.push(record.lastSeen);
            }
        });
        return boardObservationTimes;
    }

    //util  to recreates the state the board had at the given time in milliseconds
    var getBoardState = function(milliseconds){
        var boardDesignRecord = self.findBoardDesignRecord(milliseconds);
        var boardState = boardDesignRecord.getBoardDesignForSnapshot();
        for(var index in boardState){
            var lane = boardState[index].name;
            var tickets = self.flowData.getTicketsInLane(lane,milliseconds);
            boardState[index].tickets = tickets;
        }
        return boardState;
    };
    //recreates a full snapshot of the board as it looked  at the given time in milliseconds
    self.getSnapshot = function(milliseconds){
        var snapshot = {};
        if( self.findBoardDesignRecord(milliseconds)!==null){
           snapshot.milliseconds = milliseconds;
            snapshot.board = self.board;
            snapshot.boardUrl = self.boardUrl;
            snapshot.genericItemUrl = self.genericItemUrl;
            snapshot.lanes = getBoardState(milliseconds);
        }
        return new Snapshot(snapshot);
    };

    //get the current board design at the given time in milliseconds
    self.findBoardDesignRecord = function(milliseconds){
        var boardDesign = null;
        var snapshotTime;
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

    //Remove this one moved to presentation parts
    self.buildCfdChartData = function(cfdData){
        var chartData = [];
        var lane,day;
        var laneData;
        console.log("buildCfdChartData");
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

    self.getCfdData = function(filter){
        var columnIndexes = getCfdColumnIndexes(self.getLaneHeaders().reverse());
        var cfdData = self.flowData.getCfdData(filter);
        console.log("getCfdData");
        //console.log(jsonEncode(cfdData));
        var cfdGrid = getCfdGrid(filter);
        var rowIndexes = getCfdRowIndexes(cfdGrid);
        _.forEach(cfdData,function(ticket){
            //console.log(jsonEncode(ticket));
            _.forEach(ticket,function(day){
                var isoDate,row,column;
                //console.log(jsonEncode(day));
                isoDate = ""+timeUtil.dayStart(day.milliseconds);
                row = rowIndexes[isoDate];
                column = columnIndexes[day.lane];
                if(cfdGrid[row]){
                    cfdGrid[row][column]++;
                }
            });
        });

        return cfdGrid;
    };


    function getCfdRowIndexes(cfdGrid){
        var indexes = {};
        var row;
        console.log("getCfdRowIndexes");
        for(row = 0 ;row<cfdGrid.length;row++){
            indexes[""+cfdGrid[row][0]] = row;
        }
        return indexes;
    }

    function getCfdColumnIndexes(lanes){
        var indexes = {};
        var lane;
        console.log("getCfdColumnIndexes");
        for(lane = 0; lane<lanes.length; lane++){
            indexes[lanes[lane]] = lane+1;
        }
        return indexes;
    }

    var getCfdGrid = function(filter){
        var laneHeaders = self.getLaneHeaders().reverse();
        var start = timeUtil.dayStart(self.snapshotRecords[0].firstSeen);
        var end = timeUtil.dayStart(self.snapshotRecords[self.snapshotRecords.length-1].lastSeen + timeUtil.MILLISECONDS_DAY);
        var days;
        var grid;
        var row ;
        
        if(filter){
            if(filter.startMilliseconds){
                start = filter.startMilliseconds;
            }
            if(filter.endMilliseconds){
                 end = filter.endMilliseconds;
            }
        }

        days = Math.floor((end - start)/timeUtil.MILLISECONDS_DAY +1);
        grid = gridOf(0,days+1,laneHeaders.length+1);
        row = 0;
        
        
        console.log("getCfdGrid");
        grid[row] = ["Date"].concat(laneHeaders);
        for(row = 0 ; row < days; row++){
            //grid[row+1][0] = timeUtil.isoDateFormat(start+row*timeUtil.MILLISECONDS_DAY);
            grid[row+1][0] = (start+row*timeUtil.MILLISECONDS_DAY);
        }
        return grid;

    };

    self.getCycleTimes = function(startLane, endlane){
        var cycleTimes = [];
        var laneHeaders = self.getLaneHeaders();
        var startIndex = _.indexOf(laneHeaders,startLane);
        var endIndex = _.indexOf(laneHeaders,endlane);
        _.forEach(self.flowData,function(ticket){
            var cycleTime = {};
            var cfdData;
            if(_.isFunction(ticket)){
                return;
            }
            if( endIndex <= _.indexOf(laneHeaders,ticket.inLane)){
                cycleTime.id = ticket.id;
                cycleTime.title = ticket.title;
                cfdData = ticket.cfdData()
                cycleTime.start = getCycletimeStart(laneHeaders,startIndex,cfdData);
                cycleTime.end = getCycletimeEnd(laneHeaders,endIndex,cfdData);
                cycleTime.cycleTime = cycleTime.end-cycleTime.start;
                cycleTimes.push(cycleTime);
            }
        });
        return cycleTimes;
    };

    function getCycletimeStart(laneHeaders,startIndex,cfdData){
        var start;
        _.forEach(cfdData,function(day){
            if(_.indexOf(laneHeaders,day.lane)>= startIndex){
                start = day.milliseconds;
                return false;
            }
        });
        return start;
    }

    function getCycletimeEnd(laneHeaders,endIndex,cfdData){
        var end;
        _.forEachRight(cfdData,function(day){
            if(_.indexOf(laneHeaders,day.lane)>= endIndex){
                end = day.milliseconds;
            }else{
                return false;
            }
        });
        return end;
    }
    //get a list of all historical lane names (used for reporting) 
    self.getLaneHeaders = function (){
        var lanes = newLaneNode("");
        var lastCheckedNode;
        console.log("getLaneHeaders");
        _.forEach(self.boardDesignHistory.boardDesignRecords,function(boardDesignRecord){
            lastCheckedNode = lanes;
            _.forEach(boardDesignRecord.getDesign(),function (lane){
                 if(!lanes.find(lane)){
                    lastCheckedNode.insert(newLaneNode(lane));
                }
                lastCheckedNode = lanes.find(lane);
            });
        });
        return lanes.toArray().reverse() ;
    };

    //a linked list used to get the lane headers in a good order for the reports
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

    //how much data is in this boardData object
    self.size = function(){
        return jsonEncode(self).length * 2;
    };
}//BoardData



//kanban board snapshot object
//takes the snapshot data structure as imput 
function Snapshot(snapshot){
    var self = this;
    //link to board
    self.board =  snapshot.board;
    self.boardUrl= snapshot.boardUrl;
    //time of napshot capture
    self.milliseconds = snapshot.milliseconds;
    //generic link to item details used to 
    //link direct into tfs items from reports 
    self.genericItemUrl = snapshot.genericItemUrl;
    self.cardCategory = snapshot.cardCategory;
    if(snapshot.doneState){
        self.doneState = snapshot.doneState
    }
    //board state
    self.lanes = [];
    _.forEach(snapshot.lanes,function(lane){
        self.lanes.push( new SnapshotLane(snapshot.genericItemUrl,lane));
    });
    self.lanes = fixWip(self.lanes);

    //makes sure that the wip information is uniform and correct 
    function fixWip(lanes){
        var current = 0;
        for(var index in lanes){
            var tickets = lanes[index].tickets;
            
            if(lanes[index].wip){
                if( lanes[index].wip.limit===0){
                    current =lanes[index].wip.current;
                    //lanes with wip.limit ===0 is counted as done column if previous lane had wip.limit !==0
                    if (lanes[index-1] && lanes[index-1].wip && lanes[index-1].wip.limit>0){
                        lanes[index-1].wip.current += current;
                        lanes[index].wip.current = 0;
                    }
                }
            }
            
        }
        return lanes;

    }

    self.getBoardApiUrl = function(){
        var apiUrl = self.board.split("_backlogs")[0]+"_api/_backlog/GetBoard?__v=3";
        return apiUrl;
    };

    //extract the board design from snapshot
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
    };

    //compare snapshots
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

//lane object used in snapshots
function SnapshotLane (genericItemUrl,lane){
    
    var self = this;
    self.name = lane.name;
    // information on wip limit and ongoing work for lane
    if(lane.wip){
        if(lane.wip.limit === ""){
            lane.wip.limit = 0;
        }
        self.wip = {"limit" : parseInt(lane.wip.limit), "current" : 0};
    }
    self.tickets = [];
    _.forEach(lane.tickets,function(ticket){
        self.tickets.push(new SnapshotTicket(genericItemUrl,ticket));
        if(lane.wip){
            self.wip.current++;
        }
    });

    //compare snapshot lanes
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

//Ticket object used in snapshots
function SnapshotTicket(genericItemUrl,data){
    var self = this;
    self.id = data.id;
    self.title = data.title;
    if (data.blocked){
        self.blocked = data.blocked;
    }
    //returns a direct link to tfs item this tickets represents
    self.url = function(){
        return genericItemUrl+self.id;
    };

    //Compare snapshot Tickets
    self.equals = function(comp){
        var same = true;
        if(!(self.id === comp.id && self.title === comp.title)){
            return false;
        }
        
        return(self.blocked === comp.blocked);
    };
    return self;
}


// this is where all the data on what tiskets has been on the board and what state they have been at what time
function FlowData(flowData, genericItemUrl){
    var self = this;


    //when did ticket first appear on the board
    self.getEnterMilliseconds = function (id,lane){
        return self[id].lanes[lane][0].firstSeen;
    };

    //tickets in lane at given time in milliseconds
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

    
    //update flow ticket with the latest data
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
    }



    //add data from a new snapshot
    self.addSnapshot = function (snapshot){
        log("add snapshot millisecond = " + snapshot.milliseconds);
        var laneIndex ;
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

    self.getCfdData = function(filter){
        var cfdData = [];
        var ticketData;
        _.forEach(self, function(ticket ){
            if(ticket instanceof FlowTicket && (!ticket.state || ticket.state!=="removed")){
                if(filter && filter.text){
                    if(-1 < ticket.title.indexOf(filter.text)){
                        ticketData = ticket.cfdData(filter);
                        cfdData.push(ticketData);
                    }
                } else{
                    ticketData = ticket.cfdData(filter);
                    cfdData.push(ticketData);
                }

                
                //console.log(jsonEncode(cfdData));
            }
        });
        //console.log("FlowData return " + jsonEncode(cfdData));
        return cfdData;
    };

    if (flowData){
        for(var index in flowData){
            if(! _.isFunction(flowData[index])){
                self[index] = new FlowTicket(flowData[index],genericItemUrl);
            }
                
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
    if(flowItemData.state){
        self.state = flowItemData.state;
    }
    //internal util functions
    //readable versions fo firstSeen and lastSeen is attached to object
    function addEnterAndExitFunctions(item){
        item.enter = function(){
            return timeUtil.dateFormat(item.firstSeen);
        };
        item.exit = function(){
            return timeUtil.dateFormat(item.lastSeen);
        };
        return item;
    }

    //ticket has entered a new lane
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
    
    
    //direct link to tfs item
    self.url = function(){
        return genericItemUrl + self.id;
    };

    //time when ticket entered board
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

    //time when ticket was last seen
    self.lastSeen = function () {
        var lastSeen = 0;
        var laneName;
        var lane;
        _.forEach(self.lanes, function(lane){
            _.forEach(lane,function(laneRecord){
            
                if(laneRecord.lastSeen>lastSeen){
                    lastSeen = laneRecord.lastSeen;
                }
            });
        });
        return lastSeen;
    };

    //update ticket with new data from  a new snapshot
    self.setLane = function(laneName,milliseconds){
        console.log("Set lane lane for ticket " + self.id +" = " + laneName);
        if(self.inLane!==laneName){
          addLaneIfMissing(laneName);
          self.lanes[laneName].push(createLaneRecord(laneName,milliseconds));
          console.log("After createLaneRecord "+ laneName + " has " + self.lanes[laneName].length + " records");
        }
        _.last(self.lanes[laneName]).lastSeen = milliseconds;
        self.inLane = laneName;
    };

    //where was this ticket at the given time
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

     //where was this ticket at the given time if not certain returns where ticket was last seen.
    self.wasInLaneContinous = function(milliseconds){
        var inLane=null;
        var closestEarlierObservation = 0;
        var lastSeenInLane = null;
        _.forEach(self.lanes, function(lane){
            if(inLane!==null){
                return false;
            }
            _.forEach(lane,function(laneRecord){
                if(laneRecord.lastSeen >= milliseconds && milliseconds >= laneRecord.firstSeen){
                    inLane = laneRecord.name;
                    return false;
                }

                if (laneRecord.lastSeen > closestEarlierObservation && laneRecord.lastSeen < milliseconds){
                    closestEarlierObservation = laneRecord.lastSeen;
                    lastSeenInLane = laneRecord.name;
                }
            });
            
        });
        if(inLane){
            return inLane;
        }
        return lastSeenInLane;
    };



    //create a lane objet if none exist for the given lane
    var addLaneIfMissing = function (laneName){
        if(!self.lanes[laneName]){
            console.log("Creating lane record for "+ laneName);
            self.lanes[laneName]=[];
        }
    };

    //get the lane racord for the tickets current location
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

    //update blockage status with new data from snapshot
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

    //was the ticket blocked at this time ?
    self.wasBlocked = function(milliseconds){
        var blockIndex ;
        for(blockIndex in self.blockedRecords){
            if(self.blockedRecords[blockIndex].lastSeen >= milliseconds && milliseconds>= self.blockedRecords[blockIndex].firstSeen){
                return true;
            }
        }
        return false;
    };

    //for how long has the current blockage been running?
    self.blockedSince = function(){
        if(!self.isBlocked){
            return null;
        }
        return self.blockedRecords[self.blockedRecords.length-1].firstSeen;
    };

    self.cfdData = function(filter){
        var start = self.enteredBoard();
        var end = self.lastSeen();
        var ticketData = [];
        var time ;
        var dayRecord;

        if (filter){
            if (filter.startMilliseconds && (filter.startMilliseconds>start)){
                start = filter.startMilliseconds;
            }
            if (filter.endMilliseconds && (filter.endMilliseconds<end)){
                end = filter.endMilliseconds;
            }
        }
        for (time = start; time < timeUtil.dayStart(end+2*timeUtil.MILLISECONDS_DAY); time = timeUtil.dayStart(time+timeUtil.MILLISECONDS_DAY)){
            dayRecord = {"lane":self.wasInLaneContinous(time),milliseconds : time};
            ticketData.push(dayRecord);
        }
        //console.log(jsonEncode(ticketData));
        return ticketData;
    };


    
    return self;
}


//Merge data from two datasources
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
    
    //update records with data from new snapshot
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
    if(boardDesign instanceof Array){
        boardDesignRecord.design = boardDesign;
        boardDesignRecord.firstSeen = milliseconds;
        boardDesignRecord.lastSeen  = milliseconds;
        
    }else{
        //existing record
        boardDesignRecord = boardDesign;
    }

    
    boardDesignRecord.equals = function(boardDesign){
        //console.log("this.design = " + jsonEncode(this.design));
        //console.log("boardDesign = " + jsonEncode(boardDesign));
        
        return arraysAreIdentical(getLaneNames(this.design),getLaneNames(boardDesign));
    };

    boardDesignRecord.getDesign = function(){
        var design = [];
        _.forEach(boardDesignRecord.design,function(lane){
            if(lane.name){
                design.push(lane.name);
            }
        });
        return design;
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
