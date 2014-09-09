window.onload = function(){
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
          var settings =  jsonDecode(e.target.result);
          
          
          chrome.runtime.sendMessage({"type": "set-settings","settings": settings}, function(response) {
          	console.log(response);
          });
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
};