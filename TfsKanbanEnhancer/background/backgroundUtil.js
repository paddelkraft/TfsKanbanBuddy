/**
 * Created by siven on 28/02/15.
 */
function messageHandler (_buddyDB ,request, sender, sendResponse) {
    var data,settings,key;
    console.log ("Incoming request type = " + request.type);
    switch(request.type) {
        case SET_KANBAN_BOARD_COLOR_MAPPING://Color mapping for kanban board
            _buddyDB.setKanbanBoardColorMap(request.colorMap);
            sendResponse("Saved " );
            break;
        case GET_KANBAN_BOARD_COLOR_MAPPING:
            sendResponse(_buddyDB.getKanbanBoardColorMap());
            console.log("color-map sent " + jsonEncode(_buddyDB.getKanbanBoardColorMap()));
            break;

        case SET_TASK_BOARD_COLOR_MAPPING://Color mapping for Task (scrum board)
            _buddyDB.setTaskBoardColorMap(request.colorMap);
            sendResponse("Saved " );
            break;
        case GET_TASK_BOARD_COLOR_MAPPING:
            sendResponse(getTaskBoardColorMap());
            console.log("task-color-map sent " + jsonEncode(_buddyDB.getTaskBoardColorMap()));
            break;

        case SET_KANBAN_BOARD_DESCRIPTION_MAPPING://Color mapping for kanban board
            _buddyDB.setKanbanBoardDescriptionMap(request.descriptionMap);
            sendResponse("Saved " );
            break;
        case GET_KANBAN_BOARD_DESCRIPTION_MAPPING:
            sendResponse(getKanbanBoardDescriptionMap());
            console.log("description-map sent " + jsonEncode(_buddyDB.getKanbanBoardDescriptionMap()));
            break;

        case SET_TASK_BOARD_DESCRIPTION_MAPPING://Color mapping for Task (scrum board)
            _buddyDB.setTaskBoardDescriptionMap(request.descriptionMap);
            sendResponse("Saved " );
            break;
        case GET_TASK_BOARD_DESCRIPTION_MAPPING:
            sendResponse(getTaskBoardDescriptionMap());
            console.log("description-color-map sent " + jsonEncode(_buddyDB.getTaskBoardDescriptionMap()));
            break;

        case "set-links"://Project links
            _buddyDB.setBoardLinks(request.links);
            sendResponse("Saved " );
            break;
        case "get-links":
            var boardLinks = _buddyDB.getBoardLinks();
            sendResponse(boardLinks);
            console.log("links sent " + jsonEncode(boardLinks));
            break;

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
            _buddyDB.saveSnapshot(request.snapshot);
            apiUtil().registerBoard(request.snapshot);
            //Todo Remove (cleaning up old data)
            localStorage.removeItem("snapshots_"+ request.snapshot.board);
            //end remove
            sendResponse("Saved");
            break;

        case "set-board-data"://Incoming data from kanban board

        function setBoardData(boardData){
            _buddyDB.setBoardData(boardData);
            console.log("Imported Boarddata saved with key " +snapshot.boardUrl);
            //console.log(getStringFromStorage(key));
        }
            setBoardData(request.boardData);
            break;

        case "open-data-page"://board triggering flowData page opening
            (function(){
                var page = "spa.html";
                var url = decodeUrlKeepEncodedSpaces(request.board);
                console.log("flowdata for"  + request.board + " requested");
                if(endsWith(request.board,"board")|| endsWith(request.board,"board/")){
                    url = apiUtil().getRegisteredBoardUrl(request.board,"Microsoft.RequirementCategory");
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
                url = apiUtil().getRegisteredBoardUrl(request.board,"Microsoft.RequirementCategory");
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

function BuddyDB(_storage){
    var self = {};
    if(!_storage){
        _storage = new StorageUtil(localStorage);
    }



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
        return _storage.getObjectFromStorage("snapshots_"+boardUrl);
    };

    self.setBoardData= function (key,boardData){
        _storage.saveObjectToStorage("snapshots_"+key, boardData);
        console.log("boardData updated key = " + key);
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
        var boardUrl = apiUtil().getBoardUrl(snapshot.boardUrl,snapshot.board , snapshot.cardCategory);
        var registeredUrl = apiUtil().getRegisteredBoardUrl(snapshot.board,snapshot.cardCategory);
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
                //saveObjectToStorage("snapshots_" + snapshot.boardUrl,null);
            }else {
                //New data for
                boardData = new BoardData(data);
            }
        } else {
            boardData = new BoardData(data);
        }

        boardData.setBlockedPrefix(buddyDB.getBlockedPrefix());

        boardData.addSnapshot(snapshot);
        //console.log(boardData.genericItemUrl);
        self.setBoardData(boardUrl, boardData);
    };

    return self;
}

function ApiStorage(_storage){
    var self = {};
    if(!_storage){
        _storage = new StorageUtil();
    }


    self.getRegisteredBoards = function(){
        var registeredBoards = _storage.getObjectFromStorage("registered-boards") ;
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
        _storage.saveObjectToStorage("registered-boards", registeredBoards) ;
        console.log("registeredBoards saved to local storage " );
    };

    return self;
}

function apiUtil(_storage){
    var self = {};
    if(!_storage){
        _storage = ApiStorage();
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
        var registeredBoards  = removeUrlsWithEncodedDash(_storage.getRegisteredBoards()); //storage.getRegisteredBoards();
        var boardRecord = self.createBoardRecord(snapshot);
        registeredBoards[boardRecord.apiUrl] = boardRecord;
        console.log("Register board " + boardRecord.boardUrl);

        _storage.setRegisteredBoards(registeredBoards);

    };

    self.getBoardUrl = function(boardUrl,projectUrl,cardCategory){
        var registeredBoards  = _storage.getRegisteredBoards();
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
        var registeredBoards  = _storage.getRegisteredBoards();
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
            buddyDB.saveSnapshot(snapshot);

        });
    };

    self.getApiSnapshots = function (){
        _.forEach (_storage.getRegisteredBoards(),function(boardRecord){
            self.getApiSnapshot(boardRecord);
        });
    };


    return self;

}


function autoImport(timeout){
    console.log("Auto import");
    var data = buddyDB.getImportUrl();
    console.log(jsonEncode(data));
    if( data && data.url && data.automaticImport){
        console.log("fetch settings from URL " + data.url);
        $.get(data.url,function(content){
            chrome.runtime.sendMessage({type : "set-settings", "settings" : jsonDecode(content) });
        });
    }
    if(timeout){
        setTimeout(autoImport, timeout);
    }
}

