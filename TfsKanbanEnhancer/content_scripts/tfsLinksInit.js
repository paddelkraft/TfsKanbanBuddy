function tfsLinks(){
	//var keys = Object.keys(links);
	var links = null;
	var message = {
            type: "get-settings"
        };
        chrome.extension.sendMessage(message,function(response){
            addLinks(response);
        });
        console.log("Links recieved from background");

}

chrome.extension.sendMessage({type: "get-url"},function(response){
    console.log("response = " + response);
	if(document.URL.indexOf(response)>=0){
		tfsLinks();
	}
});
