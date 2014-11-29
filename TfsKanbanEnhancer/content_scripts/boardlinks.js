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
 
function addLinks(settings){
    if(settings.boardLinks){
        var links = settings.boardLinks;
        for(var key in links) {
            var value = links[key];
            addHubGroupLink(key,value);
        }
    }
}


