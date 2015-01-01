function fetchDataFromApi(timeout , apiUrl,boardUrl,genericItemUrl){
	
	var api;
	function fetch(){
		console.log("Fetch snapshot from api "+apiUrl );
		api = new ApiSnapshot(apiUrl,boardUrl,genericItemUrl);

		api.getSnapshot( function(snapshot){	
			console.log ("apiSnapshot built");
			saveSnapshot(snapshot);

		});

		setTimeout(fetch, timeout);
	}

	/*function saveSnapshot(snapshot){
        var message = {};
        message.type = "save-snapshot";
        message.snapshot = snapshot;
        console.log("sending snapshot to background");
        chrome.runtime.sendMessage(message, function(response){
            console.log("Response snapshot saved");
            
        });
    }*/

    fetch();

}

fetchDataFromApi(120000,"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_api/_backlog/GetBoard?__v=3",
				 "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection",
				 "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=");

