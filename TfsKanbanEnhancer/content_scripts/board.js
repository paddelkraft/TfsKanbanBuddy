(function () {
    
    var GET_KANBAN_BOARD_MAPPING = "get-color-map";
    var GET_TASK_BOARD_MAPPING = "get-task-color-map";
    var FILTER_IDENTIFIER ="|";
 
    var is_focused = true;
    var filters = {};

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
        ".$tileClass.blocked.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".$tileClass.lightgreen.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".$tileClass.gray.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".$tileClass.standard.pale {background-color: transparent; border-color: #ddd; color: #ddd}"
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
        ".$tileClass.blocked {background-color: #d2322d; border-color: #ac2925; color: white} " +
        ".$tileClass.lightgreen {background-color: #C3FCD4; border-color: #00FF80; color: black} " +
        ".$tileClass.gray {background-color: #A1A19F; border-color:black; color: white} " +
        ".$tileClass.standard {border-left-color: rgb(0, 156, 204); background-color: rgb(214, 236, 242) color = black}"
    ;
    
    
    function improveBoard(colorMap, board) {
        //console.log("colorMap = " + jsonEncode(colorMap));
        //console.log("Board data " + jsonEncode(board) );
        if (!is_focused || (getTiles(board).length < 1)) { //Todo fix so it works in taskboard getTiles()
            setTimeout(function(){improveBoard(colorMap,board)}, 1000);
            return;
        }
        
        getTiles(board)
        .each(function () {
            var $itemElm = $(this);
            var filter = "";
            setTileColor($itemElm,colorMap);
            if(board.relations){
                addRelationAttribute($itemElm);
                filter = addFilerAttribute($itemElm);
                if(filter !== ""){
                    filters[filterId] = null;
                }
            }
        });
        
        if (filters !=={}) {
           addFilterDropdown(filters); 
        }
        

        if(board.removeClass != "undefined"){
            //console.log("Removing class " + board.removeClass);
            $("."+board.removeClass).each(function(){
                var $element = $(this);
                $element.removeClass(board.removeClass);
            });
        }
        
        $("#filter-select").change(function(){
            applyFilter($("#filter-select").val(),board);
        })
        
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

    function addRelationAttribute($itemElm){
        var caseId = "";// Set relation
        var tileData = $itemElm.text().split(" ");
        caseId = getRelationId(tileData);
        $itemElm.attr('data-case-id', caseId);
        
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
    
    function addFilerAttribute($itemElm){
        var caseId = "";// Set relation
        var tileData = $itemElm.text().split(" ");
        filterId = getFilterId(tileData);
        $itemElm.attr('filter', filterId);
        return filterId;
        
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

    
    function setClass($elm, className) {
        
        $elm.addClass(className);
        $elm.removeAttr( "style" );
    }
    
    
    function setCaseHighLight() {
        if ($("[data-case-id]").length < 1) {
            setTimeout(setCaseHighLight, 1000);
            return;
        }
        
        $('[data-case-id]')
        .mouseenter(function (evt) {
            var caseId = $(evt.target).attr('data-case-id') || $(evt.target).closest('[data-case-id]').attr('data-case-id');
            if(caseId !== ""){
              console.log('Mouse enter... case #:' + caseId);
              $("[data-case-id!='" + caseId + "']").addClass('pale');
            }
            
        })
        .mouseleave(function (evt) {
            $("[data-case-id]").removeClass('pale');
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
        var tiles = $("."+board.tileClass);
        return tiles;
    }
    
    function setTileClass(css, board){
        var result = replaceAll(css ,"$tileClass", board.tileClass);
        console.log("CSS" + result);
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
          var timeout = 3600000; //Reload every hour 
        }
        setTimeout (location.reload,timeout);
    }
    
    $(function () {
        console.log("Userscript Starting");
        var type = getMessageType();
        
        chrome.runtime.sendMessage({type: type}, function(response) {
            
            var board = getBoardType();
            console.log("Board data " + jsonEncode(board) );
            console.log("colorMap " + jsonEncode(response));
            if(response){
                improveBoard(response, board);
            }

            
            if(board.relations){
                setCaseHighLight();
            }
            
            addGlobalStyle( setTileClass(customStylePale, board) +
                            setTileClass(customStyleColor, board));
            
            
            $(window)
            .focus(function () { is_focused = true; })
            .blur(function () { is_focused = false; });

            //setTimeout(function(){
            //    applyFilter("|x",board);
            //},10000);
            //setTimeout(function(){
            //    applyFilter(false,board);
            //},20000);
        });

        
        
    });
    
})();
