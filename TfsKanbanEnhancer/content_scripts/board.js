function updateBoard(settings) {
  
    var textFilter;
    var GET_KANBAN_BOARD_MAPPING = "get-color-map";
    var GET_TASK_BOARD_MAPPING = "get-task-color-map";
    var FILTER_IDENTIFIER ="|";
 
    var is_focused = true;
 
    var kanbanBoard = {
        "type"      : "kanbanBoard",
        "tileClass" : "board-tile",
        "relations" : true,
        "wip"       : true
    };
 
    var taskBoard   = {
        "type"      : "taskBoard",
        "tileClass" : "tbTileContent",
        "removeClass" :"witTitle",
        "update"    : true,
        "relations" : false,
        "wip"       : false
    };
 
    var customCardSize = ".largeCard {width: 150px !important;height: 95px !important;}";
 
    var customStylePale =
        ".$tileClass.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".$tileClass.yellow.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".$tileClass.blue.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".$tileClass.orange.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".$tileClass.green.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".$tileClass.pink.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".$tileClass.asure.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".$tileClass.purple.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".$tileClass.expediter.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".$tileClass.black.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".$tileClass.blocked.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".$tileClass.red.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".$tileClass.lightgreen.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".$tileClass.gray.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".$tileClass.standard.pale {background-color: transparent; border-color: #ddd; color: #ddd}"+
        ".duedate.white.pale {background-color: transparent; color: #ddd}"+
        ".duedate.yellow.pale {background-color: transparent; color: #ddd}"+
        ".duedate.red.pale {background-color: transparent; color: #ddd}"
        
    ;
    
    var customStyleColor =
        ".$tileClass.blue {background-color: #3276b1; border-color: #285e8e; color: white} " +
        ".$tileClass.yellow {background-color: yellow; border-color: #D7DF01; color: black} " +
        ".$tileClass.orange {background-color: #FF8000; border-color: #DF7401; color: black} " +
        ".$tileClass.green {background-color: #33A904; border-color: #1B5C01; color: white} " +
        ".$tileClass.pink {background-color: #F781F3; border-color: #FA58F4; color: black} " +
        ".$tileClass.asure {background-color: #00FFFF; border-color: #01DFD7; color: black} " +
        ".$tileClass.purple {background-color: #9A2EFE; border-color: #A901DB; color: white} " +
        ".$tileClass.expediter {background-color: black; border-color: #DDDDDD; color: white} " +
        ".$tileClass.black {background-color: black; border-color: #DDDDDD; color: white} " +
        ".$tileClass.blocked {background-color: #d2322d; border-color: #ac2925; color: white} " +
        ".$tileClass.red {background-color: #d2322d; border-color: #ac2925; color: white} " +
        ".$tileClass.lightgreen {background-color: #C3FCD4; border-color: #00FF80; color: black} " +
        ".$tileClass.gray {background-color: #A1A19F; border-color:black; color: white} " +
        ".$tileClass.standard {border-left-color: rgb(0, 156, 204); background-color: rgb(214, 236, 242) color = black}"+
        ".duedate.white {background-color: black; color: white} "+
        ".duedate.yellow {background-color: black; color: yellow} "+
        ".duedate.red {background-color: black; color: red} "
        
    ;
    
   
    
    
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
        //console.log("tile colors set");
        if (board.relations){
            setLargeCards($tiles);
            setRelationAttributes($tiles);
            var filters = setFilrerAttributes($tiles);
            if (! jQuery.isEmptyObject(filters)) {
                addFilterDropdown(filters);
            }
			addFilterTextbox();
        }
        
        
        
 
        if(board.removeClass != "undefined"){
            //console.log("Removing class " + board.removeClass);
            $("."+board.removeClass).each(function(){
                var $element = $(this);
                $element.removeClass(board.removeClass);
            });
        }
        
        function filterBoard(){
            applyFilter($("#filter-select").val(),board);
            applyTextFilter(textFilter(),board);
        }
        
        $("#filter-select").change(filterBoard);

        $("#filter-text").change(filterBoard);

        if (board.wip) {
            checkWip();
        }
 
        if(board.update){
            setTimeout(function(){improveBoard(colorMap,board);}, 5000);
        }
        reloadBoardTimeout(3600000);
 
 
    }
 
function checkWip(){
    var i;
    var columns = getColumns();
    var thisColumn,nextColumn ;
     for (i = 1 ; i < columns.length-1 ; i++) { //fist and last column dont have wips.
            thisColumn = columns[i];
            nextColumn = (i<columns.length-2)? columns[i +1]:null; //Last lane never part of wip.
            //console.log("check wip " + columns[i].title);
            var wip, wipLimit, useNext = false;
            if(thisColumn.wipLimit){
                wipLimit = thisColumn.wipLimit;
                wip = thisColumn.getCurrentWip();
                //if next column is a done column (Wiplimit == 0)
                if(nextColumn && !nextColumn.wipLimit ){
                    //console.log("Include " + nextColumn.title + "in wip");
                    useNext = true;
                        wip += nextColumn.getCurrentWip();
                    thisColumn.setCurrentWip(wip);
                    nextColumn.setCurrentWip("");
                }
 
                if(wip > wipLimit){
                    //console.log("wipLimit broken");
                    thisColumn .setColumnColor("#FBEFEF");
                    if(useNext){
                        nextColumn.setColumnColor("#FBEFEF");
                    }
                }else if(wip == wipLimit){
                    //console.log("on wiplimit");
                    thisColumn.setColumnColor("#FBFBEF");
                    if(useNext){
                        nextColumn.setColumnColor("#FBFBEF");
                    }
                }else{
                    //console.log("on wiplimit");
                    thisColumn.setColumnColor("#FFFFFF");
                    if(useNext){
                        nextColumn.setColumnColor("#FFFFFF");
                    }
                }
            }
            
    }
    setTimeout(checkWip, 5000);
}
 
function getColumns(){
 
    var headerContainer = document.getElementsByClassName("header-container")[0];
    var headers = headerContainer.getElementsByClassName("member-header-content");
    var columnContainer = document.getElementsByClassName("content-container")[0];
    var columnContainers = columnContainer.getElementsByClassName("member-content");
    var columns =[];
    for (var i in headers) {
        if(headers[i].textContent !== undefined){
           // console.log(headers[i].textContent);
            column = {};
            column.title = headers[i].getAttribute("title");
            column.header = headers[i];
            column.container = columnContainers[i];
            column.setColumnColor = setColumnColor;
            column.setCurrentWip = setCurrentWip;
            column.getCurrentWip = getCurrentWip;
            //set wipLimit
            if(column.header.getElementsByClassName("limit")[0]){
                column.wipLimit = parseInt(column.header.getElementsByClassName("limit")[0].textContent.replace("/",""));
                //console.log("wipLimit ="+column.wipLimit);
            }
            
           columns.push(column);
        }
    }
 
    return columns;
 
}
 
function setCurrentWip(currentWip){
    try{
        this.header.getElementsByClassName("current")[0].textContent = currentWip;
    }catch(e){}
}
 
function getCurrentWip(){
    return this.container.getElementsByClassName(kanbanBoard.tileClass).length;
}
 
function setColumnColor( color){
    var style = "background-color:"+color;
    //console.log("setColumnColor");
    this.container.setAttribute("style",style);
    
    this.header.parentNode.setAttribute("style",style);
    //console.log(this.title + " style = " + this.container.getAttribute("style"));
}
 
 
 
    function setTileColor($itemElm,colorMap){
        var itemClassification = "";
        var tileData = $itemElm.text().split(" ");
        itemClassification = tileData[0];
        // set woorktype
        if(colorMap[itemClassification]!="undefined"){
            setClass($itemElm,colorMap[itemClassification]);
        } else{
            setClass($itemElm, "standard");
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
 
    function setLargeCards($tiles){
        $tiles.each(function () {
            var $itemElm = $(this);
            setLargeCard($itemElm);
        });
    }
 
    function setLargeCard($itemElm){
        setClass($itemElm,"largeCard");
    }
 
    function setRelationAttribute($itemElm){
        var caseId = "";// Set relation
        var tileData = $itemElm.text().split(" ");
        caseId = getRelationId(tileData);
        $itemElm.attr('data-case-id', caseId);
        
    }
 
    function setRelationAttributes($tiles){
        $tiles.each(function () {
            var $itemElm = $(this);
            setRelationAttribute($itemElm);
        });
    }
    
    function getRelationId(tileData){
        var index;
        for (index = 0; index < tileData.length; index ++) {
            if(tileData[index].indexOf("#")===0){
                return tileData[index];
            }
        }
        return "";
    }
    
    function setFilerAttribute($itemElm){
        var caseId = "";// Set relation
        var tileData = $itemElm.find(".title").text().split(" ");
        filterId = getFilterId(tileData);
        $itemElm.attr('filter', filterId);
        return filterId;
        
    }
 
    function setFilrerAttributes($tiles){
        var filters = {};
        $tiles.each(function () {
            var $itemElm = $(this);
            var filter = "";
                filter = setFilerAttribute($itemElm);
                if(filter !== ""){
                    filters[filterId] = null;
                }
        });
        console.log("Filters found on board = " + jsonEncode(filters));
        return filters;
    }
 
    function getFilterId(tileData){
        if(tileData[tileData.length-1].indexOf(FILTER_IDENTIFIER)===0){
            return tileData[tileData.length-1];
        }
        return "";
    }
 
    function applyFilter(filter, board){
        getTiles(board)
        .each(function () {
            var $itemElm = $(this);
            if (filter!=='show all' && filter != $itemElm.attr("filter")){
                $itemElm.attr("style","display:none;");
            }else{
                $itemElm.attr("style","");
            }
        });
    }


    function applyTextFilter(filter, board){
		console.log("applyTextFilter: " + filter);
        getTiles(board)
        .each(function () {
            var $itemElm = $(this);
			//var title=$itemElm.find(".title").text().toUpperCase();
			var title=$itemElm.text().toUpperCase();
			console.log("Title: " + title);
			
            if (title.indexOf(filter.toUpperCase()) === -1){
                $itemElm.attr("style","display:none;");
            }
		});
    }
 
    function addFilterDropdown(filters) {
        var select = document.createElement('select');
        select.setAttribute("id","filter-select");
        var html = "<option value='show all'>Show all </option><option value=''>Unfiltered</option>";
        for(var filter in filters){
            html += "<option value='"+ filter + "'>"+filter.replace(FILTER_IDENTIFIER,"") + "</option>";
        }
        select.innerHTML = html;
        $('.hub-title').append(select);
    }

    function watermark(inputId,watermarkText) {
     $('#'+inputId).blur(function(){
      if ($(this).val().length === 0){
        $(this).val(watermarkText).addClass('watermark');
      }
        
     }).focus(function(){
      if ($(this).val() === watermarkText){
        $(this).val('').removeClass('watermark');
      }
     }).val(watermarkText).addClass('watermark');
    }

 
    function addFilterTextbox() {
        var textbox = document.createElement('input');
		textbox.type = 'text';
		textbox.setAttribute("id","filter-text");
        $('.hub-title').append(textbox);
        watermark("filter-text","Filter cards");
        textFilter = function(){
            var filter = "";
            if(!$(textbox).hasClass("watermark")){
                filter = $(textbox).val();
            }
            return filter;
        };
    }


 
    
    function setClass($elm, className) {
        
        $elm.addClass(className);
        $elm.removeAttr( "style" );
    }
    
    
    function setCaseHighLight() {
        if ($("[data-case-id]").length < 1) {
            setTimeout(setCaseHighLight, 1000);
            return;
        }
        
        function pale(){
            $(this).addClass("pale");
            $(this).find(".duedate").addClass("pale");
        }

        function normal(){
            $(this).removeClass("pale");
            $(this).find(".duedate").removeClass("pale");
        }

        $('[data-case-id]')
        .mouseenter(function (evt) {
            var caseId = $(evt.target).attr('data-case-id') || $(evt.target).closest('[data-case-id]').attr('data-case-id');
            hovered = caseId;
           
            if(caseId !== ""){
              console.log('Mouse enter... case #:' + caseId);
              //$("[data-case-id!='" + caseId + "']").addClass('pale');
              $("[data-case-id!='" + caseId + "']").each(pale);
              //$("[data-case-id='" + caseId + "']").removeClass('pale');
              $("[data-case-id='" + caseId + "']").each(normal);
            }
            
        })
        .mouseleave(function (evt) {
            hovered = "";
            setTimeout(function(){
                if (hovered === ""){
                    //$("[data-case-id]").removeClass('pale');
                    $("[data-case-id]").each(normal);

                }
            },200);
            
        });
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
    
    
    function isKanbanBoard(){
        return document.URL.indexOf("/_backlogs/board")>-1;
    }
 
    function getMessageType(){
        var type = GET_TASK_BOARD_MAPPING;
        if(isKanbanBoard()){
            type = GET_KANBAN_BOARD_MAPPING;
        }
        return type;
    }
 
    function getBoardType(){
        var board = taskBoard;
        if(isKanbanBoard()){
            board = kanbanBoard;
        }
        console.log("Board data " + jsonEncode(board) );
        return board;
    }
 
    function getTiles(board){
        var tiles;
        console.log("getTiles " + board.tileClass);
        tiles = $("."+board.tileClass);
        console.log("Tiles found");
        return tiles;
    }
    
    function setTileClass(css, board){
        var result = replaceAll(css ,"$tileClass", board.tileClass);
        console.log("CSS " + result);
        return result;
    }
 
    function escapeRegExp(string) {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }
 
    function replaceAll(string, find, replace) {
        return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }
 
    function reloadBoardTimeout(timeout){
        if(!timeout){
          timeout = 3600000; //Reload every hour 
        }
        setTimeout (location.reload,timeout);
    }
    
    
    function getSettings(callback){
      console.log("Settings " + jsonEncode(settings));
      var colorMap = {};
      
      if(settings){
          console.log("Settings.colormap");
          var type = getMessageType();  
          if (settings.kanbanBoardColorMap){
            colorMap = settings.kanbanBoardColorMap;
          }
          
          if(type === GET_TASK_BOARD_MAPPING){
              colorMap = settings.taskBoardColorMap;
          }
      }
      
      callback(colorMap);
       
      
    }
    
    
    
   
     
  
    function userscript () {
        
        console.log("content-script board.js Starting");
        getSettings( function(response) {  
            var board = getBoardType();
            console.log("Board data " + jsonEncode(board) );
            console.log("colorMap " + jsonEncode(response));
            if(response){
                improveBoard(response, board);
            }
 
            
            if(board.relations){
                setCaseHighLight();
            }
            
            addGlobalStyle(
                setTileClass(customCardSize+customStylePale +
                    customStyleColor,
                    board
                )
            );
            
            
            $(window)
            .focus(function () { is_focused = true; })
            .blur(function () { is_focused = false; });
 
        });
 
        
        
    }
    
    setTimeout(userscript,0);
    
}
