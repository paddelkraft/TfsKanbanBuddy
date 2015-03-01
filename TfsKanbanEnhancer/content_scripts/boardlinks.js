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

function hasHubGroup(){
    return document.getElementsByClassName("hub-groups")[0];
}
function addLinks(settings,n){
    if(!n){
        n= 1
    }
    if( hasHubGroup() && settings.boardLinks){
        var links = settings.boardLinks;
        for(var key in links) {
            var value = links[key];
            addHubGroupLink(key,value);
        }
    }else if (n<5){
        setTimeout(function(){addLinks(settings,n+1);},1000)
    }
}


