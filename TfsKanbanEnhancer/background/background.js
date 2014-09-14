// listening for an event / one-time requests
// coming from the popup/and content
var GET_KANBAN_BOARD_MAPPING = "get-color-map";
  var GET_TASK_BOARD_MAPPING = "get-task-color-map";
  var SET_KANBAN_BOARD_MAPPING = "set-color-map";
  var SET_TASK_BOARD_MAPPING = "set-task-color-map";



//var kanbanBoardColorMap = null;
//var taskBoardColorMap = null;
//var links = null;
var url = null;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    
    switch(request.type) {
        case SET_KANBAN_BOARD_MAPPING:
            setKanbanBoardColorMap(request.colorMap); 
            sendResponse("Saved " );
            break;
        case GET_KANBAN_BOARD_MAPPING:
            sendResponse(getKanbanBoardColorMap());
            console.log("color-map sent " + jsonEncode(getKanbanBoardColorMap()));
            break;
        case SET_TASK_BOARD_MAPPING:
            setTaskBoardColorMap(request.colorMap);
            sendResponse("Saved " );
            break;
        case GET_TASK_BOARD_MAPPING:
            sendResponse(getTaskBoardColorMap());
            console.log("task-color-map sent " + jsonEncode(getTaskBoardColorMap()));
            break;
        case "set-links":
            setBoardLinks(request.links);
            sendResponse("Saved " );
            break;
        case "get-links":
            var boardLinks = getBoardLinks();
            sendResponse(boardLinks);
            console.log("links sent " + jsonEncode(boardLinks));
            break;
        case "set-url":
            url = request.url;
            saveStringToStorage ("url", url) ;
            sendResponse ("Saved " );
            console.log("url saved to local storage " + localStorage.getItem("url"));
            break;
        case "get-url":
            if(url == null){
                url = getStringFromStorage("url") ;
                console.log("url read from local storage");
            }
            sendResponse(url);
            console.log("url sent " + jsonEncode(url));
            break;
        case "get-settings":
            var settings = {
                kanbanBoardColorMap : getKanbanBoardColorMap(),
                taskBoardColorMap : getTaskBoardColorMap(),
                boardLinks : getBoardLinks()
            }
            sendResponse(settings);
            console.log("settings sent " + jsonEncode(settings));
            break;
        case "set-settings":
            var settings = request.settings;
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
        case "save-snapshot":
            var snapshot = request.snapshot;
            var key = "snapshots_" + snapshot.board;
            var boardData = new BoardData( getObjectFromStorage(key));
            boardData.addSnapshot(snapshot);
            saveObjectToStorage(key, boardData);
            sendResponse("Saved");
            console.log("snapshot stored with key " + key);
            //console.log(getStringFromStorage(key));
            break;
        case "show-flow-data":
            console.log("flowdata for"  + request.board + " requested");
            var newURL = "pages/flowData.html?"+encodeURIComponent(request.board);
            chrome.tabs.create({ url: newURL });
            sendResponse("OK");
            console.log("show-flow-data handled flowdata.html opened")
            break;
        case "get-flow-data":
            var key = "snapshots_" + request.board;
            console.log("get-flow-data for board "+ request.board);
            var response = getObjectFromStorage(key);
            if(!response){
                console.log("No flowdata available");
            }else{
               sendResponse(new BoardData(response));
               console.log("Flowdata sent to flowdata.html") 
            }
            
            break;
        case "delete-flow-data":
            console.log("delete-flow-data for " + request.board );
            var key = "snapshots_" + request.board;
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
    return taskBoardColorMap
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
