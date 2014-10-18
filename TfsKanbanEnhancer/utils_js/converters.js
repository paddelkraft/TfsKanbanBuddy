

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


function convertSettingsPageColorMapToNewFormat(settingsPageColorMap) {

	var newSettingsPageColorMap= [];
	var color="";
	var description="";
	
	for(var i in settingsPageColorMap){
		//console.log("color: " + settingsPageColorMap[i].color + " prefix: "+ settingsPageColorMap[i].prefix);
		
		color=settingsPageColorMap[i].color;
				
		if (color=="expediter" || color=="blocked") {
			description=color;
			if (color==="blocked") {
				color="red";
			} else {
				color="black";
			} 
		} else {
			description="";
		}
	
		newSettingsPageColorMap.push({
			"color"       : color,
			"prefix"      : settingsPageColorMap[i].prefix,
			"description" : description
		});
		//console.log("color: " + newSettingsPageColorMap[i].color + " prefix: "+ newSettingsPageColorMap[i].prefix+ " description: "+ newSettingsPageColorMap[i].description);
		
	}
	
	return newSettingsPageColorMap;
}