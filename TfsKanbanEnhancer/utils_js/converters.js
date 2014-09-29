

function convertStorageLinksToSettingsLinks(links){
	var settingsLinks = [];
	for(var i in links){
		settingsLinks.push(createViewlink(i,links[i]));
	}

	while(settingsLinks.length<10){
		settingsLinks.push(createViewlink("",""));
	}
	return settingsLinks;

	function createViewlink(caption, url){
	return {
		"caption"	: caption,
		"url"		: url
	};
}
}

function convertSettingsLinksToStorageLinks(settingsLinks){
	storageLinks = {};
	for(var i in settingsLinks){
		if(settingsLinks[i].caption !== ""){
			storageLinks[settingsLinks[i].caption] = settingsLinks[i].url;
		}
	}
	return storageLinks;
}

function convertStorageColorMapToSettingsColorMap(storageColorMap){
	var settingsColorMap =[ {"color" : "expediter" ,   "prefix" : "" },
							{"color" : "blocked" ,     "prefix" : ""},
							{"color" : "blue" ,        "prefix" : ""},
							{"color" : "yellow" ,      "prefix" : ""},
							{"color" : "orange" ,      "prefix" : ""},
							{"color" : "green" ,       "prefix" : ""},
							{"color" : "pink" ,        "prefix" : ""},
							{"color" : "asure" ,       "prefix" : ""},
							{"color" : "purple" ,      "prefix" : ""},
							{"color" : "lightgreen" ,  "prefix" : ""},
							{"color" : "gray" ,        "prefix" : ""}];

	function setColorMap(color,prefix){
		for(var i in settingsColorMap){
			if(settingsColorMap[i].color == color){
				settingsColorMap[i].prefix = prefix;
				return;
			}
		}
	}
	
	for(var i in storageColorMap){
		setColorMap(storageColorMap[i],i);
	}
	return settingsColorMap;
}

function convertSettingsColorMapToStorageColorMap(settingsPageColorMap){
	var storageColorMap = {};
	for(var i in settingsPageColorMap){
		if(settingsPageColorMap[i].prefix !== ""){
			storageColorMap[settingsPageColorMap[i].prefix] = settingsPageColorMap[i].color;
		}
	}
	return storageColorMap;
}

