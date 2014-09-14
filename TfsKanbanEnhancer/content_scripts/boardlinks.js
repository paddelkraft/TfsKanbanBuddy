/*var links = {
				"Business Board": "http://tfs2010.it.volvo.net:8080/tfs/Global/SEGOT-eCom-VolvoPentaShop/PentaBusiness/_backlogs/board",
				"Team Board": "http://tfs2010.it.volvo.net:8080/tfs/Global/SEGOT-eCom-VolvoPentaShop/PentaTeam/_backlogs/board",
				"Definition Of Done": "http://tfs2010.it.volvo.net/sites/Global/SEGOT-eCom-VolvoPentaShop/Wiki%20Pages/Definition%20Of%20Done.aspx",
				"Process Information": "http://tfs2010.it.volvo.net/sites/Global/SEGOT-eCom-VolvoPentaShop/Kanban/Forms/AllItems.aspx?RootFolder=%2Fsites%2FGlobal%2FSEGOT%2DeCom%2DVolvoPentaShop%2FKanban%2FProcess%20and%20Guidlines&FolderCTID=0x012000C1829E356508ED43BF1B0C3254A4C219&View={18BD1F16-2726-4EBC-8373-6D1A4C2DA3BF}",
				"Enhancement Planning": "http://tfs2010.it.volvo.net/sites/Global/SEGOT-eCom-VolvoPentaShop/Kanban/eCom-Penta-IAT-Enhancement-Planning.xlsx",
				"Scrum Board": "http://tfs2010.it.volvo.net:8080/tfs/Global/SEGOT-eCom-VolvoPentaShop/PentaTeam/_boards"
};*/

function addLinks(){
	//var keys = Object.keys(links);
	var links = null;
	var message = {
            type: "get-links"
        }
        chrome.extension.sendMessage(message,function(response){
            console.log("response = " + response)
         	links = response;
			for(var key in links) {
    			var value = links[key];
				addHubGroupLink(key,value);
			}
        });
        console.log("Links recieved from background");

}

function addHubGroupLink(caption, url) {
    var link = document.createElement('li');
    link.innerHTML = "<a href='" + url + "' >" + caption + " </a>";
    appendLiToUlByClass("hub-groups", link);
}

function appendLiToUlByClass(matchClass, li) {
    var elems = document.getElementsByTagName('ul'), i;
    for (i in elems) {
        if ((' ' + elems[i].className + ' ').indexOf(' ' + matchClass + ' ') > -1) {
            elems[i].appendChild(li);
        }
    }
}

chrome.extension.sendMessage({type: "get-url"},function(response){
            console.log("response = " + response)
         	if(document.URL.indexOf(response)>=0){
         		addLinks();
         	}
        });
