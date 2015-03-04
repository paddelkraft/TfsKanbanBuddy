function updateBoard(settings) {
  
    var GET_TASK_BOARD_MAPPING = "get-task-color-map";
    
    var is_focused = true;
 
 
    var taskBoard   = {
        "type"      : "taskBoard",
        "tileClass" : "tbTile",
        "removeClass" :"witTitle",
        "update"    : true,
        "relations" : false,
        "wip"       : false
    };
 
    var customStyleColor =
        ".duedate.white {background-color: black; color: white} "+
        ".duedate.yellow {background-color: black; color: yellow} "+
        ".duedate.red {background-color: black; color: red} "
    ;

    //border-left-color: rgb(242, 203, 29); background-color: rgb(246, 245, 210);
    var customColor = { "blue": ["border-left-color:#285e8e;","background-color:  #3276b1;"," color: white;"],
                        "yellow": ["border-left-color: #D7DF01;","background-color: yellow;"," color: black;"],
                        "orange": ["border-left-color: #DF7401;","background-color: #FF8000;"," color: black;"],
                        "green": ["border-left-color: #1B5C01;","background-color: #33A904;"," color: white;"],
                        "pink": ["border-left-color: #FA58F4;","background-color: #F781F3;"," color: black;"],
                        "asure": ["border-left-color: #01DFD7;","background-color: #00FFFF;"," color: black;"],
                        "asure": ["border-left-color: #01DFD7;","background-color: #00FFFF;"," color: black;"],
                        "purple": ["border-left-color: #A901DB;","background-color: #9A2EFE;"," color: white;"],
                        "expediter": ["border-left-color: #DDDDDD;","background-color: black;"," color: white"],
                        "black": ["border-left-color: #DDDDDD;","background-color: black;"," color: white;"],
                        "blocked": ["border-left-color: #ac2925;","background-color: #d2322d;"," color: white;"],
                        "red": ["border-left-color: #ac2925;","background-color: #d2322d;"," color: white"],
                        "lightgreen": ["border-left-color: #00FF80;","background-color: #C3FCD4;","color: black"],
                        "gray": ["border-left-color:black; ","background-color: #A1A19F;","color: white"],
                        "standard": ["border-left-color: rgb(0, 156, 204);"," background-color: rgb(214, 236, 242); ","color:black;"],
                        "lightpurple":[" border-left-color: rgb(119, 59, 147);","background-color: rgb(238, 226, 242);","color:black"]
                       };
    
    function improveBoard(colorMap, board) {
        //console.log("colorMap = " + jsonEncode(colorMap));
        //console.log("Board data " + jsonEncode(board) );
        //alert("");
        console.log("ImproveBoard " + jsonEncode(board));
        if (getTiles(board).length < 1) {
            setTimeout(function(){improveBoard(colorMap,board);}, 1000);
            console.log("no cards on board yet");
            return;
        }
        
        var $tiles = getTiles(board);
        console.log($tiles.length + " tiles on board");
        setTileColors($tiles,colorMap);
        highlightDates($tiles);
        setTimeout(function(){improveBoard(colorMap,board);}, 2000);
            
        
    }
 
 
    function setTileColor($itemElm,colorMap){
        var itemClassification = "";
        var tileData = $itemElm.find(".witTitle").text().split(" ");
        var newBoardSetup = false
        itemClassification = tileData[0];
        // set woorktype
        var temp = $itemElm.find(".editIcon");
        if($itemElm.find(".editIcon").length!==0){
            newBoardSetup = true;
        }
        console.log("colorMap[itemClassification] = " + colorMap[itemClassification]);
        if(typeof colorMap[itemClassification]!="undefined"){
            if(!newBoardSetup){
                setStyle($itemElm.find(".tbTileContent"),customColor[colorMap[itemClassification]][0] + " " + customColor[colorMap[itemClassification]][1]);
            }else{
                setStyle($itemElm,customColor[colorMap[itemClassification]][0])
                setStyle($itemElm.find(".tbTileContent"),customColor[colorMap[itemClassification]][1]);
            }

            setStyle($itemElm.find(".witTitle"),customColor[colorMap[itemClassification]][2]);
        } else{
            //setStyle($itemElm, customColor[""]);
        }
    }
 
    function setTileColors($tiles, colorMap){
        $tiles.each(function () {
            var $itemElm = $(this);
            setTileColor($itemElm,colorMap);
        });
    }

    function highlightDate($itemElm,colorMap){
        var itemClassification = "";
        var tileData = $itemElm.html();
        var date = tileData.match(/\d{4}-\d{2}-\d{2}/);
        var color = "white";
        var dateObject;
        var daysUntil;
        if(date){
            dateObject = new Date(date);
            daysUntil = timeUtil.daysUntil(dateObject.getTime());
            if(daysUntil<2){
                color = "red";
            }else if (daysUntil < 7){
                color = "yellow";
            }
            $itemElm.html(tileData.replace(date, "<strong class='duedate "+color+"'>" + date + "</strong>"));
        }
    }

    function highlightDates($tiles){
        $tiles.each(function () {
            var $itemElm = $(this);
            highlightDate($itemElm);
        });
    }
 
    
    
    function setStyle($elm, style) {
        
        $elm.attr("style",style);
    }
    
    function getTiles(board){
        var tiles;
        console.log("getTiles " + board.tileClass);
        tiles = $("."+board.tileClass);
        console.log("Tiles found");
        return tiles;
    }
     
    function escapeRegExp(string) {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }
 
    function replaceAll(string, find, replace) {
        return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }
 
    
    
    
    function getSettings(callback){
      console.log("Settings " + jsonEncode(settings));
      var colorMap = {};
      
      if(settings){
          console.log("Settings.colormap");
          var type = GET_TASK_BOARD_MAPPING;
          if (settings.kanbanBoardColorMap){
            colorMap = settings.kanbanBoardColorMap;
          }
          
          if(type === GET_TASK_BOARD_MAPPING){
              colorMap = settings.taskBoardColorMap;
          }
      }
      
      callback(colorMap);
       
      
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    
    
    function userscript () {
        
        console.log("content-script board.js Starting");
        getSettings( function(response) {
            var board = taskBoard;
            console.log("Board data " + jsonEncode(taskBoard) );
            console.log("colorMap " + jsonEncode(response));
            if(response){
                improveBoard(response, taskBoard);
            }
            
            addGlobalStyle(customStyleColor);
            $(window)
            .focus(function () { is_focused = true; })
            .blur(function () { is_focused = false; });
 
        });
 
        
        
    }
    
    setTimeout(userscript,0);
    
}
