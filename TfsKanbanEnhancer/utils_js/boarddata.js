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
    this.snapshots = (data.snapshots) ? SnapshotsConstructor(data.snapshots) : [];
    
    this.flowData = (data.flowData) ? new FlowData(data.flowData,this.genericItemUrl) : new FlowData() ;
    
    //functions

   
    this.addSnapshot = function(snapshot){
        snapshot = SnapshotConstructor(snapshot);
        this.flowData.addSnapshot(snapshot);
        this.genericItemUrl = snapshot.genericItemUrl;
        console.log("genericItemUrl " + this.genericItemUrl);
        if(!this.board){
            this.board = snapshot.board;
            this.storageKey = "snapshots_" + this.board;
        }
        if( this.snapshots.length >1 && isSameDay(this.snapshots[this.snapshots.length-2].time, snapshot.time )){
            this.snapshots[this.snapshots.length-1] = snapshot;
        } else {
            this.snapshots.push(snapshot);
        }
    };

    this.getLaneHeaders = function (){
        var lanes = newLaneNode("");
        var lanesArray = [];
        var lastAdded
        var index, laneIndex ;
        for(index in this.snapshots){
            var snapshot = this.snapshots[index];
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
    };

    //util
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

    this.size = function(){
        return jsonEncode(this).length * 2;
    }


    function SnapshotConstructor(snapshotDataObject){
        snapshot = snapshotDataObject;
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
    //construction
           

            //Todo remove in next version this is to migrate to new storing format
             // clear for testing purposes 
             
            //this.flowData = new FlowData() ;
            if(this.flowData == new FlowData()){
                for (var index in this.snapshots){
                    this.flowData.addSnapshot(this.snapshots[index]);
                 }; 
            } // end remove
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
        }
    }

    if (flowData){
        for(var index in flowData){
            
            this[index] = flowItemConstructor(flowData[index],genericItemUrl);
        }
    }
}