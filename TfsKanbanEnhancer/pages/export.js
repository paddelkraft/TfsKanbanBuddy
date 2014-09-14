var message = {
            type: "get-settings"
        }
        chrome.extension.sendMessage(message,function(response){
            document.location = 'data:Application/octet-stream,' +
              jsonEncode(response);
            console.log("Settings Exported " + jsonEncode(response) );
        });
        console.log("ExportSettings sent to background");