window.onload = function(){
	function setSettings(settings){
      chrome.runtime.sendMessage({"type": "set-settings","settings": settings}, function(response) {
      console.log(response);
      location.reload();
    }); 
  }

  function exportStttingsAsJson(){
      chrome.runtime.sendMessage({type: "get-settings"}, function(response) {
            downloadAsJson(response,"tfsKanbanBuddySettings");
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

  

  function importSettingsFromUrl(){
      var importURL = $("#importURL").val();
      if(importURL == "") return;
      console.log("getSettings from "+ importURL);
      $.get(importURL,function(data,status){
      if (data){
        setSettings(jsonDecode(data));
        chrome.runtime.sendMessage( {
                                      type : "set-import-url",
                                      data :{
                                              "url"           : importURL, 
                                              automaticImport : $("#automaticImport").prop('checked')
                                            }
                                    }
                                  , function(response){
                                      console.log(response);
                                    }
                                  );
      }
      
    });
  }

  //initLinks();
  initColorMap();
  getImportUrl();

  $('#importSettings').change(handleFileSelect);
  $('#exportSettings').click (exportStttingsAsJson);
  $("#importSettingsfromUrl").click( importSettingsFromUrl );
};