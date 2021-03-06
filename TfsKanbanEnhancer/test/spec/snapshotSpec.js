describe("Snapshot", function(){
	var _apiV5Response = {"boardSettings":{"id":"be94fdcf-3535-4a3f-a27b-951ad52cb483","extensionId":"4e1be94e-e50e-4634-9a6f-1ec2fb52574a","revision":5,"teamId":"41af1a67-a729-4771-9da0-c12964cdb46e","categoryReferenceName":"Microsoft.RequirementCategory","columns":[{"id":"9b93456b-6a9b-47d1-8f14-d48bf91b633e","name":"ToDo","order":0,"columnType":0,"itemLimit":0,"stateMappings":{"Bug":"New","Product Backlog Item":"New"},"isDeleted":false},{"id":"f07fe1ad-344b-4eb5-9c4c-f2c64a3f8527","name":"Req IP","order":1,"columnType":1,"itemLimit":1,"stateMappings":{"Bug":"Approved","Product Backlog Item":"Approved"},"isDeleted":false},{"id":"f2baebd8-a3c1-45f0-a276-054980ab0896","name":"Req DONE","order":2,"columnType":1,"itemLimit":0,"stateMappings":{"Bug":"Approved","Product Backlog Item":"Approved"},"isDeleted":false},{"id":"4ec134d9-244b-4fb9-9ac8-08f1d576712a","name":"Architecture IP","order":3,"columnType":1,"itemLimit":3,"stateMappings":{"Bug":"Approved","Product Backlog Item":"Approved"},"isDeleted":false},{"id":"552d61b8-39c8-4852-8799-57bdbff3a886","name":"Architecture DONE","order":4,"columnType":1,"itemLimit":0,"stateMappings":{"Bug":"Approved","Product Backlog Item":"Approved"},"isDeleted":false},{"id":"098e14c4-7241-40b1-a50d-db981568d20a","name":"Dev IP","order":5,"columnType":1,"itemLimit":5,"stateMappings":{"Bug":"Committed","Product Backlog Item":"Committed"},"isDeleted":false},{"id":"a8656ad0-beaa-42cf-9bb0-b708cb80324a","name":"Dev DONE","order":6,"columnType":1,"itemLimit":0,"stateMappings":{"Bug":"Committed","Product Backlog Item":"Committed"},"isDeleted":false},{"id":"fe2f03a7-5fb0-444b-8335-93f9fef1555c","name":"Test IP","order":7,"columnType":1,"itemLimit":5,"stateMappings":{"Bug":"Committed","Product Backlog Item":"Committed"},"isDeleted":false},{"id":"1583a451-e707-48df-a930-03244b4983d2","name":"Test DONE","order":8,"columnType":1,"itemLimit":0,"stateMappings":{"Bug":"Committed","Product Backlog Item":"Committed"},"isDeleted":false},{"id":"9e92b044-6f07-41cd-bf8c-25a31d9bf418","name":"Approval","order":9,"columnType":1,"itemLimit":5,"stateMappings":{"Bug":"Committed","Product Backlog Item":"Committed"},"isDeleted":false},{"id":"d789c97b-c87e-42de-9c18-9633750f7a2f","name":"Redy for production","order":10,"columnType":1,"itemLimit":5,"stateMappings":{"Bug":"Committed","Product Backlog Item":"Committed"},"isDeleted":false},{"id":"fedcbbb2-2f55-456e-baa2-8c9acdc35dd9","name":"In production","order":11,"columnType":2,"itemLimit":0,"stateMappings":{"Bug":"Done","Product Backlog Item":"Done"},"isDeleted":false}],"isValid":true,"allowedMappings":{"0":{"Bug":["New"],"Product Backlog Item":["New"]},"1":{"Bug":["Approved","Committed","New"],"Product Backlog Item":["Approved","Committed","New"]},"2":{"Bug":["Done"],"Product Backlog Item":["Done"]}},"canEdit":true},"board":{"node":{"fieldName":"WEF_4E1BE94EE50E46349A6F1EC2FB52574A_Kanban.Column","layoutStyle":"horizontal","members":[{"title":"ToDo","values":["ToDo"],"layoutOptions":{"cssClass":"single proposed"},"itemOrdering":{"id":"ProposedInProgressItemComparer","data":{"fields":{"orderField":"Microsoft.VSTS.Common.BacklogPriority"}}}},{"title":"Req IP","values":["Req IP"],"layoutOptions":{"cssClass":"stretch inprogress"},"itemOrdering":{"id":"ProposedInProgressItemComparer","data":{"fields":{"orderField":"Microsoft.VSTS.Common.BacklogPriority"}}},"limits":{"limit":1}},{"title":"Req DONE","values":["Req DONE"],"layoutOptions":{"cssClass":"stretch inprogress"},"itemOrdering":{"id":"ProposedInProgressItemComparer","data":{"fields":{"orderField":"Microsoft.VSTS.Common.BacklogPriority"}}},"limits":{"limit":0}},{"title":"Architecture IP","values":["Architecture IP"],"layoutOptions":{"cssClass":"stretch inprogress"},"itemOrdering":{"id":"ProposedInProgressItemComparer","data":{"fields":{"orderField":"Microsoft.VSTS.Common.BacklogPriority"}}},"limits":{"limit":3}},{"title":"Architecture DONE","values":["Architecture DONE"],"layoutOptions":{"cssClass":"stretch inprogress"},"itemOrdering":{"id":"ProposedInProgressItemComparer","data":{"fields":{"orderField":"Microsoft.VSTS.Common.BacklogPriority"}}},"limits":{"limit":0}},{"title":"Dev IP","values":["Dev IP"],"layoutOptions":{"cssClass":"stretch inprogress"},"itemOrdering":{"id":"ProposedInProgressItemComparer","data":{"fields":{"orderField":"Microsoft.VSTS.Common.BacklogPriority"}}},"limits":{"limit":5}},{"title":"Dev DONE","values":["Dev DONE"],"layoutOptions":{"cssClass":"stretch inprogress"},"itemOrdering":{"id":"ProposedInProgressItemComparer","data":{"fields":{"orderField":"Microsoft.VSTS.Common.BacklogPriority"}}},"limits":{"limit":0}},{"title":"Test IP","values":["Test IP"],"layoutOptions":{"cssClass":"stretch inprogress"},"itemOrdering":{"id":"ProposedInProgressItemComparer","data":{"fields":{"orderField":"Microsoft.VSTS.Common.BacklogPriority"}}},"limits":{"limit":5}},{"title":"Test DONE","values":["Test DONE"],"layoutOptions":{"cssClass":"stretch inprogress"},"itemOrdering":{"id":"ProposedInProgressItemComparer","data":{"fields":{"orderField":"Microsoft.VSTS.Common.BacklogPriority"}}},"limits":{"limit":0}},{"title":"Approval","values":["Approval"],"layoutOptions":{"cssClass":"stretch inprogress"},"itemOrdering":{"id":"ProposedInProgressItemComparer","data":{"fields":{"orderField":"Microsoft.VSTS.Common.BacklogPriority"}}},"limits":{"limit":5}},{"title":"Redy for production","values":["Redy for production"],"layoutOptions":{"cssClass":"stretch inprogress"},"itemOrdering":{"id":"ProposedInProgressItemComparer","data":{"fields":{"orderField":"Microsoft.VSTS.Common.BacklogPriority"}}},"limits":{"limit":5}},{"title":"In production","values":["In production"],"layoutOptions":{"cssClass":"single complete"},"itemOrdering":{"id":"CompletedItemComparer","data":{"fields":{"closedDateField":"Microsoft.VSTS.Common.ClosedDate"}}}}]},"fields":{"Activity":"Microsoft.VSTS.Common.Activity","Order":"Microsoft.VSTS.Common.BacklogPriority","ApplicationLaunchInstructions":"Microsoft.VSTS.Feedback.ApplicationLaunchInstructions","ApplicationStartInformation":"Microsoft.VSTS.Feedback.ApplicationStartInformation","ApplicationType":"Microsoft.VSTS.Feedback.ApplicationType","Effort":"Microsoft.VSTS.Scheduling.Effort","RemainingWork":"Microsoft.VSTS.Scheduling.RemainingWork","Team":"System.AreaPath"},"membership":{"id":"TeamMembership"}},"itemSource":{"type":"wit","transitions":{"Product Backlog Item":{"ToDo":["Dev IP","Dev DONE","Test IP","Test DONE","Approval","Redy for production","Req IP","Req DONE","Architecture IP","Architecture DONE","In production"],"Req IP":["Req DONE","Architecture IP","Architecture DONE","Dev IP","Dev DONE","Test IP","Test DONE","Approval","Redy for production","ToDo","In production"],"Req DONE":["Req IP","Architecture IP","Architecture DONE","Dev IP","Dev DONE","Test IP","Test DONE","Approval","Redy for production","ToDo","In production"],"Architecture IP":["Req IP","Req DONE","Architecture DONE","Dev IP","Dev DONE","Test IP","Test DONE","Approval","Redy for production","ToDo","In production"],"Architecture DONE":["Req IP","Req DONE","Architecture IP","Dev IP","Dev DONE","Test IP","Test DONE","Approval","Redy for production","ToDo","In production"],"Dev IP":["Dev DONE","Test IP","Test DONE","Approval","Redy for production","Req IP","Req DONE","Architecture IP","Architecture DONE","ToDo","In production"],"Dev DONE":["Dev IP","Test IP","Test DONE","Approval","Redy for production","Req IP","Req DONE","Architecture IP","Architecture DONE","ToDo","In production"],"Test IP":["Dev IP","Dev DONE","Test DONE","Approval","Redy for production","Req IP","Req DONE","Architecture IP","Architecture DONE","ToDo","In production"],"Test DONE":["Dev IP","Dev DONE","Test IP","Approval","Redy for production","Req IP","Req DONE","Architecture IP","Architecture DONE","ToDo","In production"],"Approval":["Dev IP","Dev DONE","Test IP","Test DONE","Redy for production","Req IP","Req DONE","Architecture IP","Architecture DONE","ToDo","In production"],"Redy for production":["Dev IP","Dev DONE","Test IP","Test DONE","Approval","Req IP","Req DONE","Architecture IP","Architecture DONE","ToDo","In production"],"In production":["Dev IP","Dev DONE","Test IP","Test DONE","Approval","Redy for production","Req IP","Req DONE","Architecture IP","Architecture DONE","ToDo"]},"Bug":{"ToDo":["Dev IP","Dev DONE","Test IP","Test DONE","Approval","Redy for production","Req IP","Req DONE","Architecture IP","Architecture DONE","In production"],"Req IP":["Req DONE","Architecture IP","Architecture DONE","Dev IP","Dev DONE","Test IP","Test DONE","Approval","Redy for production","ToDo","In production"],"Req DONE":["Req IP","Architecture IP","Architecture DONE","Dev IP","Dev DONE","Test IP","Test DONE","Approval","Redy for production","ToDo","In production"],"Architecture IP":["Req IP","Req DONE","Architecture DONE","Dev IP","Dev DONE","Test IP","Test DONE","Approval","Redy for production","ToDo","In production"],"Architecture DONE":["Req IP","Req DONE","Architecture IP","Dev IP","Dev DONE","Test IP","Test DONE","Approval","Redy for production","ToDo","In production"],"Dev IP":["Dev DONE","Test IP","Test DONE","Approval","Redy for production","Req IP","Req DONE","Architecture IP","Architecture DONE","ToDo","In production"],"Dev DONE":["Dev IP","Test IP","Test DONE","Approval","Redy for production","Req IP","Req DONE","Architecture IP","Architecture DONE","ToDo","In production"],"Test IP":["Dev IP","Dev DONE","Test DONE","Approval","Redy for production","Req IP","Req DONE","Architecture IP","Architecture DONE","ToDo","In production"],"Test DONE":["Dev IP","Dev DONE","Test IP","Approval","Redy for production","Req IP","Req DONE","Architecture IP","Architecture DONE","ToDo","In production"],"Approval":["Dev IP","Dev DONE","Test IP","Test DONE","Redy for production","Req IP","Req DONE","Architecture IP","Architecture DONE","ToDo","In production"],"Redy for production":["Dev IP","Dev DONE","Test IP","Test DONE","Approval","Req IP","Req DONE","Architecture IP","Architecture DONE","ToDo","In production"],"In production":["Dev IP","Dev DONE","Test IP","Test DONE","Approval","Redy for production","Req IP","Req DONE","Architecture IP","Architecture DONE","ToDo"]}},"payload":{"columns":["System.Id","System.State","System.IterationPath","System.AssignedTo","System.Title","System.WorkItemType","System.ChangedDate","Microsoft.VSTS.Common.ClosedDate","System.AreaPath","Microsoft.VSTS.Scheduling.Effort","Microsoft.VSTS.Common.BacklogPriority","WEF_4E1BE94EE50E46349A6F1EC2FB52574A_Kanban.Column","WEF_4E1BE94EE50E46349A6F1EC2FB52574A_System.ExtensionMarker"],"rows":[[10,"Approved","tfsDataCollection",null,"SPIKE spike 1 |project","Product Backlog Item","\/Date(1419068502570)\/",null,"tfsDataCollection",null,999778655,"Req DONE",true],[9,"Committed","tfsDataCollection",null,"FD 2014-10-10 #123 bla bla bla |maint","Product Backlog Item","\/Date(1417300528973)\/",null,"tfsDataCollection",null,999810274,"Dev DONE",true],[7,"Approved","tfsDataCollection\\Release 1\\Sprint 1",null,"MAINT #111 fixa","Product Backlog Item","\/Date(1419889935037)\/",null,"tfsDataCollection",null,999841894,"Architecture DONE",true],[8,"Committed","tfsDataCollection",null,"TEST testing","Product Backlog Item","\/Date(1417300531480)\/",null,"tfsDataCollection",null,999857704,"Dev IP",true],[6,"Committed","tfsDataCollection",null,"SUPPORT #not support","Product Backlog Item","\/Date(1414871098557)\/",null,"tfsDataCollection",null,999873514,"Test IP",true],[5,"Committed","tfsDataCollection",null,"BUG #3587 critical","Product Backlog Item","\/Date(1407764699973)\/",null,"tfsDataCollection",null,999905135,"Test IP",true],[4,"Committed","tfsDataCollection",null,"AT #111 Test4","Product Backlog Item","\/Date(1414871090467)\/",null,"tfsDataCollection",null,999936756,"Test IP",true],[3,"Committed","tfsDataCollection",null,"* CR #113 Test3","Product Backlog Item","\/Date(1414871085633)\/",null,"tfsDataCollection",null,999968378,"Test IP",true],[1,"Committed","tfsDataCollection",null,"CR #111 Test1","Product Backlog Item","\/Date(1414871080130)\/",null,"tfsDataCollection",null,1000000000,"Test IP",true],[2,"Committed","tfsDataCollection",null,"! CR #112 Test 2","Product Backlog Item","\/Date(1414871082903)\/",null,"tfsDataCollection",null,1000031622,"Test IP",true]],"hierarchy":{}},"limitReached":false}};
	var _lanes = [{"name":"ToDo","wip":{"limit":0}},{"name":"Req IP","wip":{"limit":1}},{"name":"Req DONE","wip":{"limit":0}},{"name":"Architecture IP","wip":{"limit":3}},{"name":"Architecture DONE","wip":{"limit":0}},{"name":"Dev IP","wip":{"limit":5}},{"name":"Dev DONE","wip":{"limit":0}},{"name":"Test IP","wip":{"limit":5}},{"name":"Test DONE","wip":{"limit":0}},{"name":"Approval","wip":{"limit":5}},{"name":"Redy for production","wip":{"limit":5}},{"name":"In production","wip":{"limit":0}}];
	var _tickets = [{"id":10,"title":"SPIKE spike 1 |project","lane":"Req DONE"},{"id":9,"title":"FD 2014-10-10 #123 bla bla bla |maint","lane":"Dev DONE"},{"id":7,"title":"MAINT #111 fixa","lane":"Architecture DONE"},{"id":8,"title":"TEST testing","lane":"Dev IP"},{"id":6,"title":"SUPPORT #not support","lane":"Test IP"},{"id":5,"title":"BUG #3587 critical","lane":"Test IP"},{"id":4,"title":"AT #111 Test4","lane":"Test IP"},{"id":3,"title":"* CR #113 Test3","lane":"Test IP"},{"id":1,"title":"CR #111 Test1","lane":"Test IP"},{"id":2,"title":"! CR #112 Test 2","lane":"Test IP"}] ;
	var _boardSnapshot = {"milliseconds":10000,"board":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection","genericItemUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=","lanes":[{"name":"ToDo","tickets":[]},{"name":"Req IP","wip":{"current":"1","limit":"1"},"tickets":[]},{"name":"Req DONE","wip":{"current":"0","limit":"0"},"tickets":[{"id":"10","title":"SPIKE spike 1 |project"}]},{"name":"Architecture IP","wip":{"current":"1","limit":"3"},"tickets":[]},{"name":"Architecture DONE","wip":{"current":"0","limit":"0"},"tickets":[{"id":"7","title":"MAINT #111 fixa"}]},{"name":"Dev IP","wip":{"current":"2","limit":"5"},"tickets":[{"id":"8","title":"TEST testing"}]},{"name":"Dev DONE","wip":{"current":"0","limit":"0"},"tickets":[{"id":"9","title":"FD 2014-10-10 #123 bla bla bla |maint"}]},{"name":"Test IP","wip":{"current":"6","limit":"5"},"tickets":[{"id":"6","title":"SUPPORT #not support"},{"id":"5","title":"BUG #3587 critical"},{"id":"4","title":"AT #111 Test4"},{"id":"3","title":"* CR #113 Test3"},{"id":"1","title":"CR #111 Test1"},{"id":"2","title":"! CR #112 Test 2"}]},{"name":"Test DONE","wip":{"current":"0","limit":"0"},"tickets":[]},{"name":"Approval","wip":{"current":"0","limit":"5"},"tickets":[]},{"name":"Redy for production","wip":{"current":"0","limit":"5"},"tickets":[]},{"name":"In production","tickets":[]}]} ;
	var _apiSnapshot = {"milliseconds":20000,"board":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection","genericItemUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=","lanes":[{"name":"ToDo","tickets":[]},{"name":"Req IP","wip":{"limit":"1","current":"0"},"tickets":[]},{"name":"Req DONE","wip":{"limit":"0","current":"1"},"tickets":[{"id":"10","title":"SPIKE spike 1 |project"}]},{"name":"Architecture IP","wip":{"limit":"3","current":"0"},"tickets":[]},{"name":"Architecture DONE","wip":{"limit":"0","current":"1"},"tickets":[{"id":"7","title":"MAINT #111 fixa"}]},{"name":"Dev IP","wip":{"limit":"5","current":"1"},"tickets":[{"id":"8","title":"TEST testing"}]},{"name":"Dev DONE","wip":{"limit":"0","current":"1"},"tickets":[{"id":"9","title":"FD 2014-10-10 #123 bla bla bla |maint"}]},{"name":"Test IP","wip":{"limit":"5","current":"6"},"tickets":[{"id":"6","title":"SUPPORT #not support"},{"id":"5","title":"BUG #3587 critical"},{"id":"4","title":"AT #111 Test4"},{"id":"3","title":"* CR #113 Test3"},{"id":"1","title":"CR #111 Test1"},{"id":"2","title":"! CR #112 Test 2"}]},{"name":"Test DONE","wip":{"limit":"0","current":"0"},"tickets":[]},{"name":"Approval","wip":{"limit":"5","current":"0"},"tickets":[]},{"name":"Redy for production","wip":{"limit":"5","current":"0"},"tickets":[]},{"name":"In production","tickets":[]}]};
	
	

	it("board Should Not Have changed",function(){
		var boardData = new BoardData();
		
		boardData.addSnapshot(_boardSnapshot);
		expect(boardData.boardHasNotChanged(new Snapshot(_apiSnapshot))).toBe(true);
	});

	it("board Should Have changed when lane name has changed",function(){
		var boardData = new BoardData();
		var apiSnapshot = new Snapshot(_apiSnapshot);
		apiSnapshot.lanes[0].name = "att göra";
		boardData.addSnapshot(_boardSnapshot);
		expect(boardData.boardHasNotChanged(apiSnapshot)).toBe(false);
	});

	it("board Should Have changed when ticket has moved",function(){
		var boardData = new BoardData();
		boardData.addSnapshot(simpleSnapshot(10000,[createSnapshotTicket(1,"test")],[],[],[]));
		expect(boardData.boardHasNotChanged(simpleSnapshot(20000,[],[createSnapshotTicket(1,"test")],[],[]))).toBe(false);
	});

	it("board Should Have changed when ticket title has changed",function(){
		var boardData = new BoardData();
		boardData.addSnapshot(simpleSnapshot(10000,[createSnapshotTicket(1,"test")],[],[],[]));
		expect(boardData.boardHasNotChanged(simpleSnapshot(20000,[createSnapshotTicket(1,"test 1")],[],[],[]))).toBe(false);
	});

	it("board Should Have changed when wip limit has changed",function(){
		var boardData = new BoardData();
		var snapshot = simpleSnapshot(20000,[createSnapshotTicket(1,"test")],[],[],[]);
		snapshot.lanes[1].wip.limit = 10;
		boardData.addSnapshot(simpleSnapshot(10000,[createSnapshotTicket(1,"test")],[],[],[]));
		expect(boardData.boardHasNotChanged(snapshot)).toBe(false);
	});

	it("board Should not have changed for identical snapshots",function(){
		var boardData = new BoardData();
		boardData.addSnapshot(simpleSnapshot(10000,[createSnapshotTicket(1,"test")],[],[],[]));
		expect(boardData.boardHasNotChanged(simpleSnapshot(20000,[createSnapshotTicket(1,"test")],[],[],[]))).toBe(true);
	});

	it("board Should not have changed for changed ticketorder in lane",function(){
		var boardData = new BoardData();
		boardData.addSnapshot(simpleSnapshot(10000,[createSnapshotTicket(1,"test"),createSnapshotTicket(2,"test2")],[],[],[]));
		expect(boardData.boardHasNotChanged(simpleSnapshot(20000,[createSnapshotTicket(1,"test"),createSnapshotTicket(2,"test2")],[],[],[]))).toBe(true);
	});

	it("should be only one snapshotRecord and one boardDesignRecord",function(){
		var boardData = new BoardData();
		
		boardData.addSnapshot(_boardSnapshot);
		boardData.addSnapshot(_apiSnapshot);
		expect(boardData.snapshotRecords.length).toBe(1);
		expect(boardData.boardDesignHistory.boardDesignRecords.length).toBe(1);

	});

	it("should be blocked",function(){
		var boardData = new BoardData();
		boardData.setBlockedPrefix("*");
		boardData.addSnapshot(simpleSnapshot(10000,[createSnapshotTicket(1,"* test")],[],[],[]));
		expect(boardData.flowData[1].isBlocked).toBe(true);

	});



    it("should get 2015 api url", function (){
        var snapshot = simpleSnapshot(10,[],[],[],[]);
        var boardRecord;
        snapshot.boardUrl = "http://tfs2010.it.volvo.net:8080/tfs/Global/SEGOT-eCom-VolvoPentaShop/PentaBusiness/_backlogs/board";
        snapshot.projectName = "SEGOT-eCom-VolvoPentaShop";
        snapshot.cardCategory = "pyttemjuk.kortKategori";
        snapshot.boardId ="TestBoardId";
        boardRecord = new BoardRecord(snapshot);
        expect(boardRecord.getBoardApiUrl()).toBe("http://tfs2010.it.volvo.net:8080/tfs/Global/TestBoardId/_api/_backlog/GetBoard?__v=5&hubCategoryReferenceName=pyttemjuk.kortKategori");
    });
});




describe("http.get apiSnapshot", function (){
	var apiUrl = "data/snapshotApi.json";
	var boardUrl = "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_backlogs/board/";
	var apiSnapshot;
	beforeEach(function(done){
		var boardRecord = new BoardRecord({"boardUrl":boardUrl,"cardCategory":"custom","projectName" : "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection"})
        var api;
        boardRecord.getBoardApiUrl = function(){return apiUrl};
        api = new ApiSnapshot($,timeUtil,boardRecord);
		api.getSnapshot( function(snapshot){
			console.log ("apiSnapshot = " + snapshot);
			apiSnapshot = snapshot;
			done();
		});
	});

	

	approveIt("should getsnapshot from Api",function(approvals){
		apiSnapshot.milliseconds = 10000;
		approvals.verify(apiSnapshot);
	});
});

describe("http.get 2015 apiSnapshot", function (){
    var apiUrl = "data/newBoardApi.json";
    var boardUrl = "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_backlogs/board/";
    var apiSnapshot;
    beforeEach(function(done){
        var boardRecord = new BoardRecord({"boardUrl":boardUrl,"cardCategory":"custom","projectName" : "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection"})
        var api;
        boardRecord.getBoardApiUrl = function(){return apiUrl};
        api = new ApiSnapshot($,timeUtil,boardRecord);
        api.getSnapshot( function(snapshot){
            console.log ("apiSnapshot = " + snapshot);
            apiSnapshot = snapshot;
            done();
        });
    });



    approveIt("should getsnapshot from 2015 Api",function(approvals){
        apiSnapshot.milliseconds = 10000;
        approvals.verify(apiSnapshot);
    });
});

describe("http.get apiSnapshot", function (){
    var apiUrl = "data/snapshotApi.json";
    var boardUrl = "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_backlogs/board/";
    var apiSnapshot;
    beforeEach(function(done){
        var boardRecord = new BoardRecord({"boardUrl":boardUrl,"cardCategory":"custom",
                "projectName" : "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection",
                "__RequestVerificationToken" : "requestToken"})
        var api;
        boardRecord.getBoardApiUrl = function(){return apiUrl};
        api = new ApiSnapshot($,timeUtil,boardRecord);
        api.getSnapshot( function(snapshot){
            console.log ("apiSnapshot = " + snapshot);
            apiSnapshot = snapshot;
            done();
        });
    });



    approveIt("should getsnapshot from Api with RequestToken",function(approvals){
        apiSnapshot.milliseconds = 10000;
        approvals.verify(apiSnapshot);
    });
});

describe("API snapshots",function(){

	it("boardSnapshot and apiSnapshot should be same",function(){
		var apiSnapshot = new Snapshot({"milliseconds":1420066405840,"board":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection","genericItemUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=","lanes":[{"name":"ToDo","wip":{"limit":0,"current":0},"tickets":[]},{"name":"Req IP","wip":{"limit":1,"current":0},"tickets":[]},{"name":"Req DONE","wip":{"limit":0,"current":1},"tickets":[{"id":"10","title":"SPIKE spike 1 |project"}]},{"name":"Architecture IP","wip":{"limit":3,"current":0},"tickets":[]},{"name":"Architecture DONE","wip":{"limit":0,"current":1},"tickets":[{"id":"7","title":"MAINT #111 fixa"}]},{"name":"Dev IP","wip":{"limit":5,"current":1},"tickets":[{"id":"8","title":"TEST testing"}]},{"name":"Dev DONE","wip":{"limit":0,"current":1},"tickets":[{"id":"9","title":"FD 2014-10-10 #123 bla bla bla |maint"}]},{"name":"Test IP","wip":{"limit":5,"current":5},"tickets":[{"id":"5","title":"BUG #3587 critical"},{"id":"4","title":"AT #111 Test4"},{"id":"3","title":"* CR #113 Test3"},{"id":"1","title":"CR #111 Test1"},{"id":"2","title":"! CR #112 Test 2"}]},{"name":"Test DONE","wip":{"limit":0,"current":1},"tickets":[{"id":"6","title":"SUPPORT #not support"}]},{"name":"Approval","wip":{"limit":5,"current":0},"tickets":[]},{"name":"Redy for production","wip":{"limit":5,"current":0},"tickets":[]},{"name":"In production","wip":{"limit":0,"current":0},"tickets":[]}]}) ;
		var boardSnapshot =  new Snapshot({"milliseconds":1420066186640,"board":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection","genericItemUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=","lanes":[{"name":"ToDo","wip":{"limit":0},"tickets":[]},{"name":"Req IP","wip":{"limit":1,"current":1},"tickets":[]},{"name":"Req DONE","wip":{"limit":0,"current":0},"tickets":[{"id":"10","title":"SPIKE spike 1 |project"}]},{"name":"Architecture IP","wip":{"limit":3,"current":1},"tickets":[]},{"name":"Architecture DONE","wip":{"limit":0,"current":0},"tickets":[{"id":"7","title":"MAINT #111 fixa"}]},{"name":"Dev IP","wip":{"limit":5,"current":2},"tickets":[{"id":"8","title":"TEST testing"}]},{"name":"Dev DONE","wip":{"limit":0,"current":0},"tickets":[{"id":"9","title":"FD 2014-10-10 #123 bla bla bla |maint"}]},{"name":"Test IP","wip":{"limit":5,"current":6},"tickets":[{"id":"5","title":"BUG #3587 critical"},{"id":"4","title":"AT #111 Test4"},{"id":"3","title":"* CR #113 Test3"},{"id":"1","title":"CR #111 Test1"},{"id":"2","title":"! CR #112 Test 2"}]},{"name":"Test DONE","wip":{"limit":0,"current":0},"tickets":[{"id":"6","title":"SUPPORT #not support"}]},{"name":"Approval","wip":{"limit":5,"current":0},"tickets":[]},{"name":"Redy for production","wip":{"limit":5,"current":0},"tickets":[]},{"name":"In production","wip":{"limit":0},"tickets":[]}]}) ;
		
		expect(apiSnapshot.equals(boardSnapshot)).toBe(true);
	});
	
	approveIt("boardData with one Board and one Api snapshot",function(approvals){
		var apiSnapshot = {"milliseconds":1420066405840,"board":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection","genericItemUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=","lanes":[{"name":"ToDo","wip":{"limit":0,"current":0},"tickets":[]},{"name":"Req IP","wip":{"limit":1,"current":0},"tickets":[]},{"name":"Req DONE","wip":{"limit":0,"current":1},"tickets":[{"id":"10","title":"SPIKE spike 1 |project"}]},{"name":"Architecture IP","wip":{"limit":3,"current":0},"tickets":[]},{"name":"Architecture DONE","wip":{"limit":0,"current":1},"tickets":[{"id":"7","title":"MAINT #111 fixa"}]},{"name":"Dev IP","wip":{"limit":5,"current":1},"tickets":[{"id":"8","title":"TEST testing"}]},{"name":"Dev DONE","wip":{"limit":0,"current":1},"tickets":[{"id":"9","title":"FD 2014-10-10 #123 bla bla bla |maint"}]},{"name":"Test IP","wip":{"limit":5,"current":5},"tickets":[{"id":"5","title":"BUG #3587 critical"},{"id":"4","title":"AT #111 Test4"},{"id":"3","title":"* CR #113 Test3"},{"id":"1","title":"CR #111 Test1"},{"id":"2","title":"! CR #112 Test 2"}]},{"name":"Test DONE","wip":{"limit":0,"current":1},"tickets":[{"id":"6","title":"SUPPORT #not support"}]},{"name":"Approval","wip":{"limit":5,"current":0},"tickets":[]},{"name":"Redy for production","wip":{"limit":5,"current":0},"tickets":[]},{"name":"In production","wip":{"limit":0,"current":0},"tickets":[]}]} ;
		var boardSnapshot =  {"milliseconds":1420066186640,"board":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection","genericItemUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=","lanes":[{"name":"ToDo","wip":{"limit":0},"tickets":[]},{"name":"Req IP","wip":{"limit":1,"current":1},"tickets":[]},{"name":"Req DONE","wip":{"limit":0,"current":0},"tickets":[{"id":"10","title":"SPIKE spike 1 |project"}]},{"name":"Architecture IP","wip":{"limit":3,"current":1},"tickets":[]},{"name":"Architecture DONE","wip":{"limit":0,"current":0},"tickets":[{"id":"7","title":"MAINT #111 fixa"}]},{"name":"Dev IP","wip":{"limit":5,"current":2},"tickets":[{"id":"8","title":"TEST testing"}]},{"name":"Dev DONE","wip":{"limit":0,"current":0},"tickets":[{"id":"9","title":"FD 2014-10-10 #123 bla bla bla |maint"}]},{"name":"Test IP","wip":{"limit":5,"current":6},"tickets":[{"id":"5","title":"BUG #3587 critical"},{"id":"4","title":"AT #111 Test4"},{"id":"3","title":"* CR #113 Test3"},{"id":"1","title":"CR #111 Test1"},{"id":"2","title":"! CR #112 Test 2"}]},{"name":"Test DONE","wip":{"limit":0,"current":0},"tickets":[{"id":"6","title":"SUPPORT #not support"}]},{"name":"Approval","wip":{"limit":5,"current":0},"tickets":[]},{"name":"Redy for production","wip":{"limit":5,"current":0},"tickets":[]},{"name":"In production","wip":{"limit":0},"tickets":[]}]} ;
		var boardData = new BoardData();
		boardData.setBlockedPrefix("*");
		boardData.addSnapshot(boardSnapshot);
		boardData.addSnapshot(apiSnapshot);
		approvals.verify(boardData);
	});
	

});