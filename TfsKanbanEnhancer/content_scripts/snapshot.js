(function () {

    function log(text){
        console.log("Snapshot | " + text);
    }

    function onloadSnapshot(){
        var tiles = $(".board-tile");
        if(tiles.length === 0){
            setTimeout(onloadSnapshot,5000);
            return;
        }
        takeSnapshot(false);
    }


    function getBoardId(){
        var url = $(".cumulative-flow-chart").find("img").attr("src");
        var boardId = _.last(url.split("/_api")[0].split("/"));
        return boardId;
    }

    function getRequestVerificationToken(){
        try{
           return $('[name=__RequestVerificationToken]').val();
        }catch (err){}
    };

    function appendLiToUlByClass(matchClass, li) {
        var elems = document.getElementsByTagName('ul'), i;
        for (i in elems) {
            if ((' ' + elems[i].className + ' ').indexOf(' ' + matchClass + ' ') > -1) {
                elems[i].appendChild(li);
            }
        }
    }

    function addProductBacklogViewTabsLink(caption, url ,id, call) {
        var link = document.createElement('li');
        link.innerHTML = "<a id='"+ id +"'href='" + url + "' >" + caption + " </a>";
        appendLiToUlByClass("productbacklog-view-tabs", link);
        link.onclick = call;
        log("link with caption " + caption + "created" );
    }

    function boardUrl(){
        return decodeUrlKeepEncodedSpaces(document.URL);
    }

    function getGenericItemUrl(){
        var projectName =getProjectName();
        return  boardUrl().split(projectName)[0] + projectName + "/_workitems#_a=edit&id=";
    }

    function getProjectName(){
        var projectName ;
        if(document.getElementsByClassName("project-name")[0]){ //older version
            projectName = document.getElementsByClassName("project-name")[0].textContent;
        }else {
            projectName =$("span[title~='Project']").text();
        }

        return projectName;
    }
    function takeSnapshot(giveFeedback){
        var message = {};
        message.type = "trigger-snapshot";
        message.snapshot = getBoardSnapshot();
        console.log("Snapshot = "+jsonEncode(message.snapshot));
        chrome.runtime.sendMessage(message, function(response){
            if(giveFeedback!==false){
                alert(response);
            }
            
        });
    }


    function openDataPage(page){
        var message = {};
        message.type = "open-data-page";
        message.page = page;
        message.boardUrl = boardUrl();
        chrome.runtime.sendMessage(message, function(response){
            log(response);
        });
    }

    function getCardCategory(){
        var cfdImgContainer; 
        var imageSrc;
        var parameters;
        var cardCategory = null;
        try{
            cfdImgContainer = document.getElementsByClassName("cumulative-flow-chart small-chart-container")[0];
            imageSrc = cfdImgContainer.getElementsByTagName('img')[0].getAttribute("src");
            parameters = imageSrc.split("hubCategoryRefName=")[1].split("&");
            cardCategory = parameters[0];
        }catch(e){}
        return cardCategory;
    }

    function getBoardSnapshot(){
        var snapshot = {};
        var token;
        snapshot.milliseconds = new Date().getTime();
        snapshot.boardUrl = decodeUrlKeepEncodedSpaces( document.URL);
        snapshot.projectName = getProjectName();
        snapshot.genericItemUrl = getGenericItemUrl();
        snapshot.boardId = getBoardId();
        snapshot.cardCategory = getCardCategory();
        token = getRequestVerificationToken();
        if (token){
            snapshot.__RequestVerificationToken = token;
        }
        return snapshot;
    }

    addProductBacklogViewTabsLink("CFD", "#","reports", function(){openDataPage("cfd")});
    addProductBacklogViewTabsLink("Snapshot", "#","snapshot", function(){openDataPage("snapshot")});
    addProductBacklogViewTabsLink("Flow report", "#","flowreport", function(){openDataPage("flowreport")});
    addProductBacklogViewTabsLink("Flow Data Grid", "#","flowdatagrid", function(){openDataPage("flowdatagrid")});
    onloadSnapshot();

})();
