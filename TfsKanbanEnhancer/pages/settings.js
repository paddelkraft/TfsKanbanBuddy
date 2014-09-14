window.onload = function(){
	function setSettings(settings){
      chrome.runtime.sendMessage({"type": "set-settings","settings": settings}, function(response) {
      console.log(response);
      location.reload();
    }); 
  }

  initLinks();
	initColorMap();

	function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          setSettings(jsonDecode(e.target.result));
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsText(f);
    }
  }

  document.getElementById('importSettings').addEventListener('change', handleFileSelect, false);
  document.getElementById('exportSettings').onclick = function (){
  		chrome.runtime.sendMessage({type: "get-settings"}, function(response) {
          	downloadAsJson(response,"tfsKanbanBuddySettings");
        });
  	};

  document.getElementById("importSettingsfromUrl").onclick = function(){
      console.log("getSettings from "+ document.getElementById("importURL").value);
      $.get(document.getElementById("importURL").value,function(data,status){
      console.log("get");
      if (data){
        setSettings(jsonDecode(data));
      }
      
    });
  };
};