
	var GET_KANBAN_BOARD_MAPPING = "get-color-map";
  var GET_TASK_BOARD_MAPPING = "get-task-color-map";
  var SET_KANBAN_BOARD_MAPPING = "set-color-map";
  var SET_TASK_BOARD_MAPPING = "set-task-color-map";

  var saveType = null;
   
   function saveMapping(){
        var newColorMap = createColorMap() ;
        console.log("Saving colorMap");
        var message = {
            type: saveType,
            colorMap : newColorMap
        }
        chrome.extension.sendMessage(message,function(response){
            console.log("response = " + response);
        });
        console.log("colorMap "+ saveType +" sent to background");

    }

    function closeWindow(){
        window.close();
    }

    function createColorMap(){
        var colorMap = {};
        var id,value,input;
        var inputs = $(".color-input");
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

    function getColorMapping(type){
        console.log("sending " + type +" request to background")
        chrome.runtime.sendMessage({type: type}, function(response) {
             console.log("recieveing colorMap from background")
             clearInputs();
             if(!response){
               console.log("No color map available");
               return;
             }
             for(var property in response){
                document.getElementById(response[property]).value = property;
             }
        });
        saveType = SET_KANBAN_BOARD_MAPPING;
        if (type == GET_TASK_BOARD_MAPPING){
          saveType = SET_TASK_BOARD_MAPPING;
        }
    }

    function clearInputs(){
      //var inputs = getElementsByAttributeValue("type","text");
      var inputs = $(".color-input");
      var index; 
      for(index in inputs){
        inputs[index].value = "";
      }
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

    function loadMapping(){
      var type = GET_KANBAN_BOARD_MAPPING;
      if (document.getElementById("board-select").value=="task"){
        type = GET_TASK_BOARD_MAPPING;
      }
      getColorMapping(type);
    }

    function openSettings(){
      var newURL = "pages/settings.html";
      chrome.tabs.create({ url: newURL });

    }

    

    function initColorMap() {
        getColorMapping(GET_KANBAN_BOARD_MAPPING);
        document.getElementById("saveMapping").onclick = saveMapping;
        document.getElementById("board-select").onchange = loadMapping;
        
    }


    