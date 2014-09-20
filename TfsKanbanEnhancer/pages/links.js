    var numberOfLinks = 10;
    function saveLinks(){
        //var newColorMap = jsonDecode(document.getElementById("colorMap").value) ;
        var links = buildLinksObject() ;
        
        var message = {
            type: "set-links",
            links : links
        };
        chrome.extension.sendMessage(message,function(response){
            console.log("response = " + response);
            
        });
        console.log("Links sent to background");

    }

    function closeWindow(){
        window.close();
    }

    function populateLinksForm(){
        var links = null;
        var message = {
            type: "get-links"
        };
        chrome.extension.sendMessage(message,function(response){
            console.log ("Links Json  recieved= "+ jsonDecode(response));
            if(!response){
                console.log("No links available");
                return;
            }
            console.log("Links recieved = " + jsonEncode(response));
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

    function buildLinksObject(){
       var links= {};
       
            for(var index = 0; index<numberOfLinks; index++) {
                
                var value = document.getElementById("url" + index).value;
                var key = document.getElementById("cap" + index).value ;
                if(key !==""){
                    links[key]= value;
                }
            }
            return links;
    }

    function createLinksForm(){
      var divTemplate ='<div class="row500"><div class="left"><input id="capx" type="text" maxlength="255" value=""></div><div class="right300"><input id="urlx" type="text" value="" class="link"></div></div>';
      var linkContainer = document.getElementById("linksContainer");
      for(  var x = 0 ; x<numberOfLinks ; x++ ){
        var div = divTemplate.replace("capx", "cap"+ x).replace("urlx", "url" + x);
        linkContainer.innerHTML += div;
      }
      console.log ("Links form created");

    }

   function initLinks() {
        createLinksForm();
        populateLinksForm();
        document.getElementById("saveLinks").onclick = saveLinks;
    }