// listening for an event / one-time requests
// coming from the popup/and content
var GET_KANBAN_BOARD_MAPPING = "get-color-map";
  var GET_TASK_BOARD_MAPPING = "get-task-color-map";
  var SET_KANBAN_BOARD_MAPPING = "set-color-map";
  var SET_TASK_BOARD_MAPPING = "set-task-color-map";

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    var data,settings,key;
    switch(request.type) {
        case SET_KANBAN_BOARD_MAPPING://Color mapping for kanban board 
            setKanbanBoardColorMap(request.colorMap);
            sendResponse("Saved " );
            break;
        case GET_KANBAN_BOARD_MAPPING:
            sendResponse(getKanbanBoardColorMap());
            console.log("color-map sent " + jsonEncode(getKanbanBoardColorMap()));
            break;
        
        case SET_TASK_BOARD_MAPPING://Color mapping for Task (scrum board)
            setTaskBoardColorMap(request.colorMap);
            sendResponse("Saved " );
            break;
        case GET_TASK_BOARD_MAPPING:
            sendResponse(getTaskBoardColorMap());
            console.log("task-color-map sent " + jsonEncode(getTaskBoardColorMap()));
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
                taskBoardColorMap : getTaskBoardColorMap(),
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
            if(settings.kanbanBoardColorMap){
                setKanbanBoardColorMap(settings.kanbanBoardColorMap);
            }
            sendResponse("Settings saved");
            break;
        
        case "save-snapshot"://Incoming data from kanban board
            var snapshot = request.snapshot;
            console.log(jsonEncode(request.snapshot));
            key = "snapshots_" + snapshot.board;
            var boardData = new BoardData( getObjectFromStorage(key));
            boardData.addSnapshot(snapshot);
            saveObjectToStorage(key, boardData);
            sendResponse("Saved");
            console.log("snapshot stored with key " + key);
            //console.log(getStringFromStorage(key));
            break;
        
        case "show-flow-data"://board triggering flowData page opening
            console.log("flowdata for"  + request.board + " requested");
            var newURL = "pages/flowData.html?"+encodeURIComponent(request.board);
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

function getKanbanBoardColorMap(){
    var kanbanBoardColorMap = getObjectFromStorage("colorMap");//jsonDecode(localStorage.getItem("colorMap")) ;
    console.log("ColorMap read from local storage");
    return kanbanBoardColorMap;
}

function setKanbanBoardColorMap(kanbanBoardColorMap){
    saveObjectToStorage( "colorMap" , kanbanBoardColorMap);
    console.log("Kanban color-map saved to local storage " + localStorage.getItem("colorMap"));
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

autoImport();
