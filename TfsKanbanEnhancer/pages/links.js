    function getLinks(scope){
        var message = {
            type: "get-links"
        };
        chrome.extension.sendMessage(message,function(response){
            console.log ("Links Json  recieved= "+ jsonDecode(response));
            scope.links = convertStorageLinksToSettingsLinks(response);
            console.log(scope.links);
        });
    }

    
    var app = angular.module("settings", []);

    app.controller("linksController", function($scope){
        $scope.saveLinks = function (){
            
            var message = {
            type: "set-links",
            "links" : convertSettingsLinksToStorageLinks($scope.links)
            };
            chrome.extension.sendMessage(message,function(response){
                console.log("response = " + response);
                
            });
        };

        getLinks($scope);
        $scope.saveLinks();
        
        
    });

   