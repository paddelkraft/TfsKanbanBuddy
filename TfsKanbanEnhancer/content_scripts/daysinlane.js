

function daysInLane(){

    chrome.extension.sendMessage({"type":"get-flow-data","boardUrl":decodeUrlKeepEncodedSpaces( document.URL)},function(response){
        var boardData = new BoardData(response);
        var dilData = buildBoardEnhancementData(boardData);
        daysInLane(dilData);
    });

     function daysInLane(dilData){
         if ($(".id-title-container").length < 1) {
             setTimeout(daysInLane, 1000);
             console.log("no cards on board yet");
             return;
         }
         console.log("______dil__________");

         $("<div class='dil' ></div>").insertAfter(".id-title-container");
         $(".dil").each(function(){
             var element = $(this);
             var ticketId = $(element.siblings(".id-title-container").find(".id")).text();
             element.attr("style","display:none;");
             if(!dilData[ticketId]){
                 element.remove();
             }else if(dilData[ticketId].blockedSince !==""){
                 element.html("Days blocked = " + dilData[ticketId].blockedSince);
             }else{
                 element.html("Days in lane = "+ dilData[ticketId].daysInColumn);
             }
         });

     }


        function getId($elm){
          var sibling = $elm.siblings();
        };

};