function createLocalStorageMock(){
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
        log("setItem",key,content);
        mock.data[key]=content;
    };

    mock.getItem = function(key){
        log("getItem",key,jsonDecode(mock.data[key]));
        return mock.data[key];
    };

    return mock
}



describe("messageHandling",function(){


    var mockedLocalStorage;
    var storageUtil;
    var buddyDB;
    var responseLog;

    function responseCallback(response){
        responseLog.push(response);
    }

    function buildApprovalObject(){
        if(mockedLocalStorage.data["settings-updated"]){
            mockedLocalStorage.data["settings-updated"] = "2015-01-30 23:01"
        }
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
        mockedLocalStorage = createLocalStorageMock();
        storageUtil = new StorageUtil(mockedLocalStorage);
        buddyDB = new BuddyDB(storageUtil);
        responseLog =[];
    });

    approveIt("get-set-settings", function(approvals){
        var request ={"type":"set-settings" };
        request.settings ={};
        request.settings.boardLinks = _storedLinks;
        request.settings.kanbanBoardColorMap = _storageColorMap;
        request.settings.kanbanBoardDescriptionMap = _storageDescriptionMap;
        request.settings.taskBoardColorMap = _storageColorMap;
        request.settings.taskBoardDescriptionMap = _storageDescriptionMap;
        messageHandler(buddyDB,request,{},responseCallback)
        messageHandler(buddyDB,{"type":"get-settings"},{},responseCallback)
        approvals.verify(buildApprovalObject());

    });

    approveIt("get-set-settings empty", function(approvals){
        var request ={"type":"set-settings" };
        request.settings ={};
        messageHandler(buddyDB,request,{},responseCallback)
        messageHandler(buddyDB,{"type":"get-settings"},{},responseCallback)
        approvals.verify(buildApprovalObject());

    });

    approveIt("save-snapshot get-flow-data", function(approvals){
        var request ={"type":"save-snapshot" };
        request.snapshot = simpleSnapshot(1000000,[createSnapshotTicket(1,"test")]);
        request.snapshot.boardUrl = "http://boardurl.com/_backlogs/board/Backlog%20items"
        messageHandler(buddyDB,request,{},responseCallback)
        messageHandler(buddyDB,{"type":"get-flow-data","board":"http://boardurl.com/_backlogs/board/Backlog%20items"},{},responseCallback)
        approvals.verify(buildApprovalObject());

    });
});