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

    function createTicketObject(element){
        var isBlocked = (element.getAttribute("class").indexOf("blocked")> -1);
        var ticketObject = {
            id : element.getAttribute("data-item-id"),
            //$itemElm.find(".title").text()
            title : element.getElementsByClassName("title")[0].textContent,
            
        };
        if(isBlocked){
          ticketObject.blocked = isBlocked;
        }
        
        return ticketObject;
    }

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
   
    
    function getProjectUrl(){
        return boardUrl().split("/_backlogs/")[0];
    }


    

    function getGenericItemUrl(){
        var projectName = document.getElementsByClassName("project-name")[0].textContent;
        log("Url = "+boardUrl());
        return  boardUrl().split(projectName)[0] + projectName + "/_workitems#_a=edit&id=";
    }

    
    function takeSnapshot(giveFeedback){
        var message = {};
        message.type = "save-snapshot";
        message.snapshot = getBoardSnapshot();
        console.log("Snapshot = "+jsonEncode(message.snapshot));
        chrome.runtime.sendMessage(message, function(response){
            if(giveFeedback!==false){
                alert(response);
            }
            
        });
    }

    function showFlowData(){
         var message = {};
        message.type = "show-flow-data";
        message.board = boardUrl();
        chrome.runtime.sendMessage(message, function(response){
            log(response);
        });
    }

    function openPage(page){
         var message = {};
        message.type = "show-flow-data";
        message.page = page;
        message.board = boardUrl();
        message.boardUrl =
        chrome.runtime.sendMessage(message, function(response){
            log(response);
        });
    }

    function openDataPage(page){
        var message = {};
        message.type = "open-data-page";
        message.page = page;
        message.board = boardUrl();
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
        var i;
        //snapshot.time = timestamp();
        snapshot.milliseconds = new Date().getTime();
        var url =getProjectUrl();
        snapshot.board=url;
        snapshot.boardUrl = decodeUrlKeepEncodedSpaces( document.URL);
        snapshot.genericItemUrl = genericItemUrl;
        var headerContainer = document.getElementsByClassName("header-container")[0];
        var headers = headerContainer.getElementsByClassName("member-header-content");
        var columnContainer = document.getElementsByClassName("content-container")[0];
        var columns = columnContainer.getElementsByClassName("member-content");
        snapshot.lanes = [];
        for (i in headers) {
            if(headers[i].textContent !== undefined){
                var lane ={};
                snapshot.lanes.push(lane);
                lane.name =  headers[i].getAttribute("title");
                lane.wip = {};
                lane.wip.limit = 0;
                lane.wip.limit =  0;
                if(headers[i].getElementsByClassName("current")[0]){
                    
                    var current = headers[i].getElementsByClassName("current")[0].textContent;
                    lane.wip.current = (current==="")?0:parseInt(current);

                }
                if(headers[i].getElementsByClassName("limit")[0])
                {
                    var limit = headers[i].getElementsByClassName("limit")[0].textContent.replace("/","");
                    lane.wip.limit = (limit==="")?0:parseInt(limit) ;
                }
                var tickets = columns[i].getElementsByClassName("board-tile");
                lane.tickets = [];
                var j;
                for (j in tickets){
                    var ticket={};
                    if (tickets[j].textContent !== undefined){
                        lane.tickets.push(createTicketObject(tickets[j]));
                        
                    }
                }
                
            }

        }
        snapshot.cardCategory = getCardCategory();
        return snapshot;
    }

    //addProductBacklogViewTabsLink("Take board Snapshot", "#","takeSnapshot", takeSnapshot);
    addProductBacklogViewTabsLink("flow data", "#","showFlowData", showFlowData);
    addProductBacklogViewTabsLink("CFD", "#","cfd", function(){openDataPage("cfd")});
    var genericItemUrl = getGenericItemUrl();
    onloadSnapshot();

})();
