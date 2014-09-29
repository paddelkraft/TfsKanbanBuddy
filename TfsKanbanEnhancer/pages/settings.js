 var app = angular.module("settings", []);

    app.controller("settingsController", function($scope){
        
        $scope.kanbanBoardColorMap = convertStorageColorMapToSettingsColorMap({});
        $scope.links = convertStorageLinksToSettingsLinks({});
        $scope.taskBoardColorMap = convertStorageColorMapToSettingsColorMap({});
        
        $scope.saveImportData = function(){
            var message = {type : "set-import-url",
                           importData :{}};
            if($scope.importUrl != ""){
                message.importData.url = $scope.importUrl;
                message.importData.automaticImport = $scope.automaticImport;
            }else{
                $scope.automaticImport = false;
                message.importData.url = $scope.importUrl;
                message.importData.automaticImport = $scope.automaticImport;
            }
            console.log ("importData sent to background " + jsonEncode(message));
            chrome.runtime.sendMessage( message, function(response){
                    console.log(response);
                }
            );
        };

        $scope.getSettings =function(){
            var message = {
                type: "get-settings",
                importInfo : true
            };
            chrome.extension.sendMessage(message,function(response){
                    console.log ("Settings  recieved = " + jsonEncode(response));
                    $scope.links = convertStorageLinksToSettingsLinks(response.boardLinks);
                    console.log("links = " + jsonEncode($scope.links));
                    $scope.kanbanBoardColorMap = convertStorageColorMapToSettingsColorMap(response.kanbanBoardColorMap);
                    console.log("kanbanBoardColorMap = " + jsonEncode($scope.kanbanBoardColorMap));
                    $scope.taskBoardColorMap = convertStorageColorMapToSettingsColorMap(response.taskBoardColorMap);
                    console.log("taskBoardColorMap = " + jsonEncode($scope.taskBoardColorMap));
                    $scope.importUrl =response.importData.url;
                    $scope.automaticImport =response.importData.automaticImport;
                    $scope.$apply();
            });
        };

        
        

        $scope.saveSettings = function (){
            console.log(" kanbanBoardColorMap = "+ jsonEncode(convertSettingsColorMapToStorageColorMap($scope.kanbanBoardColorMap)));
            var message = {
                type: "set-settings",
                "settings" :{ "boardLinks"          : convertSettingsLinksToStorageLinks($scope.links),
                              "kanbanBoardColorMap" : convertSettingsColorMapToStorageColorMap($scope.kanbanBoardColorMap),
                              "taskBoardColorMap"   : convertSettingsColorMapToStorageColorMap($scope.taskBoardColorMap)
                      }
                };
            chrome.extension.sendMessage(message,function(response){
                console.log("response = " + response);
                
            });
        };

        function handleFileSelect(evt) {
            var files = evt.target.files; // FileList object
            function setSettings(settings){
                  chrome.runtime.sendMessage({"type": "set-settings","settings": settings}, function(response) {
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
                  setSettings(jsonDecode(e.target.result));
                };
              })(f);

              // Read in the image file as a data URL.
              reader.readAsText(f);
            }
        }

        $('#importSettings').change(handleFileSelect);

        $scope.exportSettingsAsJson = function(){
            chrome.runtime.sendMessage({type: "get-settings"}, function(response) {
                downloadAsJson(response,"tfsKanbanBuddySettings");
            });
        };

        $scope.importFromUrl = function(){
            function setSettings(settings){
                chrome.runtime.sendMessage({"type": "set-settings","settings": settings}, function(response) {
                  console.log(response);
                  $scope.getSettings();
                  //location.reload();
                });
            }
            $.get($scope.importUrl,function(data,status){
                if (data){
                    $scope.saveImportData();
                    setSettings(jsonDecode(data));
                    
                }
            });
        };

        $scope.clearUrl = function(){
            $scope.importUrl = "";
            $scope.automaticImport = false;
            $scope.saveImportData();
        };

        $scope.getSettings($scope);
    });