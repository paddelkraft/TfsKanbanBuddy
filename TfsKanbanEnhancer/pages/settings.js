    function saveLinks(){
        //var newColorMap = jsonDecode(document.getElementById("colorMap").value) ;
        var links = createLinks() ;
        
        var message = {
            type: "set-links",
            links : links
        }
        chrome.extension.sendMessage(message,function(response){
            console.log("response = " + response)
            
        });
        console.log("Links sent to background");

    }

    function closeWindow(){
        window.close();
    }

    function getLinks(){
        var links = null;
        var message = {
            type: "get-links"
        }
        chrome.extension.sendMessage(message,function(response){
            console.log("response = " + jsonEncode(response));
            links = response;
            
            var index = 0;
            for(var key in links) {
                var value = links[key];
                document.getElementById("cap" + index).value = key;
                document.getElementById("url" + index).value = value;
                index ++;
            }
        });
        console.log("Links recieved from background");
    }

    function createLinks(){
       var links= {};
       
            for(var index = 0; index<6; index++) {
                
                var value = document.getElementById("url" + index).value;
                var key = document.getElementById("cap" + index).value ;
                if(key !=""){
                    links[key]= value;
                }
            } 
            return links;
    }

    window.onload = function() {
        getLinks();
        document.getElementById("save").onclick = saveLinks;
        document.getElementById("close").onclick = closeWindow;
    };