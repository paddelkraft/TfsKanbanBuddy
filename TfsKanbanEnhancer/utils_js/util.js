 function jsonDecode(string) {
        try {
            return JSON.parse(string);
        } catch (e) {
            try{
                return JSON.decode(string);
            }catch(e2){
                return {};
            }
        }
    }
    
    function jsonEncode(obj) {
        try {
            return JSON.stringify(obj);
        } catch (e) {
            try{
                return JSON.encode(obj);
            }catch(e2){
                return "{}";
            }
            
        }
    }

    function cloneObjectData(obj){
        return jsonDecode(jsonEncode(obj));
    }

    function daysSince(date){
        var day = 86400000 //24*60*60*1000=86400000
        var now = new Date();
		return Math.floor((now-date)/day);
	}

    function saveObjectToStorage(key, toSave){
        var content = jsonEncode(toSave);
        localStorage.setItem(key,content);
    }

    function getObjectFromStorage(key){
        var content = localStorage.getItem(key);
        if(content === "" || content == null){
          content = "{}";
        }
        return jsonDecode(content);
        
    }

    function getStringFromStorage(key){
        return localStorage.getItem(key);
        
    }

    function saveStringToStorage(key, content){
        localStorage.setItem(key, content);
        
    }


    function timeFormat( milliseconds ){
        time = new Date(milliseconds);      
        var formatedTime = "" + time.getFullYear() + "-" + twoDigits(time.getMonth() +1) +
                                                  "-" + twoDigits(time.getDate()) +
                                                  " " + twoDigits(time.getHours()) +
                                                  ":" + twoDigits(time.getMinutes());
        return formatedTime;
    }

    function timestamp( time ){
        if(!time){
            time = new Date();
        }
        
        var timeStamp = "" + time.getFullYear() + "-" + twoDigits(time.getMonth() +1) +
                                                  "-" + twoDigits(time.getDate()) +
                                                  " " + twoDigits(time.getHours()) +
                                                  ":" + twoDigits(time.getMinutes());
        return timeStamp;
    }

    function twoDigits(input){
        var output = "0"+input;
        return output.substring(output.length -2 ,output.length)
    }

    function downloadAsJson(data, filePrefix){
        var blob = new Blob([jsonEncode(data)], {type: "data:application/json;charset=utf-8"});
        saveAs(blob, filePrefix + timestamp()+".json");
    }

    function downloadAsCSV(data, filePrefix){
        var blob = new Blob([jsonGridToCSV(data)], {type: "data:application/csv;charset=utf-8"});
        saveAs(blob, filePrefix + timestamp()+".csv");
    }

    
    function jsonGridToCSV(grid){
      var i;
      var j;
      var csv = "";
      var row = "";
      var value = "";
      for (i =0; i < grid.length; i++) {
        row = "";
        for (j=0;  j<grid[i].length ; j++) {
            value = grid[i][j]
            if(value=== undefined){
                value = "";
            }
            row = row +'"'+value+((grid[i].length-1 === j)?'"':'",');
        }
        csv = csv+row+((grid[i].length-1 === i)?'':'\r\n');
      }
      return csv;
    }



    

    
