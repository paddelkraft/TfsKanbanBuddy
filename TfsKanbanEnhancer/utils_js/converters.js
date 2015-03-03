

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

function convertStorageColorMapToSettingsColorMap(storageColorMap,storageDescriptionMap){
	var settingsColorMap =[ {"color" : "black" ,       "prefix" : "", "description" : "expediter"},
							{"color" : "red" ,         "prefix" : "", "description" : "blocked"},
							{"color" : "blue" ,        "prefix" : "", "description" : ""},
							{"color" : "yellow" ,      "prefix" : "", "description" : ""},
							{"color" : "orange" ,      "prefix" : "", "description" : ""},
							{"color" : "green" ,       "prefix" : "", "description" : ""},
							{"color" : "pink" ,        "prefix" : "", "description" : ""},
							{"color" : "asure" ,       "prefix" : "", "description" : ""},
							{"color" : "purple" ,      "prefix" : "", "description" : ""},
							{"color" : "lightgreen" ,  "prefix" : "", "description" : ""},
							{"color" : "gray" ,        "prefix" : "", "description" : ""},
							{"color" : "lightpurple" , "prefix" : "", "description" : ""}
							];

	function setColorMap(color,prefix){
		for(var i in settingsColorMap){
			if(settingsColorMap[i].color == color) {
				settingsColorMap[i].prefix = prefix;
				// return;
			}
		}
	}
	
	for(var i in storageColorMap){
		setColorMap(storageColorMap[i],i);
	}
	
	function setDescriptionMap(description,prefix){
		for(var i in settingsColorMap){
			if(settingsColorMap[i].prefix == prefix) {
				settingsColorMap[i].description = description;
				// return;
			}
		}
	}
	
	for(var j in storageDescriptionMap){
		setDescriptionMap(storageDescriptionMap[j],j);
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

function convertSettingsColorMapToStorageDescriptionMap(settingsPageColorMap){
	var storageDescriptionMap = {};
	for(var i in settingsPageColorMap){
		if(settingsPageColorMap[i].prefix !== ""){
			storageDescriptionMap[settingsPageColorMap[i].prefix] = settingsPageColorMap[i].description;
		}
	}
	return storageDescriptionMap;
}


function convertSettingsPageColorMapToNewFormat(settingsPageColorMap) {

	var newSettingsPageColorMap= [];
	var color="";
	var description="";
	
	for(var i in settingsPageColorMap){
		
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
		
	}
	
	return newSettingsPageColorMap;
}
