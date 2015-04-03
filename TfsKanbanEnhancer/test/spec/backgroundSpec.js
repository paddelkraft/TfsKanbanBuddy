var boardApiResponcePlain = {"boardSettings":{"id":"70127d15-57d5-4a7e-866b-e5a1cd9002ce","extensionId":"288bdc8a-0f49-4c93-8197-f14cdc35302d","revision":1,"teamId":"41af1a67-a729-4771-9da0-c12964cdb46e","categoryReferenceName":"Microsoft.FeatureCategory","columns":[{"id":"8f1ab1d1-4d12-4311-80a6-e97823630341","name":"New","order":0,"columnType":0,"itemLimit":0,"stateMappings":{"Feature":"New"},"isDeleted":false,"isSplit":false,"description":null},{"id":"ce29f831-854d-41d6-bf07-689f4d893df4","name":"In Progress","order":1,"columnType":1,"itemLimit":5,"stateMappings":{"Feature":"In Progress"},"isDeleted":false,"isSplit":false,"description":null},{"id":"e8f7454e-fee2-4870-b7c2-630656dd23c7","name":"Done","order":2,"columnType":2,"itemLimit":0,"stateMappings":{"Feature":"Done"},"isDeleted":false,"isSplit":false,"description":null}],"isValid":true,"allowedMappings":{"0":{"Feature":["New"]},"1":{"Feature":["In Progress","New"]},"2":{"Feature":["Done"]}},"canEdit":true,"isSplitColumnFeatureEnabled":true,"isColumnDescriptionFeatureEnabled":true},"board":{"node":{"fieldName":"WEF_288BDC8A0F494C938197F14CDC35302D_Kanban.Column","layoutStyle":"horizontal","members":[{"title":"New","values":["New"],"canCreateNewItems":true,"layoutOptions":{"cssClass":"proposed"},"itemOrdering":{"id":"ProposedInProgressItemComparer","data":{"fields":{"orderField":"Microsoft.VSTS.Common.BacklogPriority"}}},"metadata":{"boardColumnType":"Incoming"},"handlesNull":false},{"title":"In Progress","values":["In Progress"],"canCreateNewItems":false,"layoutOptions":{"cssClass":"inprogress"},"itemOrdering":{"id":"ProposedInProgressItemComparer","data":{"fields":{"orderField":"Microsoft.VSTS.Common.BacklogPriority"}}},"limits":{"limit":5},"metadata":{"boardColumnType":"InProgress"},"handlesNull":false},{"title":"Done","values":["Done"],"canCreateNewItems":false,"layoutOptions":{"cssClass":"complete"},"itemOrdering":{"id":"CompletedItemComparer","data":{"fields":{"closedDateField":"Microsoft.VSTS.Common.ClosedDate"}}},"metadata":{"boardColumnType":"Outgoing"},"handlesNull":false}]},"fields":{"Activity":"Microsoft.VSTS.Common.Activity","Order":"Microsoft.VSTS.Common.BacklogPriority","ApplicationLaunchInstructions":"Microsoft.VSTS.Feedback.ApplicationLaunchInstructions","ApplicationStartInformation":"Microsoft.VSTS.Feedback.ApplicationStartInformation","ApplicationType":"Microsoft.VSTS.Feedback.ApplicationType","Effort":"Microsoft.VSTS.Scheduling.Effort","RemainingWork":"Microsoft.VSTS.Scheduling.RemainingWork","Team":"System.AreaPath"},"membership":{"id":"TeamMembership"}},"itemSource":{"type":"wit","transitions":{"Feature":{"New":["Done","In Progress"],"In Progress":["New","Done"],"Done":["New","In Progress"]}},"payload":{"columns":["System.Id","System.State","System.IterationPath","System.AssignedTo","System.Title","System.WorkItemType","System.ChangedDate","Microsoft.VSTS.Common.ClosedDate","System.AreaPath","Microsoft.VSTS.Scheduling.Effort","Microsoft.VSTS.Common.BacklogPriority","WEF_288BDC8A0F494C938197F14CDC35302D_Kanban.Column","WEF_288BDC8A0F494C938197F14CDC35302D_System.ExtensionMarker","WEF_288BDC8A0F494C938197F14CDC35302D_Kanban.Column.Done"],"rows":[[28,"In Progress","tfsDataCollection",null,"test2","Feature","\/Date(1426578531230)\/",null,"tfsDataCollection",null,1999955279,"In Progress",true,false],[25,"New","tfsDataCollection",null,"Test","Feature","\/Date(1425324618450)\/",null,"tfsDataCollection",null,null,"New",true,false]],"hierarchy":{}},"limitReached":false,"workItemTypes":["Feature"]}};

function LocalStorageMock(){
    var mock = {
                "data":{},
                "log":[]
                };

    function log(call,key,content){
        mock.log.push({
            "call":call,
            "key":key,
            "content":content
        });
    }

    mock.setItem = function(key,content){
        log("setItem",key,jsonDecode(content));
        mock.data[key]=content;
    };

    mock.getItem = function(key){
        log("getItem",key,jsonDecode(mock.data[key]));
        console.log("Data retrieved = " + mock.data[key]);
        return mock.data[key];
    };

    return mock
}



describe("messageHandling",function(){

    function JqMock(response){
        return {"get":function(apiUrl,callback){
                console.log("jqMock.get("+apiUrl+")");
                callback(response, "success");
            },"post":function(url,content,callback){
                console.log("jqMock.get("+url+")");
                callback(response, "success");
            }
        }
    }

    var mockedLocalStorage;
    var storageUtil;
    var buddyDB;
    var responseLog;
    var getApiSnapshot;

    function responseCallback(response){
        responseLog.push(response);
    }

    function buildApprovalObject(){
        if(mockedLocalStorage.data["settings-updated"]){
            mockedLocalStorage.data["settings-updated"] = "2015-01-30 23:01"
        }
        _forEachIndex(mockedLocalStorage.data,function(entry,key){
            mockedLocalStorage.data[key] = jsonDecode(entry);
        });
        _.forEach(mockedLocalStorage.log, function (entry){
            if(entry.key === "settings-updated"){
                entry.content = "2015-01-30 23:01";
            }
        });
        return {
            "responseLog":responseLog,
            "storage":mockedLocalStorage
        }
    }

    beforeEach(function(){
        mockedLocalStorage = new LocalStorageMock();
        storageUtil = new StorageUtil(mockedLocalStorage);
        buddyDB = new BuddyDB(storageUtil,ApiUtil(),TfsApi(TimeUtil(),JqMock("Empty response")));
        responseLog =[];
        getApiSnapshot = _.curry(apiInvocation().getApiSnapshot)(buddyDB,JqMock({}));

    });

    approveIt("get-set-settings", function(approvals){
        var request ={"type":"set-settings" };
        request.settings ={};
        request.settings.boardLinks = _storedLinks;
        request.settings.kanbanBoardColorMap = _storageColorMap;
        request.settings.kanbanBoardDescriptionMap = _storageDescriptionMap;
        request.settings.taskBoardColorMap = _storageColorMap;
        request.settings.taskBoardDescriptionMap = _storageDescriptionMap;
        messageHandler(buddyDB, getApiSnapshot,request,{},responseCallback)
        messageHandler(buddyDB, getApiSnapshot,{"type":"get-settings"},{},responseCallback)
        approvals.verify(buildApprovalObject());

    });

    approveIt("get-set-settings empty", function(approvals){
        var request ={"type":"set-settings" };

        request.settings ={};
        messageHandler(buddyDB, getApiSnapshot,request,{},responseCallback)
        messageHandler(buddyDB, getApiSnapshot,{"type":"get-settings"},{},responseCallback)
        approvals.verify(buildApprovalObject());

    });

    approveIt("get-flow-data", function(approvals){
        var boardData = boardDataWith1Snapdhot();
        boardData.boardUrl = "http://boardurl.com/_backlogs/board/Backlog%20items";
        mockedLocalStorage.data["snapshots_"+ boardData.boardUrl] = jsonEncode(boardData);
        messageHandler(buddyDB, getApiSnapshot,{"type":"get-flow-data","boardUrl":boardData.boardUrl},{},responseCallback)
        approvals.verify(buildApprovalObject());

    });

    approveIt("save-snapshot", function(approvals){
        var request ={"type":"trigger-snapshot" };
        var timeUtil = new TimeUtil();
        var tfsApi = TfsApi(timeUtil,JqMock(boardApiResponcePlain));
        timeUtil.now = function(){return new Date(1000000);};
        buddyDB = new BuddyDB(storageUtil,ApiUtil(),tfsApi);
        request.snapshot = simpleSnapshot(1000000,[createSnapshotTicket(1,"test")]);
        request.snapshot.boardUrl = "http://boardurl.com/_backlogs/board/Backlog%20items";
        getApiSnapshot = _.curry(apiInvocation().getApiSnapshot)(buddyDB,tfsApi);
        messageHandler(buddyDB, getApiSnapshot,request,{},responseCallback)
        approvals.verify(buildApprovalObject());

    });

    approveIt("(background BuddyDB)save-snapshot with removed ticket", function(approvals){
        var snapshot = simpleSnapshot(1000000,[createSnapshotTicket(1,"test"),createSnapshotTicket(16,"test")]);
        snapshot.boardUrl = "http://boardurl.com/_backlogs/board/Backlog%20items"
        var timeUtil = new TimeUtil();
        var tfsApi = TfsApi(timeUtil,JqMock({"count":1,"value":[{"id":16,"rev":6,"fields":{"System.State":"Removed"},"url":"https://paddelkraft.visualstudio.com/DefaultCollection/_apis/wit/workItems/16"}]}));
        timeUtil.now = function(){return new Date(1000000);};
        buddyDB = new BuddyDB(storageUtil,ApiUtil(),tfsApi);

        buddyDB.saveSnapshot(snapshot);
        snapshot = simpleSnapshot(2000000,[createSnapshotTicket(1,"test")]);
        snapshot.boardUrl = "http://boardurl.com/_backlogs/board/Backlog%20items"
        buddyDB.saveSnapshot(snapshot);
        approvals.verify(jsonDecode(mockedLocalStorage.data["snapshots_http://boardurl.com/_backlogs/board/Backlog%20items"]).flowData["16"]);

    });

    approveIt("(background BuddyDB)save-snapshot with removed ticket using POST api", function(approvals){
        var snapshot = simpleSnapshot(1000000,[createSnapshotTicket(1,"test"),createSnapshotTicket(16,"test")]);
        snapshot.boardUrl = "http://boardurl.com/_backlogs/board/Backlog%20items"

        var timeUtil = new TimeUtil();
        var tfsApi = TfsApi(timeUtil,JqMock({"columns":["System.Id","System.State"],"rows":[[16,"Removed"]]}));
        timeUtil.now = function(){return new Date(1000000);};
        buddyDB = new BuddyDB(storageUtil,ApiUtil(),tfsApi);
        snapshot.__RequestVerificationToken = "requestToken";
        buddyDB.saveSnapshot(snapshot);
        snapshot = simpleSnapshot(2000000,[createSnapshotTicket(1,"test")]);
        snapshot.boardUrl = "http://boardurl.com/_backlogs/board/Backlog%20items"
        snapshot.__RequestVerificationToken = "requestToken";
        buddyDB.saveSnapshot(snapshot);
        approvals.verify(jsonDecode(mockedLocalStorage.data["snapshots_http://boardurl.com/_backlogs/board/Backlog%20items"]).flowData["16"]);

    });
});