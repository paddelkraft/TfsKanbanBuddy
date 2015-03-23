//apisnapshot.js


function ApiSnapshot($jq, _timeUtil, apiUrl,boardUrl,genericItemUrl, projectUrl){
	var self = {};
	self.apiUrl = apiUrl;
	self.boardUrl = boardUrl;
	self.genericItemUrl= genericItemUrl;
	self.projectUrl = projectUrl;
	self.snapshot = null;
	self.status = 0;

    self.get = function(callback){
		$jq.get(apiUrl,callback);
	};

	function callback(data,status){
		if (status === "success"){
			self.snapshot = self.buildSnapshot(data);
		}
		self.status = status;
		if(self.whenDone){
			self.whenDone(self.snapshot);
		} 
	}

	self.buildSnapshot =function (apiResponse){
			var lanes = self.getLanes(apiResponse);
			var tickets = self.getTickets(apiResponse);
			var snapshot = {};
			snapshot.milliseconds = _timeUtil.now().getTime();
			snapshot.boardUrl = boardUrl;
			snapshot.board = projectUrl; 
			snapshot.genericItemUrl = self.genericItemUrl;
            snapshot.doneState = self.getDoneState(apiResponse);
			_.forEach(lanes,function(lane){
				lane.tickets = self.ticketsInlane(tickets,lane.name);
				lane.wip.limit = lane.wip.limit;
				lane.wip.current = lane.tickets.length;
				
			});
			snapshot.lanes = lanes;

			return snapshot;
		};

	self.ticketsInlane = function(tickets,lane){
			var inLane = [];
			_.forEach(tickets, function(ticket){
				if(ticket.lane === lane){
					inLane.push({"id" : ticket.id, "title" : ticket.title});
				}
			});
			return inLane;
		};


	self.getTickets = function (apiResponse){
		var apiTickets =apiResponse.itemSource.payload.rows;
		var indexes = apiResponse.itemSource.payload.columns;
		var tickets = [];
		var id = "System.Id";
		var title = "System.Title";
		var lane = "_Kanban.Column";
		id = indexes.indexOf(id);
		title = indexes.indexOf(title);
		lane = _.findIndex(indexes,function(index){
			return (index.indexOf(lane) > -1);
		});
		_.forEach(apiTickets,function(ticket){
			tickets.push({"id" : ticket[id].toString(), "title" : ticket[title], "lane": ticket[lane]});
		});
		return tickets;
	};

	self.getLanes = function(apiResponse){
		var lanes = [];
		_.forEach(apiResponse.boardSettings.columns,function(apiLane){
			var lane = {"name":apiLane.name};
			lane.wip = {"limit" : apiLane.itemLimit};
			lanes.push(lane);
		});
		return lanes;
	};

    self.getDoneState = function(apiResponse){
        var doneLane = _.last(apiResponse.boardSettings.columns);
        var doneStates = [];

        _.forEach(doneLane.stateMappings,function(state){
            doneStates.push(state);
        });
        return doneStates;
    };

	self.getSnapshot = function(callback){
		if(self.status===0){
			self.whenDone = callback;
		}else{
			callback(self.snapshot);
		}
	};
	self.get(callback);
	return self;
}

function ApiWorkItem($jq,apiUrl){
    var self = {};
    self.status = 0;


    self.get = function(callback){
        $jq.get(apiUrl,callback);
    };

    function callback(data,status){

        if (status === "success"){
            self.tickets = self.buildTickets(data);
        }
        self.status = status;
        if(self.whenDone){
            self.whenDone(self.tickets);
        }
    }

    self.then = function(callback){
        if(self.status===0){
            self.whenDone = callback;
        }else{
            callback(self.tickets);
        }
    };

    self.buildTickets = function (apiData){
        var tickets = [];
        _.forEach(apiData["value"], function(apiTicket){
            var ticket = {};
            ticket.id = apiTicket.id;
            _forEachIndex(apiTicket.fields,function(fieldValue,index){
                ticket[index.replace("System.","")]= fieldValue;
            });
            tickets.push(ticket);
        });

        return tickets;
    };

    self.get(callback);
    return self;

}

function TfsApi(timeUtil,jQuery){
    var self = {};
    self.jQuery = jQuery;
    self.timeUtil = timeUtil;

    self.workItem = _.curry( ApiWorkItem)(self.jQuery);

    self.snapshot = _.curry(ApiSnapshot)(self.jQuery,self.timeUtil);
    return self;
}






