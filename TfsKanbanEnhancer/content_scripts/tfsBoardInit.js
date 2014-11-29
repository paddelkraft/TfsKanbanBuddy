(function (){
    chrome.extension.sendMessage({"type":"get-settings"},function(response){
        updateBoard(response);
    });
})();