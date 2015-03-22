// listening for an event / one-time requests
// coming from the popup/and content

var backgroundFactory = BackgroundFactory(localStorage, $,TimeUtil());

chrome.extension.onMessage.addListener(backgroundFactory.messageHandler());
backgroundFactory.autoImport(3600000);

function getApiSnapshots (apiSnapshots){
    console.log("get api snapshots");
    apiSnapshots();
    setTimeout(apiSnapshots,300000);
}

getApiSnapshots(backgroundFactory.getApiSnapshots());
