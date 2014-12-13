
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

function TimeUtil(){
    this.MILLISECONDS_DAY = 86400000; //24*60*60*1000=86400000 
    
    this.now = function(){
        return new Date();
    };

    this.readableTime = function (milliseconds){
        var that  = this;
        return function(){
            return that.timeFormat(milliseconds);
        };
    };
    
    this.daysSince = function(date){
        return Math.floor((this.now()-date)/this.MILLISECONDS_DAY);
    };

    this.highlightTime = function (days){
        if(days<2){
            return "new";
        } else if(days>14){
            return days+" (old)";
        }
        return days;
    };

    this.timeFormat = function ( milliseconds ){
        time = new Date(milliseconds);
        var formatedTime = "" + time.getFullYear() + "-" + twoDigits(time.getMonth() +1) +
                                                  "-" + twoDigits(time.getDate()) +
                                                  " " + twoDigits(time.getHours()) +
                                                  ":" + twoDigits(time.getMinutes());
        return formatedTime;
    };

    return this;
}

timeUtil = new TimeUtil();
    
    
    function saveObjectToStorage(key, toSave){
        var content = jsonEncode(toSave);
        localStorage.setItem(key,content);
    }

    function getObjectFromStorage(key){
        var content = localStorage.getItem(key);
        if(content === "" || content === null){
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


    

    

    function twoDigits(input){
        var output = "0"+input;
        return output.substring(output.length -2 ,output.length);
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
            value = grid[i][j];
            if(value=== undefined){
                value = "";
            }
            row = row +'"'+value+((grid[i].length-1 === j)?'"':'",');
        }
        csv = csv+row+((grid[i].length-1 === i)?'':'\r\n');
      }
      return csv;
    }



    

    
