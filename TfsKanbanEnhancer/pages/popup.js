//popup.js
function openSettings(){
      var newURL = "pages/settings.html";
      chrome.tabs.create({ url: newURL });

    }

    

    window.onload = function() {
        openSettings();
    };