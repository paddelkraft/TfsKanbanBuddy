// listening for an event / one-time requests
// coming from the popup/and content
var GET_KANBAN_BOARD_COLOR_MAPPING = "get-color-map";
var GET_TASK_BOARD_COLOR_MAPPING = "get-task-color-map";
var SET_KANBAN_BOARD_COLOR_MAPPING = "set-color-map";
var SET_TASK_BOARD_COLOR_MAPPING = "set-task-color-map";
var GET_KANBAN_BOARD_DESCRIPTION_MAPPING = "get-description-map";
var GET_TASK_BOARD_DESCRIPTION_MAPPING = "get-task-description-map";
var SET_KANBAN_BOARD_DESCRIPTION_MAPPING = "set-description-map";
var SET_TASK_BOARD_DESCRIPTION_MAPPING = "set-task-description-map";
var tfsKanbanBuddy = {};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    var data,settings,key;
    console.log ("Incomming request type = " + request.type);
    switch(request.type) {
		case SET_KANBAN_BOARD_COLOR_MAPPING://Color mapping for kanban board 
            setKanbanBoardColorMap(request.colorMap);
            tfsKanbanBuddy.blockedPrefix = getBlockedPrefix(request.colorMap);
            sendResponse("Saved " );
            break;
    	case GET_KANBAN_BOARD_COLOR_MAPPING:
        	sendResponse(getKanbanBoardColorMap());
        	console.log("color-map sent " + jsonEncode(getKanbanBoardColorMap()));
        	break;
    
    	case SET_TASK_BOARD_COLOR_MAPPING://Color mapping for Task (scrum board)
       		setTaskBoardColorMap(request.colorMap);
        	sendResponse("Saved " );
        	break;
    	case GET_TASK_BOARD_COLOR_MAPPING:
        	sendResponse(getTaskBoardColorMap());
        	console.log("task-color-map sent " + jsonEncode(getTaskBoardColorMap()));
        	break;
    
    	case SET_KANBAN_BOARD_DESCRIPTION_MAPPING://Color mapping for kanban board 
        	setKanbanBoardDescriptionMap(request.descriptionMap);
        	sendResponse("Saved " );
        	break;
    	case GET_KANBAN_BOARD_DESCRIPTION_MAPPING:
       		sendResponse(getKanbanBoardDescriptionMap());
        	console.log("description-map sent " + jsonEncode(getKanbanBoardDescriptionMap()));
       		break;
    
    	case SET_TASK_BOARD_DESCRIPTION_MAPPING://Color mapping for Task (scrum board)
        	setTaskBoardDescriptionMap(request.descriptionMap);
        	sendResponse("Saved " );
        	break;
    	case GET_TASK_BOARD_DESCRIPTION_MAPPING:
        	sendResponse(getTaskBoardDescriptionMap());
        	console.log("description-color-map sent " + jsonEncode(getTaskBoardDescriptionMap()));
        	break;
    
        case "set-links"://Project links
            setBoardLinks(request.links);
            sendResponse("Saved " );
            break;
        case "get-links":
            var boardLinks = getBoardLinks();
            sendResponse(boardLinks);
            console.log("links sent " + jsonEncode(boardLinks));
            break;
            
        case "set-url"://Project root url
            var url = request.url;
            saveStringToStorage ("url", url) ;
            sendResponse ("Saved " );
            console.log("url saved to local storage " + localStorage.getItem("url"));
            break;
        case "get-url"://Project root url
            data = getStringFromStorage("url") ;
            console.log("url read from local storage");
            sendResponse(data);
            console.log("url sent " + jsonEncode(data));
            break;
        
        case "set-import-url"://Settings Import Url
            data = request.importData;
            saveObjectToStorage ("import-url", data) ;
            sendResponse ("import url Saved " );
            console.log("import url saved to local storage " + localStorage.getItem("import-url"));
            break;
        case "get-settings"://complete board config
            settings = {
                kanbanBoardColorMap : getKanbanBoardColorMap(),
				kanbanBoardDescriptionMap : getKanbanBoardDescriptionMap(),
                taskBoardColorMap : getTaskBoardColorMap(),
				taskBoardDescriptionMap : getTaskBoardDescriptionMap(),
                boardLinks : getBoardLinks()
            };
            if(request.importInfo){
                settings.importData = getObjectFromStorage("import-url") ;
            }
            sendResponse(settings);
            console.log("settings sent " + jsonEncode(settings));
            break;
        case "set-settings"://complete board config
            settings = request.settings;
            if(settings.boardLinks){
                setBoardLinks(settings.boardLinks);
            }
            if(settings.taskBoardColorMap){
                setTaskBoardColorMap(settings.taskBoardColorMap);
            }
            if(settings.taskBoardDescriptionMap){
                setTaskBoardDescriptionMap(settings.taskBoardDescriptionMap);
            }
            if(settings.kanbanBoardColorMap){
                setKanbanBoardColorMap(settings.kanbanBoardColorMap);
                tfsKanbanBuddy.blockedPrefix = getBlockedPrefix(settings.kanbanBoardColorMap);
            }
            if(settings.kanbanBoardDescriptionMap){
                setKanbanBoardDescriptionMap(settings.kanbanBoardDescriptionMap);
            }
            saveStringToStorage("settings-updated",timeUtil.dateFormat(timeUtil.now()));
            sendResponse("Settings saved");
            break;
        
        case "save-snapshot"://Incoming data from kanban board
            saveSnapshot(request.snapshot);
            apiUtil().registerBoard(request.snapshot);
            //Todo Remove (cleaning up old data)
            localStorage.removeItem("snapshots_"+ request.snapshot.board);
            //end remove
            sendResponse("Saved");
            break;
        
        case "set-board-data"://Incoming data from kanban board
            
            function setBoardData(boardData){
                var snapshot = request.snapshot;
                console.log(jsonEncode(request.snapshot));
                key = "snapshots_" + boardData.board;
                saveObjectToStorage(key, boardData);
                sendResponse("Saved");
                console.log("Imported Boarddata saved with key " + key);
                //console.log(getStringFromStorage(key));
            }
            setBoardData(request.boardData);
            break;

        case "open-data-page"://board triggering flowData page opening
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
            key = "snapshots_" + request.board;
            console.log("get-flow-data for board "+ request.board);
            var response = getObjectFromStorage(key);
            if(!response){
                console.log("No flowdata available");
            }else{
               sendResponse(new BoardData(response));
               console.log("Flowdata sent to flowdata.html") ;
            }
            
            break;
        case "delete-flow-data":
            console.log("delete-flow-data for " + request.board );
            key = "snapshots_" + request.board;
            saveObjectToStorage(key,{});
            break;
    }
    return true;
});

function getBlockedPrefix(colorMap){
    var prefix;
    var color;
    for(prefix in colorMap){
        color = colorMap[prefix];
        if(color === "red" || color === "blocked" ){
            return prefix;
        }
    }
    return null;
}

function saveSnapshot(snapshot){
    var boardData;
    var key;
    var data = null;
    var boardUrl = apiUtil().getBoardUrl(snapshot.boardUrl,snapshot.board , snapshot.cardCategory);
    var largest;
    var registeredUrl = apiUtil().getRegisteredBoardUrl(snapshot.board,snapshot.cardCategory);
    console.log("Snapshot to save = "+jsonEncode(snapshot));
    key = "snapshots_" + boardUrl;
    //same board can have several shorter urls we only want to save the data once
    if(registeredUrl && boardUrl!==registeredUrl){
        if(registeredUrl === largestBoardDataStore(boardUrl,registeredUrl)){
            data = getObjectFromStorage("snapshots_"+registeredUrl);
            localStorage.removeItem("snapshots_" + registeredUrl);
            //saveObjectToStorage("snapshots_" + registeredUrl,null);
        }

    }
    if (data===null){
      data = getObjectFromStorage(key);
    }
    
    
    
    if(snapshot.boardUrl && snapshot.boardUrl.indexOf("_backlogs/board")>-1 && snapshot.cardCategory === "Microsoft.RequirementCategory"){
        //old keys remove when safe
        if (jsonEncode(data)==="{}"){
            boardData = new BoardData( getObjectFromStorage("snapshots_" + snapshot.board));
            //saveObjectToStorage("snapshots_" + snapshot.boardUrl,null);
        }else {
            //New data for
            boardData = new BoardData(data);
        }
    } else {
        boardData = new BoardData(data);
    }
    
    boardData.setBlockedPrefix(tfsKanbanBuddy.blockedPrefix);
    
    boardData.addSnapshot(snapshot);
    //console.log(boardData.genericItemUrl);
    saveObjectToStorage(key, boardData);
    console.log("boardData updated key = " + key);
    
}

function largestBoardDataStore(boardUrl1,boardUrl2){
    var data1 = getStringFromStorage("snapshots_"+boardUrl1);
    var data2 = getStringFromStorage("snapshots_"+boardUrl2);
    var largest = boardUrl1;
    if(!data1){
        largest = boardUrl2;
    }else if(data2 && data2.length>data1.length){
        largest = boardUrl2;
    }

    return largest;
}

function getBoardLinks(){
    var links = getObjectFromStorage("links") ;
    console.log("links read from local storage");
    return links;
}

function setBoardLinks(links){
    saveObjectToStorage("links", links) ;
    console.log("Links saved to local storage " + localStorage.getItem("links"));
}

function getTaskBoardColorMap(){
    var taskBoardColorMap = getObjectFromStorage("taskBoardColorMap") ;
    console.log("taskColorMap read from local storage");
    return taskBoardColorMap;
}

function setTaskBoardColorMap(taskBoardColorMap){
    saveObjectToStorage("taskBoardColorMap", taskBoardColorMap) ;
    console.log("task-color-map saved to local storage " + localStorage.getItem("taskBoardColorMap"));
}

function getTaskBoardDescriptionMap(){
    var taskBoardDescriptionMap = getObjectFromStorage("taskBoardDescriptionMap");
    console.log("taskDescriptionMap read from local storage");
    return taskBoardDescriptionMap;
}

function setTaskBoardDescriptionMap(taskBoardDescriptionMap){
    saveObjectToStorage("taskBoardDescriptionMap", taskBoardDescriptionMap) ;
    console.log("task-description-map saved to local storage " + localStorage.getItem("taskBoardDescriptionMap"));
}

function getKanbanBoardColorMap(){
    var kanbanBoardColorMap = getObjectFromStorage("colorMap");
    console.log("Kanban Color Map read from local storage");
    return kanbanBoardColorMap;
}

function setKanbanBoardColorMap(kanbanBoardColorMap){
    saveObjectToStorage( "colorMap" , kanbanBoardColorMap);
    console.log("Kanban color-map saved to local storage " + localStorage.getItem("colorMap"));
}

function getKanbanBoardDescriptionMap(){
    var kanbanBoardDescriptionMap = getObjectFromStorage("descriptionMap");
    console.log("Kanban description Map read from local storage");
    return kanbanBoardDescriptionMap;
}

function setKanbanBoardDescriptionMap(kanbanBoardDescriptionMap){
    saveObjectToStorage( "descriptionMap" , kanbanBoardDescriptionMap);
    console.log("Kanban description-map saved to local storage " + localStorage.getItem("descriptionMap"));
}

function autoImport(){
  console.log("Autoimport");
  var data = getObjectFromStorage("import-url") ;
  console.log(jsonEncode(data));
  if( data && data.url && data.automaticImport){
    console.log("fetch settings from URL " + data.url);
    $.get(data.url,function(content){
       chrome.runtime.sendMessage({type : "set-settings", "settings" : jsonDecode(content) });
    });
  }
  setTimeout(autoImport, 3600000);
}

tfsKanbanBuddy.blockedPrefix = getBlockedPrefix(getKanbanBoardColorMap());
autoImport();
