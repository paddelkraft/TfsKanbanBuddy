// listening for an event / one-time requests
// coming from the popup/and content

var backgroundFactory = BackgroundFactory(localStorage, $,TimeUtil());


chrome.extension.onMessage.addListener(backgroundFactory.messageHandler());
backgroundFactory.autoImport(3600000);

function getApiSnapshots (apiSnapshots){
    console.log("get api snapshots");
    apiSnapshots();
    setTimeout(function(){getApiSnapshots(apiSnapshots)},300000);
}

getApiSnapshots(backgroundFactory.getApiSnapshots());

/*$.post("https://paddelkraft.visualstudio.com/DefaultCollection/_api/_wit/pageWorkItems",
        {"workItemIds":"31,32",
            "fields":"System.Id,System.State",
            "__RequestVerificationToken":"bio43hMeyEpM7RBmKxkjPMk2ESZAPdaN86fq4ZnT27vp199123bgqkEJY0X9V2uLxilAvd6EQOXwsjWjc5e2aL214agoQBjxGNjyGZsi46LMmzcBCOn9Ch2FHugDcdDRwbk9rA2"
        },
        function(data,status){
            console.log(jsonEncode(data));
        }
    );*/