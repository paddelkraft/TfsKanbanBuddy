var message = {
            type: "set-url",
            url: document.URL.split("/_backlogs")[0]
        }
        
chrome.extension.sendMessage(message,function(response){
    console.log("response = " + response);
});
        