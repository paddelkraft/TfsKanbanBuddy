
	

   
   function saveMapping(){
        //var newColorMap = jsonDecode(document.getElementById("colorMap").value) ;
        var newColorMap = createColorMap() ;
        
        //localStorage["user"] = user ;
        //localStorage.setItem("colorMap", colorMap) ;
        var message = {
            type: "set-color-map",
            colorMap : newColorMap
        }
        chrome.extension.sendMessage(message,function(response){
            console.log("response = " + response)
        });
        console.log("colorMap sent to background");

    }

    function closeWindow(){
        window.close();
    }

    function createColorMap(){
        var colorMap = {};
        var id,value,input;
        var inputs = getElementsByAttributeValue("type", "text");
        for(var i = 0; i < inputs.length; i++){
            if(inputs[i].value != ""){
                id = inputs[i].id;
                value = inputs[i].value;
                colorMap[value] = id;
                console.log(value + " = "+ id);
            }
        }
        return colorMap;
    }

    function getColorMapping(){
        chrome.runtime.sendMessage({type: "get-color-map"}, function(response) {
             for(var property in response){
                document.getElementById(response[property]).value = property;
             }
        });
    }

    


    function getElementsByAttributeValue(attribute , attributeValue){
      var matchingElements = [];
      var allElements = document.getElementsByTagName('*');
      for (var i = 0, n = allElements.length; i < n; i++)
      {
        if (allElements[i].getAttribute(attribute) && allElements[i].getAttribute(attribute)==attributeValue )
        {
          // Element exists with attribute. Add to array.
          console.log("item found value = " + allElements[i].value + " id = " + allElements[i].getAttribute("id"));
          allElements[i].id = allElements[i].getAttribute("id");
          matchingElements.push(allElements[i]);
        }
      }
      return matchingElements;
    }

    window.onload = function() {
        getColorMapping();
        document.getElementById("save").onclick = saveMapping;
        document.getElementById("close").onclick = closeWindow;
    };

    