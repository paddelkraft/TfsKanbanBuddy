// listening for an event / one-time requests
// coming from the popup/and content
var GET_KANBAN_BOARD_MAPPING = "get-color-map";
  var GET_TASK_BOARD_MAPPING = "get-task-color-map";
  var SET_KANBAN_BOARD_MAPPING = "set-color-map";
  var SET_TASK_BOARD_MAPPING = "set-task-color-map";



var kanbanBoardColorMap = null;
var taskBoardColorMap = null;
var links = null;
var url = null;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    
    switch(request.type) {
        case SET_KANBAN_BOARD_MAPPING:
            kanbanBoardColorMap = request.colorMap;
            saveObjectToStorage( "colorMap" , kanbanBoardColorMap);
            sendResponse("Saved " );
            console.log("Kanban color-map saved to local storage " + localStorage.getItem("colorMap"));
            break;
        case GET_KANBAN_BOARD_MAPPING:
            sendResponse(getKanbanBoardColorMap());
            console.log("color-map sent " + jsonEncode(getKanbanBoardColorMap()));
            break;
        case SET_TASK_BOARD_MAPPING:
            taskBoardColorMap = request.colorMap;
            saveObjectToStorage("taskBoardColorMap", taskBoardColorMap) ;
            sendResponse("Saved " );
            console.log("task-color-map saved to local storage " + localStorage.getItem("taskBoardColorMap"));
            break;
        case GET_TASK_BOARD_MAPPING:
            sendResponse(getTaskBoardColorMap());
            console.log("task-color-map sent " + jsonEncode(getTaskBoardColorMap()));
            break;
        case "set-links":
            links = request.links;
            saveObjectToStorage("links", links) ;
            sendResponse("Saved " );
            console.log("Links saved to local storage " + localStorage.getItem("links"));
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
        case "save-snapshot":
            var snapshot = request.snapshot;
            var key = "snapshots_" + snapshot.board;
            var snapshots = getObjectFromStorage("snapshots_" + snapshot.board);
           // Reset snapshot var snapshots = {};
           if(!snapshots || !snapshots.board){
                snapshots = {};
                snapshots.board = snapshot.board;
                snapshots.snapshots = [];
            }
            //Should only save first and last snapshot of day.
            if( snapshots.snapshots.length >1 && isSameDay(snapshots.snapshots[snapshots.snapshots.length-2].time, snapshot.time )){
                snapshots.snapshots[snapshots.snapshots.length-1] = snapshot;
            } else {
                snapshots.snapshots.push(snapshot);
            }

            saveObjectToStorage(key, snapshots);
            sendResponse("Saved");
            console.log("snapshot stored with key " + key);
            //console.log(getStringFromStorage(key));
            break;
        case "show-flow-data":
            saveStringToStorage("flowBoard", request.board);//Todo show flow data in new tab
            console.log("flowdata for"  + request.board + " requested");
            var newURL = "pages/flowData.html";
            chrome.tabs.create({ url: newURL });
            sendResponse("OK");
            console.log("show-flow-data handled flowdata.html opened")
            break;
        case "get-flow-data":
            var key = "snapshots_" + request.board;
            if(!request.board){
                key = "snapshots_" + getStringFromStorage("flowBoard");    
            }
            
            console.log("getflowData with key " +key)
            var response = getObjectFromStorage(key);
            if(!response){
                console.log("No flowdata available");
            }else{
               sendResponse(response);
               console.log("Flowdata sent to flowdata.html") 
            }
            
            break;
    }
    return true;
});

function getBoardLinks(){
    if(links == null){
        links = getObjectFromStorage("links") ;
        console.log("links read from local storage");
    }
    return links;
}

function getTaskBoardColorMap(){
    if(taskBoardColorMap == null){
                taskBoardColorMap = getObjectFromStorage("taskBoardColorMap") ;
                console.log("taskColorMap read from local storage");
    }
    return taskBoardColorMap
}

function getKanbanBoardColorMap(){
    if(kanbanBoardColorMap == null){
        kanbanBoardColorMap = getObjectFromStorage("colorMap");//jsonDecode(localStorage.getItem("colorMap")) ;
        console.log("ColorMap read from local storage");
    }
    return kanbanBoardColorMap;
}
