function updateBoard(settings) {

    var textFilter;
    var GET_KANBAN_BOARD_MAPPING = "get-color-map";
    var GET_TASK_BOARD_MAPPING = "get-task-color-map";
    var FILTER_IDENTIFIER ="|";

    var is_focused = true;

    var kanbanBoard = {
        "type"      : "kanbanBoard",
        "tileClass":"board-tile",
        "contentContainerClass":"board-tile-content-container",
        "tileContentClass" : "board-tile-content"
    };

    var customStylePale =
            ".pale {opacity: 0.4;}" +
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
            ".$tileClass.std-1.pale {background-color: transparent; border-color: #ddd; color: #ddd}"+
            ".$tileClass.lightpurple.pale {background-color: transparent; border-color: #ddd; color: #ddd}"+
            ".board-tile.pale {border-left-color: transparent}"+
            ".duedate.white.pale {background-color: transparent; color: #ddd}"+
            ".duedate.yellow.pale {background-color: transparent; color: #ddd}"+
            ".duedate.red.pale {background-color: transparent; color: #ddd}"

        ;

    var customStyleColor =
            ".$tileClass.blue {background-color: #3276b1; border-color: #285e8e; color: white} " +
            ".$tileClass.yellow {background-color: yellow !important; border-left: #D7DF01 !important; color: black !important} " +
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
            ".$tileClass.std-1 {border-color: rgb(0, 156, 204); background-color: rgb(214, 236, 242) color = black}"+
            ".$tileClass.lightpurple {background-color: rgb(238, 226, 242); border-color: rgb(119, 59, 147); color: black}"+
            ".duedate.white {background-color: black; color: white} "+
            ".duedate.yellow {background-color: black; color: yellow} "+
            ".duedate.red {background-color: black; color: red} "+
            ".inprogress.on-wip{background-color: #FBFBEF;}"+
            ".inprogress.above-wip{background-color: #FBEFEF;}"+
            ".inprogress.below-wip{background-color: #FFFFFF;}"

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
        var standardColors = getStandardColors($tiles);
        var standardCardClasses = generateStandardCardClasses(standardColors);
        var standardBorderColors = getStandardBorderColors();
        var standardBorderClasses = generateStandardBoarderClasses(standardBorderColors);
        var filters;
        setStandardGlobalStyle(standardCardClasses);
        setStandardGlobalStyle(standardBorderClasses);
        function enhanceTiles($tiles) {
            setTileColors($tiles, colorMap, standardColors, standardBorderColors);
            highlightDates($tiles);
            setRelationAttributes($tiles);
            setEnchanced($tiles);
        }
        enhanceTiles($tiles);
        filters = setFilrerAttributes($tiles);
        if (! jQuery.isEmptyObject(filters)) {
            addFilterDropdown(filters);
        }
        addFilterTextbox();

        if(board.removeClass != "undefined"){
            //console.log("Removing class " + board.removeClass);
            $("."+board.removeClass).each(function(){
                var $element = $(this);
                $element.removeClass(board.removeClass);
            });
        }

        function filterBoard(){
            if($("#filter-select").length !== 0){
                applyFilter($("#filter-select").val(),board);
            }else{
                applyFilter('show all',board);
            }

            applyTextFilter(textFilter(),board);
        }

        $("#filter-select").change(filterBoard);
        $("#filter-text").change(filterBoard);



        setInterval(function(){
            var tiles = getTiles(board);
            enhanceTiles(tiles);
            console.log("Updated "+tiles.length + " tiles");
        }, 2000);

    }

    function setTileColors($tiles, colorMap, standardColors,standardBorderColors){
        $tiles.each(function () {
            var $itemElm = $(this);
            setTileColor($itemElm,colorMap,standardColors,standardBorderColors);

        });
    }

    function isEnchanced($itemElm){
        var $tileColorDiv =  $itemElm.find("."+kanbanBoard.tileContentClass)[0];
        if($($tileColorDiv).attr("class").toString().indexOf("buddy")>-1){

            return true;
        }
        return false;
    };

    function setEnchanced($items){
        _.forEach($items, function(item){
            var $tileColorDiv =  $(item).find("."+kanbanBoard.tileContentClass)[0];
            $($tileColorDiv).addClass("buddy");
        });

    };



    function setTileColor($itemElm,colorMap,standardColors, standardBorderColors){
        var itemClassification;
        var tileData = $itemElm.find(".title").text().split(" ");
        var $tileColorDiv =  $itemElm.find("."+kanbanBoard.tileContentClass)[0];
        var style = $($tileColorDiv).attr("style")
        var styleIndex = _.indexOf(standardColors,style);
        var contentContainerDiv = $itemElm.find("."+kanbanBoard.contentContainerClass)[0]
        var borderStyle = $(contentContainerDiv).attr("style");
        var borderStyleIndex = _.indexOf(standardBorderColors,borderStyle);
        itemClassification = tileData[0];
        // set woorktype

        if(isEnchanced($itemElm)){
            return
        }
        if(typeof colorMap[itemClassification]!=="undefined"){
            setTileContentClass($tileColorDiv,colorMap[itemClassification]);
            replaceStyle($itemElm.find("."+kanbanBoard.contentContainerClass)[0],"border"+borderStyleIndex);
        } else{
            setTileContentClass($tileColorDiv,"std"+styleIndex);
            replaceStyle($itemElm.find("."+kanbanBoard.contentContainerClass)[0],"border"+borderStyleIndex);
        }

    }

    function setTileContentClass(tileColorDiv,colorClass){
        replaceStyle(tileColorDiv,colorClass);
        removeStyle($(tileColorDiv).find(".title"));
    }

    function getStandardBorderColors(){
        var contentContainers = $("."+ kanbanBoard.contentContainerClass);
        return getStyles(contentContainers);
    }

    function getStyles(items){
        var styles = {};
        _.forEach(items,function(item){
            var style = $(item).attr("style");
            if(style){
                styles[style] = style;
            }

        });
        var standardStyles = [];
        _.forEach(styles,function(style){
            standardStyles.push(style);
            console.log("Std color :" + style);
        });
        return standardStyles;
    }

    function getStandardColors($tiles){
        var styles = {};
        _.forEach($tiles,function($tile){
            var style = $($tile).find("."+ kanbanBoard.tileContentClass).attr("style");
            if(style){
                styles[style] = style;
            }

        });
        var standardColors = [];
        _.forEach(styles,function(style){
            standardColors.push(style);
            console.log("Std color :" + style);
        });
        return standardColors;
    }

    function generateStandardCardClasses(standardColors){
        var styles = {};
        var index = 0
        _.forEach(standardColors,function(color){
            styles["std"+index] = "."+ kanbanBoard.tileContentClass+".std"+index + "{"+color+ "color: black}"+
            "." + kanbanBoard.tileContentClass +".std"+index+".pale {background-color: transparent; border-color: #ddd; color: #ddd}";
            index++;
        });
        return styles;
    }

    function generateStandardBoarderClasses(standardBorderColors){
        var styles = {};
        var index = 0
        _.forEach(standardBorderColors,function(color){
            styles["std"+index] = ".agile-board .board-tile ."+ kanbanBoard.contentContainerClass+".border"+index + "{"+color+"}"+
                ".agile-board .board-tile ."+ kanbanBoard.contentContainerClass+".border"+index + ".pale{border-left-color: #ddd;}"
            ;
            index++;
        });
        return styles;
    }

    function setStandardGlobalStyle(styles){
        var stdStyles ="";
        _.forEach(styles,function(style){
            stdStyles += style;
        });
        addGlobalStyle(stdStyles);
    }

    function highlightDate($itemElm){
        var tileData = $($itemElm.find(".clickable-title")).html();
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
            $($itemElm.find(".clickable-title")).html(tileData.replace(date, "<strong class='duedate "+color+"'>" + date + "</strong>"));
        }
    }

    function highlightDates($tiles){
        $tiles.each(function () {
            var $itemElm = $(this);
            if(isEnchanced($itemElm)){
                return
            }
            highlightDate($itemElm);
        });
    }


    function setRelationAttribute($itemElm){
        var caseId;// Set relation
        var tileData = $itemElm.text().split(" ");
        if(isEnchanced($itemElm)){
            return
        }
        caseId = getRelationId(tileData);
        $itemElm.attr('data-case-id', caseId);

    }

    function setRelationAttributes($tiles){
        _.forEach($tiles,function (tile) {
            var $itemElm = $(tile);
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
        var tileData = $itemElm.find(".title").text().split(" ");
        var filterId = getFilterId(tileData);
        if(filterId){
            tileData.pop();
            $itemElm.find(".title").text(tileData.join(" "));
        }
        $itemElm.attr('filter', filterId);
        return filterId;

    }

    function setFilrerAttributes($tiles){
        var filters = {};
        $tiles.each(function () {
            var $itemElm = $(this);
            var filter = setFilerAttribute($itemElm);
            if(filter !== ""){
                filters[filter] = null;
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

    function replaceStyle(elm, className) {
        $(elm).addClass(className);
        removeStyle(elm);
    }

    function removeStyle(elm){
        $(elm).removeAttr( "style" );
    }


    function setCaseHighLight() {
        if ($("[data-case-id]").length < 1) {
            setTimeout(setCaseHighLight, 1000);
            return;
        }

        function pale(){
            getTileContentDiv($(this)).addClass("pale");
            getTileContentContainerDiv($(this)).addClass("pale");
            $($(this).find(".duedate")).addClass("pale");
            $($(this).find("img")).addClass("pale");
        }

        function normal(){
            getTileContentDiv($(this)).removeClass("pale");
            getTileContentContainerDiv($(this)).removeClass("pale");
            $($(this).find(".duedate")).removeClass("pale");
            $($(this).find("img")).removeClass("pale");
        }

        $('[data-case-id]')
            .mouseenter(function (evt) {
                var caseId = $(evt.target).attr('data-case-id') || $(evt.target).closest('[data-case-id]').attr('data-case-id');
                if(caseId !== ""){
                    console.log('Mouse enter... case #:' + caseId);
                    $("[data-case-id!='" + caseId + "']").each(pale);
                    $("[data-case-id='" + caseId + "']").each(normal);
                }

            })
            .mouseleave(function (evt) {
                        $("[data-case-id]").each(normal);
            });
    }

    function getTileContentDiv(boardTile){
        return $(boardTile.find("."+kanbanBoard.tileContentClass)[0])
    }

    function getTileContentContainerDiv(boardTile){
        return $(boardTile.find("."+kanbanBoard.contentContainerClass)[0])
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

    function getTiles(board){
        var tiles;
        console.log("getTiles " + board.tileClass);
        tiles = $("."+board.tileClass);
        console.log("Tiles found");
        return tiles;
    }

    function setTileClass(css, board){
        var result = replaceAll(css ,"$tileClass", board.tileContentClass);
        console.log("CSS " + result);
        return result;
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
            colorMap = splitColors(settings.kanbanBoardColorMap);
        }
        callback(colorMap);
    }

    function splitColors(colorMap){
        var splittedColorMap ={};
        var prefix;
        var split;
        var index;
        for (prefix in colorMap ){
            split = prefix.split(";");
            for(index = 0;index<split.length;index++){
                splittedColorMap[split[index]] = colorMap[prefix];
            }

        }
        return splittedColorMap;
    }

    function userscript () {

        console.log("content-script board.js Starting");
        getSettings( function(response) {
            var board = kanbanBoard;
            console.log("Board data " + jsonEncode(board) );
            console.log("colorMap " + jsonEncode(response));
            if(response){
                improveBoard(response, board);
            }
            setCaseHighLight();
            addGlobalStyle(setTileClass(customStyleColor,board));
            addGlobalStyle(setTileClass(customStylePale,board));

            $(window)
                .focus(function () { is_focused = true; })
                .blur(function () { is_focused = false; });

        });



    }

    setTimeout(userscript,0);

}
