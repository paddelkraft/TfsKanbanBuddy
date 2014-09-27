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

