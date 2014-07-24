// listening for an event / one-time requests
// coming from the popup/and content
var GET_KANBAN_BOARD_MAPPING = "get-color-map";
  var GET_TASK_BOARD_MAPPING = "get-task-color-map";
  var SET_KANBAN_BOARD_MAPPING = "set-color-map";
  var SET_TASK_BOARD_MAPPING = "set-task-color-map";



var kanbanColorMap = null;
var taskColorMap = null;
var links = null;
var url = null;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    
    switch(request.type) {
        case SET_KANBAN_BOARD_MAPPING:
            kanbanColorMap = request.ColorMap;
            var kanbanColorMapJson =jsonEncode(kanbanColorMap)
            localStorage.setItem("colorMap", kanbanColorMapJson) ;
            sendResponse("Saved " );
            console.log("Kanban color-map saved to local storage " + localStorage.getItem("colorMap"));
            break;
        case GET_KANBAN_BOARD_MAPPING:
            if(kanbanColorMap == null){
                kanbanColorMap = jsonDecode(localStorage.getItem("colorMap")) ;
                console.log("ColorMap read from local storage")
            }
            sendResponse(kanbanColorMap);
            console.log("color-map sent " + jsonEncode(kanbanColorMap));
            break;
        case SET_TASK_BOARD_MAPPING:
            taskColorMap = request.colorMap;
            var taskColorMapJson =jsonEncode(taskColorMap)
            localStorage.setItem("taskColorMap", taskColorMapJson) ;
            sendResponse("Saved " );
            console.log("Task color-map saved to local storage " + localStorage.getItem("taskColorMap"));
            break;
        case GET_TASK_BOARD_MAPPING:
            if(taskColorMap == null){
                taskColorMap = jsonDecode(localStorage.getItem("taskColorMap")) ;
                console.log("taskColorMap read from local storage")
            }
            sendResponse(taskColorMap);
            console.log("task-color-map sent " + jsonEncode(taskColorMap));
            break;
        case "set-links":
            links = request.links;
            var linksJson =jsonEncode(links)
            localStorage.setItem("links", linksJson) ;
            sendResponse("Saved " );
            console.log("Links saved to local storage " + localStorage.getItem("links"));
            break;
        case "get-links":
            if(links == null){
                links = jsonDecode(localStorage.getItem("links")) ;
                console.log("links read from local storage")
            }
            sendResponse(links);
            console.log("links sent " + jsonEncode(links));
            break;
        case "set-url":
            url = request.url;
            var urlJson =jsonEncode(url)
            localStorage.setItem("url", urlJson) ;
            sendResponse("Saved " );
            console.log("url saved to local storage " + localStorage.getItem("url"));
            break;
        case "get-url":
            if(url == null){
                url = jsonDecode(localStorage.getItem("url")) ;
                console.log("url read from local storage")
            }
            sendResponse(url);
            console.log("url sent " + jsonEncode(url));
            break;
    }
    return true;
});

