(function () {
    
    var GET_KANBAN_BOARD_MAPPING = "get-color-map";
    var GET_TASK_BOARD_MAPPING = "get-task-color-map";
 
    var is_focused = true;

    var kanbanBoard = {
        "tileClass" : "board-tile",
        "relations" : "false"
    }

    var taskBoard   = {
        "tileClass" : "tbTileContent",
        "removeClass" :"witTitle",
        "update"    : "true",
        "relations" : "false"
    }

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
        ".$tileClass.standard.pale {background-color: transparent; border-color: #ddd; color: #ddd}"
    ;
    
    var customStyleColor =
        ".$tileClass.blue {background-color: #3276b1; border-color: #285e8e; color: white} " +
        ".$tileClass.yellow {background-color: yellow; border-color: #D7DF01; color: black} " +
        ".$tileClass.orange {background-color: #FF8000; border-color: #DF7401; color: black} " +
        ".$tileClass.green {background-color: #00FF80; border-color: #01DF74; color: black} " +
        ".$tileClass.pink {background-color: #F781F3; border-color: #FA58F4; color: black} " +
        ".$tileClass.asure {background-color: #00FFFF; border-color: #01DFD7; color: black} " +
        ".$tileClass.purple {background-color: #9A2EFE; border-color: #A901DB; color: white} " +
        ".$tileClass.expediter {background-color: black; border-color: #DDDDDD; color: white} " +
        ".$tileClass.blocked {background-color: #d2322d; border-color: #ac2925; color: white} " +
        ".$tileClass.standard {border-left-color: rgb(0, 156, 204); background-color: rgb(214, 236, 242) color = black}"
    ;
    
    
    function improveBoard(colorMap, board) {
        console.log("colorMap = " + jsonEncode(colorMap));
        console.log("Board data " + jsonEncode(board) );
        if (!is_focused || (getTiles(board).length < 1)) { //Todo fix so it works in taskboard getTiles()
            setTimeout(function(){improveBoard(colorMap,board)}, 1000);
            return;
        }
        
        getTiles(board)
        .each(function () {
            var $itemElm = $(this);
            setTileColor($itemElm,colorMap);
            if(board.relations){
                addRelationAttrubute($itemElm);
            }
        });
        
        if(board.removeClass != "undefined"){
            console.log("Removing class " + board.removeClass);
            $("."+board.removeClass).each(function(){
                var $element = $(this);
                $element.removeClass(board.removeClass);
            });
        }

        if(board.update!="undefined"){
            setTimeout(function(){improveBoard(colorMap,board)}, 5000);
        }
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

    function addRelationAttrubute($itemElm){
        var caseId = "";// Set relation
        var tileData = $itemElm.text().split(" ");
        caseId = getRelationId(tileData);
        $itemElm.attr('data-case-id', caseId);
            
    }
    
    function getRelationId(tileData){
        var index
        for (index = 0; index < tileData.length; index ++) {
            if(tileData[index].indexOf("#")==0){
                return tileData[index];
            }
        }
        return "";
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
            console.log('Mouse enter... case #:' + caseId)
            
            $("[data-case-id!='" + caseId + "']").addClass('pale')
        })
        .mouseleave(function (evt) {
            $("[data-case-id]").removeClass('pale')
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
        return document.URL.indexOf("/board/")>-1;
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
    
    $(function () {
        console.log("Userscript Starting")
        var type = getMessageType();
        
        chrome.runtime.sendMessage({type: type}, function(response) {
            var board = getBoardType();
            console.log("Board data " + jsonEncode(board) );
            improveBoard(response, board);
            
            if(board.relations){
                setCaseHighLight();
            }
            
            addGlobalStyle( setTileClass(customStylePale, board) 
                          + setTileClass(customStyleColor, board));
            
            
            $(window)
            .focus(function () { is_focused = true; })
            .blur(function () { is_focused = false; });
        });
        
    });
    
})();
