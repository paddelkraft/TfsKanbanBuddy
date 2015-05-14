 var app = angular.module("import", []);

    app.controller("importController", function($scope){
        
        
        function handleFileSelect(evt) {
            var files = evt.target.files; // FileList object
            function importData(boardData){
                  boardData = new BoardData(boardData);
                  chrome.runtime.sendMessage({"type": "set-board-data","boardData": boardData}, function(response) {
                  alert("import done")
                  console.log(response);
                  location.reload();
                });
            }
            // Loop through the FileList and render image files as thumbnails.
            for (var i = 0, f; f = files[i]; i++) {

              var reader = new FileReader();

              // Closure to capture the file information.
              reader.onload = (function(theFile) {
                return function(e) {
                  importData(jsonDecode(e.target.result));
                };
              })(f);

              // Read in the image file as a data URL.
              reader.readAsText(f);
            }
        }

        $('#importData').change(handleFileSelect);

        
    });

    app.controller("exportController",function($scope){
        $scope.exportStorage = function(){
            chrome.runtime.sendMessage({"type": "get-storage"}, function(response) {
                downloadAsJson(response,"tfsKanbanBuddyStorageExport");
            });
        }
    });