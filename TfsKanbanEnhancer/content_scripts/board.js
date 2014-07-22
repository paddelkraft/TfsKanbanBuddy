(function () {
    
    var is_focused = true;
    
    var customStylePale =
        ".board-tile.pale {background-color: transparent; border-color: #ddd; color: #ddd}" + 
        ".board-tile.yellow.pale {background-color: transparent; border-color: #ddd; color: #ddd}" + 
        ".board-tile.blue.pale {background-color: transparent; border-color: #ddd; color: #ddd}" + 
        ".board-tile.orange.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".board-tile.green.pale {background-color: transparent; border-color: #ddd; color: #ddd}" + 
        ".board-tile.pink.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".board-tile.asure.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".board-tile.purple.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".board-tile.expediter.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".board-tile.blocked.pale {background-color: transparent; border-color: #ddd; color: #ddd}" +
        ".board-tile.standard.pale {background-color: transparent; border-color: #ddd; color: #ddd}"
    ;
    
    var customStyleColor =
        ".board-tile.blue {background-color: #3276b1; border-color: #285e8e; color: white} " +
        ".board-tile.yellow {background-color: yellow; border-color: #D7DF01; color: black} " +
        ".board-tile.orange {background-color: #FF8000; border-color: #DF7401; color: black} " +
        ".board-tile.green {background-color: #00FF80; border-color: #01DF74; color: black} " +
        ".board-tile.pink {background-color: #F781F3; border-color: #FA58F4; color: black} " +
        ".board-tile.asure {background-color: #00FFFF; border-color: #01DFD7; color: black} " +
        ".board-tile.purple {background-color: #9A2EFE; border-color: #A901DB; color: white} " +
        ".board-tile.expediter {background-color: black; border-color: #DDDDDD; color: white} " +
        ".board-tile.blocked {background-color: #d2322d; border-color: #ac2925; color: white} " +
        ".board-tile.standard {border-left-color: rgb(0, 156, 204); background-color: rgb(214, 236, 242) color = black}"
    ;
    
    /*var colorMap = {"!"           : "expediter", 
                    "*"         : "blocked", 
                    "CR"        : "blue",
                    "AT"        : "yellow",
                    "BUG"       : "orange",
                    "CR"        : "blue",
                    "SUPPORT"   : "green",
                    "MAINT"     : "pink",
                    "FD"        : "asure",
                    "SPIKE"     : "purple"
                   };*/
    
    function improveBoard(colorMap) {
        console.log("colorMap = " + jsonEncode(colorMap));
        //var colorMap = jsonDecode(localStorage.getItem('colorMap'));
        if (!is_focused || ($(".board-tile").length < 1)) {
            setTimeout(function(){improveBoard(colorMap)}, 1000);
            return;
        }
        
        var allIds = [];
        
        $(".board-tile")
        .each(function () {
            var itemElm = $(this);
            allIds.push(itemElm.attr('data-item-id'));
        });
        
        console.log("Kanban improve: item ids: " + allIds);
        
        
        for (index = 0; index < allIds.length; ++index) {
            console.log(allIds[index]);
            
            
            
            var itemId = allIds[index];
            var itemClassification = "";
            
            var caseId = "";
            var $itemElm = $(".board-tile[data-item-id=" + itemId + "]");
            var tileText = $itemElm.text();
            var tileData = tileText.split(" ");
            
            itemClassification = tileData[0];
            
            
            for (i = 0; i < tileData.length; i ++) {
                console.log("tileData "+ i);
                if(tileData[i].indexOf("#")==0){
                    caseId = tileData[i];
                }
            }
            
            
            var caseId = getRelationId(tileData);
            
            // set woorktype
            if(colorMap[itemClassification]!="undefined"){
                setClass($itemElm,colorMap[itemClassification]);
            } else{
                setClass($itemElm, "standard");
            }
            
            // Set relation
            $itemElm.attr('data-case-id', caseId);
        }
        
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
    
    

    
    
    $(function () {
        
        chrome.runtime.sendMessage({type: "get-color-map"}, function(response) {
        improveBoard(response);
            
            setCaseHighLight();
            
            addGlobalStyle(customStylePale + customStyleColor);
            
            
            $(window)
            .focus(function () { is_focused = true; })
            .blur(function () { is_focused = false; });
        });
        
    });
    
})();
