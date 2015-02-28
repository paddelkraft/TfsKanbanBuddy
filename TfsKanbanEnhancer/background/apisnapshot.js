//apisnapshot.js


function ApiSnapshot(apiUrl,boardUrl,genericItemUrl, projectUrl){
	var self = this;
	self.apiUrl = apiUrl;
	self.boardUrl = boardUrl;
	self.genericItemUrl= genericItemUrl;
	self.projectUrl = projectUrl
	self.snapshot = null;
	self.status = 0
	self.get = function(callback){
		$.get(apiUrl,callback);
	};

	function callback(data,status){
		var lanes;
		var tickets;
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
			snapshot.milliseconds = new Date().getTime();
			snapshot.boardUrl = boardUrl;
			snapshot.board = projectUrl; 
			snapshot.genericItemUrl = self.genericItemUrl;
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

	self.getSnapshot = function(callback){
		if(self.status===0){
			self.whenDone = callback;
		}else{
			callback();
		}
	};
	self.get(callback);
	return self;
}







