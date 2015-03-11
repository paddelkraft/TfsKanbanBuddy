
//apiSpec.js


describe("TFS Board API ", function() {
	var snapshot ={};
    snapshot.board = "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection";
    snapshot.boardUrl = "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_backlogs/board/Backlog%20items";
    snapshot.genericItemUrl = "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=";
    snapshot.cardCategory = "Custom";

    var snapshotWithShortUrl = _.cloneDeep(snapshot);
    snapshotWithShortUrl.boardUrl = "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_backlogs/board/";

    var boardRegistryWithShortBoardUrl={
    	"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_api/_backlog/GetBoard?__v=5&hubCategoryReferenceName=Custom":{
    		"boardUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_backlogs/board/",
    		"projectUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection",
    		"apiUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_api/_backlog/GetBoard?__v=5&hubCategoryReferenceName=Custom",
    		"genericItemUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=",
    		"cardCategory": "Custom"
    	}
    };

    var boardRegistryWithLongBoardUrl={
    	"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_api/_backlog/GetBoard?__v=5&hubCategoryReferenceName=Custom":{
    		"boardUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_backlogs/board/Backlog%20items",
    		"projectUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection",
    		"apiUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_api/_backlog/GetBoard?__v=5&hubCategoryReferenceName=Custom",
    		"genericItemUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=",
    		"cardCategory": "Custom"
    	}
    };
		
  
	it("should get 2013 Api url from board Url", function() {
		var apiUrl = apiUtil().getApiUrl(snapshot.boardUrl,snapshot.cardCategory);
		expect(apiUrl).toBe("https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_api/_backlog/GetBoard?__v=5&hubCategoryReferenceName=Custom");
	});


	approveIt("should createA new boardRecord", function(approvals) {
		var boardRecord = apiUtil().createBoardRecord(snapshot);
        boardRecord.boardApiUrl = boardRecord.getBoardApiUrl();
        boardRecord.genericItemUrl=boardRecord.getGenericItemUrl();
        boardRecord.workItemApiUrl = boardRecord.getWorkItemApiUrl([1,2],["System.field"]);
        approvals.verify( boardRecord);
	});

	approveIt("should register board",function(approvals){
		var storageMock = ApiStorage();
		var boardRegistry;
		var setRegisteredBoards = spyOn(storageMock,"setRegisteredBoards").and.callFake(function(input){
			boardRegistry = input;
		});
		
		var getRegisteredBoards = spyOn(storageMock,"getRegisteredBoards").and.returnValue({});
		
		apiUtil(storageMock).registerBoard(snapshot);
		expect(getRegisteredBoards).toHaveBeenCalled();
		expect(setRegisteredBoards).toHaveBeenCalled();
		approvals.verify(boardRegistry); //('{"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_api/_backlog/GetBoard?__v=3":{"boardUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_backlogs/board/","apiUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_api/_backlog/GetBoard?__v=3","genericItemUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id="}}');
	});

	it("board should  updateBoardUrl",function(){
		var storageMock = ApiStorage();
		var setRegisteredBoards = spyOn(storageMock,"setRegisteredBoards");
		var getRegisteredBoards = spyOn(storageMock,"getRegisteredBoards")
			.and.returnValue({"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_api/_backlog/GetBoard?__v=3":{"boardUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_backlogs/board/","apiUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_api/_backlog/GetBoard?__v=3","genericItemUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id="}});
		
		apiUtil(storageMock).registerBoard(snapshot);
		expect(getRegisteredBoards).toHaveBeenCalled();
		expect(setRegisteredBoards).toHaveBeenCalled();
	});

	approveIt("should update boardUrl in storage",function(approvals){
		var storageMock = ApiStorage();
		var boardRegistry = {};
		var setRegisteredBoards = spyOn(storageMock,"setRegisteredBoards").and.callFake(function(input){
			boardRegistry = input;
		});
		var getRegisteredBoards = spyOn(storageMock,"getRegisteredBoards")
			.and.returnValue(_.cloneDeep(boardRegistryWithShortBoardUrl));
		apiUtil(storageMock).registerBoard(snapshot);
        //expect(boardRegistry).jsonToBe(boardRegistryWithLongBoardUrl);
        approvals.verify(boardRegistry)
	});

	//Remove 0.6.0
	approveIt("should remove boardUrl with encoded - in storage",function(approvals){
		 var registeredBoards ={
		 
		  "http://tfs.it.volvo.net:8080/tfs/Global/SEGOT-GDP/Team%203%20%E2%80%93%20Dev%20Gothenburg/_api/_backlog/GetBoard?__v=5&hubCategoryReferenceName=Microsoft.RequirementCategory": {
		    "boardUrl": "http://tfs.it.volvo.net:8080/tfs/Global/SEGOT-GDP/Team%203%20%E2%80%93%20Dev%20Gothenburg/_backlogs/board/Acceptance%20Tests",
		    "projectUrl": "http://tfs.it.volvo.net:8080/tfs/Global/SEGOT-GDP/Team%203%20%E2%80%93%20Dev%20Gothenburg",
		    "apiUrl": "http://tfs.it.volvo.net:8080/tfs/Global/SEGOT-GDP/Team%203%20%E2%80%93%20Dev%20Gothenburg/_api/_backlog/GetBoard?__v=5&hubCategoryReferenceName=Microsoft.RequirementCategory",
		    "genericItemUrl": "http://tfs.it.volvo.net:8080/tfs/Global/SEGOT-GDP/_workitems#_a=edit&id=",
		    "cardCategory": "Microsoft.RequirementCategory"
		  },
		  
		  "http://tfs.it.volvo.net:8080/tfs/Global/SEGOT-GDP/Team%203%20–%20Dev%20Gothenburg/_api/_backlog/GetBoard?__v=5&hubCategoryReferenceName=Microsoft.RequirementCategory": {
		    "boardUrl": "http://tfs.it.volvo.net:8080/tfs/Global/SEGOT-GDP/Team%203%20–%20Dev%20Gothenburg/_backlogs/board/Acceptance%20Tests",
		    "projectUrl": "http://tfs.it.volvo.net:8080/tfs/Global/SEGOT-GDP/Team%203%20–%20Dev%20Gothenburg",
		    "apiUrl": "http://tfs.it.volvo.net:8080/tfs/Global/SEGOT-GDP/Team%203%20–%20Dev%20Gothenburg/_api/_backlog/GetBoard?__v=5&hubCategoryReferenceName=Microsoft.RequirementCategory",
		    "genericItemUrl": "http://tfs.it.volvo.net:8080/tfs/Global/SEGOT-GDP/_workitems#_a=edit&id=",
		    "cardCategory": "Microsoft.RequirementCategory"
		  }
		};
		var storageMock = ApiStorage();
		var boardRegistry = {};
		var setRegisteredBoards = spyOn(storageMock,"setRegisteredBoards").and.callFake(function(input){
			boardRegistry = input;
		});
		var getRegisteredBoards = spyOn(storageMock,"getRegisteredBoards")
			.and.returnValue(registeredBoards);
		apiUtil(storageMock).registerBoard(snapshot);
		approvals.verify(boardRegistry);
	});//end remove

	approveIt("should use long boardUrl in storage",function(approvals){
		var storageMock = ApiStorage();
		var boardRegistry = {};
		var setRegisteredBoards = spyOn(storageMock,"setRegisteredBoards").and.callFake(function(input){
			boardRegistry = input;
		});
		var getRegisteredBoards = spyOn(storageMock,"getRegisteredBoards")
			.and.returnValue(_.cloneDeep(boardRegistryWithLongBoardUrl));
		apiUtil(storageMock).registerBoard(snapshotWithShortUrl);
		approvals.verify(boardRegistry);//.jsonToBe(boardRegistryWithLongBoardUrl);
	});



	it("should  get API Snapshot",function(){
		var storageMock = ApiStorage();
		var getRegisteredBoards = spyOn(storageMock,"getRegisteredBoards").and.returnValue({"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_api/_backlog/GetBoard?__v=3":{"boardUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_backlogs/board/Backlog%20items","apiUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_api/_backlog/GetBoard?__v=3","genericItemUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id="}});
		var _apiUtil = apiUtil(storageMock);
		var _boardRecord;
		var getApiSnapshot = spyOn(_apiUtil,"getApiSnapshot").and.callFake(function(boardRecord){
			_boardRecord = boardRecord;
		});
		_apiUtil.getApiSnapshots();
		expect(getRegisteredBoards).toHaveBeenCalled();
		expect(getApiSnapshot).toHaveBeenCalled();
		expect(_boardRecord).jsonToBe({"boardUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_backlogs/board/Backlog%20items","apiUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_api/_backlog/GetBoard?__v=3","genericItemUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id="});
	});

});



describe("TFS workitem api",function(){

    approveIt("should get workitem with state from api", function(approvals){
        //https://paddelkraft.visualstudio.com/defaultcollection/_apis/wit/workitems?api-version=1.0&ids=16&fields=System.state
        //_apis/wit/workitems?api-version=1.0&ids=16&fields=System.state;
        var jqMock = {"get":function(apiUrl,callback){
            callback({"count":1,"value":[{"id":16,"rev":6,"fields":{"System.State":"Removed"},"url":"https://paddelkraft.visualstudio.com/DefaultCollection/_apis/wit/workItems/16"}]},
                     "success");
        }};
        var apiWorkItem = new ApiWorkItem("https://paddelkraft.visualstudio.com/defaultcollection/_apis/wit/workitems?api-version=1.0&ids=16&fields=System.state",jqMock)
        apiWorkItem.then(function(tickets){
            approvals.verify(tickets);
        })
    });




});//
