// listening for an event / one-time requests
// coming from the popup/and content

var colorMap = null;
var links = null;
var url = null;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    
    switch(request.type) {
        case "set-color-map":
            colorMap = request.colorMap;
            var colorMapJson =jsonEncode(colorMap)
            localStorage.setItem("colorMap", colorMapJson) ;
            sendResponse("Saved " );
            console.log("color-map saved to local storage " + localStorage.getItem("colorMap"));
            break;
        case "get-color-map":
            if(colorMap == null){
                colorMap = jsonDecode(localStorage.getItem("colorMap")) ;
                console.log("colorMap read from local storage")
            }
            sendResponse(colorMap);
            console.log("color-map sent " + jsonEncode(colorMap));
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

