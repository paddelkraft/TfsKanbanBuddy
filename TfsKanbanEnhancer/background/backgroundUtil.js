var GET_KANBAN_BOARD_COLOR_MAPPING = "get-color-map";
var GET_TASK_BOARD_COLOR_MAPPING = "get-task-color-map";
var SET_KANBAN_BOARD_COLOR_MAPPING = "set-color-map";
var SET_TASK_BOARD_COLOR_MAPPING = "set-task-color-map";
var GET_KANBAN_BOARD_DESCRIPTION_MAPPING = "get-description-map";
var GET_TASK_BOARD_DESCRIPTION_MAPPING = "get-task-description-map";
var SET_KANBAN_BOARD_DESCRIPTION_MAPPING = "set-description-map";
var SET_TASK_BOARD_DESCRIPTION_MAPPING = "set-task-description-map";

function messageHandler (_buddyDB, getApiSnapshot,request, sender, sendResponse) {
    "use strict";
    var data,settings,key;
    console.log ("Incoming request type = " + request.type);
    switch(request.type) {
        case "set-import-url"://Settings Import Url
            data = request.importData;

            _buddyDB.setImportUrl(data);
            sendResponse ("import url Saved " );
            console.log("import url saved to local storage " + dbBuddy.getImportUrl());
            break;
        case "get-settings"://complete board config
            settings = {
                kanbanBoardColorMap : _buddyDB.getKanbanBoardColorMap(),
                kanbanBoardDescriptionMap : _buddyDB.getKanbanBoardDescriptionMap(),
                taskBoardColorMap : _buddyDB.getTaskBoardColorMap(),
                taskBoardDescriptionMap : _buddyDB.getTaskBoardDescriptionMap(),
                boardLinks : _buddyDB.getBoardLinks()
            };
            if(request.importInfo){
                settings.importData = _buddyDB.getImportUrl() ;
            }
            sendResponse(settings);
            console.log("settings sent " + jsonEncode(settings));
            break;
        case "set-settings"://complete board config
            settings = request.settings;
            if(settings.boardLinks){
                _buddyDB.setBoardLinks(settings.boardLinks);
            }
            if(settings.taskBoardColorMap){
                _buddyDB.setTaskBoardColorMap(settings.taskBoardColorMap);
            }
            if(settings.taskBoardDescriptionMap){
                _buddyDB.setTaskBoardDescriptionMap(settings.taskBoardDescriptionMap);
            }
            if(settings.kanbanBoardColorMap){
                _buddyDB.setKanbanBoardColorMap(settings.kanbanBoardColorMap);
            }
            if(settings.kanbanBoardDescriptionMap){
                _buddyDB.setKanbanBoardDescriptionMap(settings.kanbanBoardDescriptionMap);
            }
            _buddyDB.setSettingsUpdated(timeUtil.dateFormat(timeUtil.now()));
            sendResponse("Settings saved");
            break;

        case "save-snapshot"://Incoming data from kanban board
            //_buddyDB.saveSnapshot(request.snapshot);
            getApiSnapshot(_buddyDB.registerBoard(request.snapshot));
            sendResponse("Saved");
            break;

        case "set-board-data"://Incoming data from kanban board
            _buddyDB.setBoardData(request.boardData);
            console.log("Imported Boarddata saved with key " +snapshot.boardUrl);
            //console.log(getStringFromStorage(key));
            break;

        case "open-data-page"://board triggering flowData page opening
            (function(){
                var page = "spa.html";
                var url = decodeUrlKeepEncodedSpaces(request.board);
                console.log("flowdata for"  + request.board + " requested");
                if(endsWith(request.board,"board")|| endsWith(request.board,"board/")){
                    url = _buddyDB.getRegisteredBoardUrl(request.board,"Microsoft.RequirementCategory");
                }


                if(request.page){
                    page = page+"#/"+ request.page +"/";
                }
                var newURL = "pages/"+page+encodeUrl(url);
                chrome.tabs.create({ url: newURL });
                sendResponse("OK");
                console.log("open-data-page handled spa.html#/"+ request.page +" opened");
            })();

            break;
        case "show-flow-data"://board triggering flowData page opening
            var page = "flowData.html";
            var url = request.board;
            console.log("flowdata for"  + request.board + " requested");
            if(endsWith(request.board,"board")|| endsWith(request.board,"board/")){
                url = _buddyDB.getRegisteredBoardUrl(request.board,"Microsoft.RequirementCategory");
            }
            if(request.page){
                page = request.page;
            }
            var newURL = "pages/"+page+"?"+encodeURIComponent(url);
            chrome.tabs.create({ url: newURL });
            sendResponse("OK");
            console.log("show-flow-data handled flowdata.html opened");
            break;
        case "get-flow-data"://flowdata page requesting data
            console.log("get-flow-data for board "+ request.board);
            var response = _buddyDB.getBoardData(request.board);
            if(!response){
                console.log("No flowdata available");
            }else{
                sendResponse(new BoardData(response));
                console.log("Flowdata sent to flowdata.html") ;
            }

            break;
        case "delete-flow-data":
            console.log("delete-flow-data for " + request.board );
            _buddyDB.setBoardData(request.board,{});
            break;
    }
    return true;
}

function BuddyDB(_storage,apiUtil,tfsApi){
    "use strict";
    var self = {};

    self.largestBoardDataStore = function (boardUrl1,boardUrl2){
        var data1 = _storage.getStringFromStorage("snapshots_"+boardUrl1);
        var data2 = _storage.getStringFromStorage("snapshots_"+boardUrl2);
        var largest = boardUrl1;
        if(!data1){
            largest = boardUrl2;
        }else if(data2 && data2.length>data1.length){
            largest = boardUrl2;
        }

        return largest;
    };

    self.getBoardLinks = function (){
        var links = _storage.getObjectFromStorage("links") ;
        console.log("links read from local storage");
        return links;
    };

    self.setBoardLinks = function (links){
        _storage.saveObjectToStorage("links", links) ;
        console.log("Links saved to local storage " + localStorage.getItem("links"));
    };

    self.getTaskBoardColorMap = function (){
        var taskBoardColorMap = _storage.getObjectFromStorage("taskBoardColorMap") ;
        console.log("taskColorMap read from local storage");
        return taskBoardColorMap;
    };

    self.setTaskBoardColorMap = function(taskBoardColorMap){
        _storage.saveObjectToStorage("taskBoardColorMap", taskBoardColorMap) ;
        console.log("task-color-map saved to local storage " + localStorage.getItem("taskBoardColorMap"));
    };

    self.getTaskBoardDescriptionMap = function (){
        var taskBoardDescriptionMap = _storage.getObjectFromStorage("taskBoardDescriptionMap");
        console.log("taskDescriptionMap read from local storage");
        return taskBoardDescriptionMap;
    };

    self.setTaskBoardDescriptionMap = function (taskBoardDescriptionMap){
        _storage.saveObjectToStorage("taskBoardDescriptionMap", taskBoardDescriptionMap) ;
        console.log("task-description-map saved to local storage " + localStorage.getItem("taskBoardDescriptionMap"));
    };

    self.getKanbanBoardColorMap = function (){
        var kanbanBoardColorMap = _storage.getObjectFromStorage("colorMap");
        console.log("Kanban Color Map read from local storage");
        return kanbanBoardColorMap;
    };

    self.setKanbanBoardColorMap = function (kanbanBoardColorMap){
        _storage.saveObjectToStorage( "colorMap" , kanbanBoardColorMap);
        console.log("Kanban color-map saved to local storage " + localStorage.getItem("colorMap"));
    };

    self.getKanbanBoardDescriptionMap = function (){
        var kanbanBoardDescriptionMap = _storage.getObjectFromStorage("descriptionMap");
        console.log("Kanban description Map read from local storage");
        return kanbanBoardDescriptionMap;
    };

    self.setKanbanBoardDescriptionMap = function (kanbanBoardDescriptionMap){
        _storage.saveObjectToStorage( "descriptionMap" , kanbanBoardDescriptionMap);
        console.log("Kanban description-map saved to local storage " + localStorage.getItem("descriptionMap"));
    };

    self.getBoardData = function(boardUrl){
        return new BoardData(_storage.getObjectFromStorage("snapshots_"+boardUrl));
    };

    self.setBoardData= function (boardUrl,boardData){
        _storage.saveObjectToStorage("snapshots_"+boardUrl, boardData);
        console.log("boardData updated key = " + boardUrl);
    };

    self.removeItem = function (key){
        _storage.localStorage.removeItem(key);
        console.log("Record with Key "+key+" was deleted");
    };

    self.getImportUrl = function (){
        return _storage.getObjectFromStorage("import-url");
    };

    self.setImportUrl = function(url){
        _storage.saveObjectToStorage ("import-url", data)
    };

    self.setSettingsUpdated = function (timestamp){
        _storage.saveStringToStorage("settings-updated",timestamp);
    };

    self.getBlockedPrefix = function(colorMap){
        var prefix;
        var color;
        if(!colorMap){
            colorMap = self.getKanbanBoardColorMap()
        }
        for(prefix in colorMap){
            color = colorMap[prefix];
            if(color === "red" || color === "blocked" ){
                return prefix;
            }
        }
        return null;
    };

    self.saveSnapshot = function(snapshot){
        var boardData;
        var data = null;
        var boardUrl = self.getBoardUrl(snapshot.boardUrl,snapshot.board , snapshot.cardCategory);
        var registeredUrl = self.getRegisteredBoardUrl(snapshot.board,snapshot.cardCategory);
        var ticketsNotOnBoard;
        var apiWorkItems;
        console.log("Snapshot to save = "+jsonEncode(snapshot));
        //same board can have several shorter urls we only want to save the data once
        if(registeredUrl && boardUrl!==registeredUrl){
            if(registeredUrl === self.largestBoardDataStore(boardUrl,registeredUrl)){
                data = self.getBoardData(registeredUrl);
                self.removeItem("snapshots_" + registeredUrl);
            }

        }
        if (data===null){
            data = self.getBoardData(boardUrl);
        }

        if(snapshot.boardUrl && snapshot.boardUrl.indexOf("_backlogs/board")>-1 && snapshot.cardCategory === "Microsoft.RequirementCategory"){
            //old keys remove when safe
            if (jsonEncode(data)==="{}"){
                boardData = new BoardData( self.getBoardData(snapshot.board));
            }else {
                //New data for
                boardData = new BoardData(data);
            }
        } else {
            boardData = new BoardData(data);
        }

        boardData.setBlockedPrefix(self.getBlockedPrefix());

        boardData.addSnapshot(snapshot);
        ticketsNotOnBoard = boardData.getTicketsMissingOnBoard()
        if(ticketsNotOnBoard.length !== 0){
            apiWorkItems = tfsApi.workItem(self.createBoardRecord(snapshot).getWorkItemApiUrl(ticketsNotOnBoard,["System.State"]));
            apiWorkItems.then(function(tickets){
                boardData.updateStateForTicketsNotOnBoard(tickets);
            });
        }
        //console.log(boardData.genericItemUrl);
        self.setBoardData(boardUrl, boardData);
    };

    self.getTicketsMissingOnBoard = function(boardUrl){
        return self.getBoardData(boardUrl).getTicketsMissingOnBoard();
    };

    self.updateStateForTicketsNotOnBoard = function(boardUrl,tickets){
        var boardData = self.getBoardData(boardUrl);
        boardData.updateStateForTicketsNotOnBoard(tickets);
        self.setBoardData(boardUrl,boardData);
    };

    self.getRegisteredBoards = function(){
        var registeredBoards = {};
        _.forEach(_storage.getObjectFromStorage("registered-boards"),function(board){
            board = new BoardRecord(board);
            registeredBoards[board.getBoardApiUrl()]=board;
        });

        console.log("registered boards read from local storage");

        return registeredBoards;
    };

    self.registerBoard = function(snapshot){
        var registeredBoards  = apiUtil.removeUrlsWithEncodedDash(self.getRegisteredBoards()); //storage.getRegisteredBoards();
        var boardRecord = self.createBoardRecord(snapshot);
        registeredBoards[boardRecord.getBoardApiUrl()] = boardRecord;
        console.log("Register board " + boardRecord.boardUrl);

        self.setRegisteredBoards(registeredBoards);

        return boardRecord;
    };

    self.getRegisteredBoardUrl = function(projectUrl,cardCategory){
        var registeredBoards  = self.getRegisteredBoards();
        var boardUrl = null;
        var apiUrl = apiUtil.getApiUrl(projectUrl,cardCategory);
        if(registeredBoards[apiUrl]){
            boardUrl = registeredBoards[apiUrl].boardUrl;
        }

        return boardUrl;
    };

    self.getBoardUrl = function(boardUrl,projectUrl,cardCategory){
        var registeredBoards  = self.getRegisteredBoards();
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

    self.createBoardRecord = function (snapshot){
        var boardRecord ;
        snapshot.boardUrl = self.getBoardUrl(snapshot.boardUrl,snapshot.board,snapshot.cardCategory);
        boardRecord = new BoardRecord(snapshot);
        return boardRecord;
    };

    self.setRegisteredBoards = function(registeredBoards){
        _storage.saveObjectToStorage("registered-boards", registeredBoards) ;
        console.log("registeredBoards saved to local storage " );
    };

    return self;
}

function apiInvocation(){
    var self = {};
    self.getApiSnapshot = function (buddyDB,tfsApi,boardRecord){
        var api;
        var missingTickets;
        console.log("Fetch snapshot from api "+boardRecord.getBoardApiUrl() );
        api = tfsApi.snapshot(boardRecord.getBoardApiUrl(),boardRecord.boardUrl,boardRecord.getGenericItemUrl(),boardRecord.getProjectUrl());

        api.getSnapshot( function(snapshot){
            var apiWorkItem;
            console.log ("apiSnapshot built");
            buddyDB.saveSnapshot(snapshot);
            missingTickets = buddyDB.getTicketsMissingOnBoard(boardRecord.boardUrl);
            if(missingTickets.length!==0){
                apiWorkItem = tfsApi.workItem(boardRecord.getWorkItemApiUrl(missingTickets,["System.State"]));
                apiWorkItem.then(function(tickets){
                    buddyDB.updateStateForTicketsNotOnBoard(boardRecord.boardUrl,tickets);
                });
            }

        });
    };

    self.getApiSnapshots = function  (_buddyDB,getApiSnapshot){
        _.forEach (_buddyDB.getRegisteredBoards(),function(boardRecord){
            getApiSnapshot(boardRecord);
        });
    };

    return self;
}





function ApiUtil(){
    "use strict";
    var self = {};

    //remove 0.6.0
    self.removeUrlsWithEncodedDash = function(registeredBoards){
        var cleanedRegistry = {};
        _.forEach(registeredBoards,function (board){
            if(!(board.boardUrl.indexOf("E2%80%93")>-1)){
                cleanedRegistry[board.apiUrl] = board;
            }
        });

        return cleanedRegistry;
    };

    self.getApiUrl = function(boardUrl, cardCategory){
        var projName = boardUrl.split("/_backlogs")[0];
        if(!cardCategory){
            return projName + "/_api/_backlog/GetBoard?__v=3";
        }
        return projName + "/_api/_backlog/GetBoard?__v=5&hubCategoryReferenceName="+cardCategory;

    };

    return self;
}


function autoImport(buddyDB,$jq,timeout){
    console.log("Auto import");
    var data = buddyDB.getImportUrl();
    console.log(jsonEncode(data));
    if( data && data.url && data.automaticImport){
        console.log("fetch settings from URL " + data.url);
        $jq.get(data.url,function(content){
            chrome.runtime.sendMessage({type : "set-settings", "settings" : jsonDecode(content) });
        });
    }
    if(timeout){
        setTimeout(autoImport, timeout);
    }
}

function StorageUtil(storage){
    var self = {};

    self.localStorage = storage;
    self.saveObjectToStorage = function(key, toSave){
        var content = jsonEncode(toSave);
        storage.setItem(key,content);
    };

    self.getObjectFromStorage = function (key){
        var content = storage.getItem(key);
        if(content === "" || content === null){
            content = "{}";
        }
        return jsonDecode(content);

    };

    self.getStringFromStorage = function (key){
        return storage.getItem(key);
    };

    self.saveStringToStorage = function (key, content){
        storage.setItem(key, content);

    };

    return self;
}


function BoardRecord(imput){
    "use strict";
    var self = {};
    self.type = "BoardRecord";
    if(imput.cardCategory){
        self.cardCategory = imput.cardCategory;

    }

    self.boardUrl = imput.boardUrl;

    if(imput.genericItemUrl){
        var projectUrl = imput.genericItemUrl.replace("/_workitems#_a=edit&id=","");
        self.projectName = _.last(projectUrl.split("/"))
    }else{
        self.projectName = imput.projectName;
    }

    self.getProjectUrl = function (){
        return self.boardUrl.split(self.projectName)[0]+self.projectName;
    }


    self.getGenericItemUrl = function(){

        return  self.getProjectUrl() + "/_workitems#_a=edit&id=";
    };

    self.getCollectionUrl = function(){
        var urlComponents = self.getProjectUrl().split("/"+self.projectName);

        return urlComponents[0];
    };

    function arrayToCommaSeparatedString(arr){
        var string = "";
        _.forEach(arr,function(item){
            string = string + item + ",";
        });
        return string.substring(0, string.length - 1);
    }

    self.getBoardApiUrl = function(){

        if(!self.cardCategory){
            return self.getProjectUrl() + "/_api/_backlog/GetBoard?__v=3";
        }
        return self.getProjectUrl() + "/_api/_backlog/GetBoard?__v=5&hubCategoryReferenceName="+self.cardCategory;
    };

    self.getWorkItemApiUrl = function (ids,fields){
        return self.getCollectionUrl() + "/_apis/wit/workitems?api-version=1.0&ids="+
        arrayToCommaSeparatedString(ids)+"&fields="+arrayToCommaSeparatedString(fields);
    };

    return self;

}

function BackgroundFactory(localStorage, jQuery, timeUtil){
    "use strict";
    var self = {};
    self.tfsApi = new TfsApi(timeUtil,jQuery);

    self.storageUtil = function(){
        return new StorageUtil(localStorage);
    };

    self.apiUtil= function(){
        return ApiUtil ()
    };

    self.buddyDB = function (){
        return new BuddyDB(self.storageUtil(), self.apiUtil(),self.tfsApi);
    };

    self.messageHandler = function(){
        return _.curry( messageHandler)(self.buddyDB(),self.getApiSnapshot);
    };

    self.autoImport = function(timeout){
        autoImport(self.buddyDB(),jQuery,timeout);
    };

    self.getApiSnapshot = function (boardRecord){
        apiInvocation().getApiSnapshot(self.buddyDB(),self.tfsApi,boardRecord)
    };

    self.getApiSnapshots = function (){
        return function (){
            apiInvocation().getApiSnapshots(self.buddyDB(),self.getApiSnapshot);
        }
    };





    return self;
}



