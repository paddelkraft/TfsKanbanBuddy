window.onload = function(){
	function setSettings(settings){
      chrome.runtime.sendMessage({"type": "set-settings","settings": settings}, function(response) {
      console.log(response);
      location.reload();
    }); 
  }

  function getImportUrl(){
    chrome.runtime.sendMessage({"type": "get-import-url"}, function(response) {
      console.log("Import url =" + response);
      if(response.url){
        $("#importURL").val(response.url);
        $("#automaticImport").prop('checked',response.automaticImport);
      }
      
    });
     
  }

  initLinks();
	initColorMap();
  getImportUrl();

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

  $('#importSettings').change(handleFileSelect);
  $('#exportSettings').click ( function (){
  		chrome.runtime.sendMessage({type: "get-settings"}, function(response) {
          	downloadAsJson(response,"tfsKanbanBuddySettings");
        });
  	}
  );

  $("#importSettingsfromUrl").click( function(){
      var importURL = $("#importURL").val();
      if(importURL == "") return;
      console.log("getSettings from "+ importURL);
      $.get(importURL,function(data,status){
      console.log("get");
      if (data){
        setSettings(jsonDecode(data));

        chrome.runtime.sendMessage({type : "set-import-url", data :{ "url" : importURL, automaticImport : $("#automaticImport").prop('checked')}}, function(response){
          console.log(response);
        });
      }
      
    });
  });
};