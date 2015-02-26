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


function Storage(){
	self = {};

	
	self.getRegisteredBoards = function(){
		var registeredBoards = getObjectFromStorage("registered-boards") ;
		console.log("registered boards read from local storage");
		//Remove
		registeredBoards = self.removeOldRegistrys(registeredBoards);
		return registeredBoards;
	};

	
	//Remove 0.6
	self.removeOldRegistrys = function(registeredBoards){
		var apiUrl;
		var registry;
		var newRegistry = {};
		for(apiUrl in registeredBoards){
			registry = registeredBoards[apiUrl];
			if(registry.boardUrl.indexOf("_backlogs/board")!== -1){
				newRegistry[apiUrl] = registry;
			}
		}
		return newRegistry;
	};

	self.setRegisteredBoards = function(registeredBoards){
		saveObjectToStorage("registered-boards", registeredBoards) ;
		console.log("registeredBoards saved to local storage " );
	};

	return self;
}

function apiUtil(storage){
	var self = {};
	if(!storage){
		storage = Storage();
	}
	

	self.getApiUrl = function(boardUrl, cardCategory){
		var projName = boardUrl.split("/_backlogs")[0];
		if(!cardCategory){
			return projName + "/_api/_backlog/GetBoard?__v=3";
		}
		return projName + "/_api/_backlog/GetBoard?__v=5&hubCategoryReferenceName="+cardCategory;
		
	};

	//remove 0.6.0
	function removeUrlsWithEncodedDash(registeredBoards){
		var cleanedRegistry = {};
		_.forEach(registeredBoards,function (board){
			if(!(board.boardUrl.indexOf("E2%80%93")>-1)){
				cleanedRegistry[board.apiUrl] = board;
			}
		});

		return cleanedRegistry;
	}
	
	self.createBoardRecord = function (snapshot){
		var boardRecord = {};
		boardRecord.boardUrl = self.getBoardUrl(snapshot.boardUrl,snapshot.board,snapshot.cardCategory);
		boardRecord.projectUrl = snapshot.board;
		boardRecord.apiUrl = self.getApiUrl(snapshot.board,snapshot.cardCategory);
		boardRecord.genericItemUrl = snapshot.genericItemUrl;
		boardRecord.cardCategory= snapshot.cardCategory;
		return boardRecord;
	};

	self.registerBoard = function(snapshot){
		var registeredBoards  = removeUrlsWithEncodedDash(storage.getRegisteredBoards()); //storage.getRegisteredBoards();
		var boardRecord = self.createBoardRecord(snapshot);
		registeredBoards[boardRecord.apiUrl] = boardRecord;
		console.log("Register board " + boardRecord.boardUrl);
		
		storage.setRegisteredBoards(registeredBoards);
		
	};

	self.getBoardUrl = function(boardUrl,projectUrl,cardCategory){
		var registeredBoards  = storage.getRegisteredBoards();
		var url = boardUrl;
			_.forEach(registeredBoards,function(board){
				
				if(board.projectUrl===projectUrl && board.cardCategory === cardCategory){
					if (boardUrl.length < board.boardUrl.length && (endsWith(boardUrl,"board") || endsWith(boardUrl,"board/"))){
						url = board.boardUrl;
					}
					
					return false;
				}
			});
		return url;
	};

	self.getRegisteredBoardUrl = function(projectUrl,cardCategory){
		var registeredBoards  = storage.getRegisteredBoards();
		var boardUrl = null;
		var apiUrl = self.getApiUrl(projectUrl,cardCategory);
		if(registeredBoards[apiUrl]){
			boardUrl = registeredBoards[apiUrl].boardUrl;
		}

		return boardUrl;
	};
	
	self.getApiSnapshot = function(boardRecord){
		var api;
		console.log("Fetch snapshot from api "+boardRecord.apiUrl );
		api = new ApiSnapshot(boardRecord.apiUrl,boardRecord.boardUrl,boardRecord.genericItemUrl,boardRecord.projectUrl);

		api.getSnapshot( function(snapshot){
			console.log ("apiSnapshot built");
			saveSnapshot(snapshot);

		});
	};

	self.getApiSnapshots = function (){
		_.forEach (storage.getRegisteredBoards(),function(boardRecord){
			self.getApiSnapshot(boardRecord);
		});
	};


	return self;

}


