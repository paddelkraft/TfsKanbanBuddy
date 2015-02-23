
//apiSpec.js

//toDo
//write automatic API based snapshot functionality test first

describe("TFS API ", function() {
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


	approveIt("should createA new boardRecord", function() {
		return apiUtil().createBoardRecord(snapshot);
	});

	approveIt("should register board",function(){
		var storageMock = Storage();
		var boardRegistry;
		var setRegisteredBoards = spyOn(storageMock,"setRegisteredBoards").and.callFake(function(input){
			boardRegistry = input;
		});
		
		var getRegisteredBoards = spyOn(storageMock,"getRegisteredBoards").and.returnValue({});
		
		apiUtil(storageMock).registerBoard(snapshot);
		expect(getRegisteredBoards).toHaveBeenCalled();
		expect(setRegisteredBoards).toHaveBeenCalled();
		return boardRegistry; //('{"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_api/_backlog/GetBoard?__v=3":{"boardUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_backlogs/board/","apiUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_api/_backlog/GetBoard?__v=3","genericItemUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id="}}');
	});

	it("board should  updateBoardUrl",function(){
		var storageMock = Storage();
		var setRegisteredBoards = spyOn(storageMock,"setRegisteredBoards");
		var getRegisteredBoards = spyOn(storageMock,"getRegisteredBoards")
			.and.returnValue({"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_api/_backlog/GetBoard?__v=3":{"boardUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_backlogs/board/","apiUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_api/_backlog/GetBoard?__v=3","genericItemUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id="}});
		
		apiUtil(storageMock).registerBoard(snapshot);
		expect(getRegisteredBoards).toHaveBeenCalled();
		expect(setRegisteredBoards).toHaveBeenCalled();
	});

	it("should update boardUrl in storage",function(){
		var storageMock = Storage();
		var boardRegistry = {};
		var setRegisteredBoards = spyOn(storageMock,"setRegisteredBoards").and.callFake(function(input){
			boardRegistry = input;
		});
		var getRegisteredBoards = spyOn(storageMock,"getRegisteredBoards")
			.and.returnValue(_.cloneDeep(boardRegistryWithShortBoardUrl));
		apiUtil(storageMock).registerBoard(snapshot);
		expect(boardRegistry).jsonToBe(boardRegistryWithLongBoardUrl);
	});

	it("should use long boardUrl in storage",function(){
		var storageMock = Storage();
		var boardRegistry = {};
		var setRegisteredBoards = spyOn(storageMock,"setRegisteredBoards").and.callFake(function(input){
			boardRegistry = input;
		});
		var getRegisteredBoards = spyOn(storageMock,"getRegisteredBoards")
			.and.returnValue(_.cloneDeep(boardRegistryWithLongBoardUrl));
		apiUtil(storageMock).registerBoard(snapshotWithShortUrl);
		expect(boardRegistry).jsonToBe(boardRegistryWithLongBoardUrl);
	});



	it("should  get API Snapshot",function(){
		var storageMock = Storage();
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
