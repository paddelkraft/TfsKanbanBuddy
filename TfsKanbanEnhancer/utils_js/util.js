
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

    function objectDataIsEqual(obj1,obj2){
        return jsonEncode(obj1)===jsonEncode(obj2);
    }

function TimeUtil(){
    this.MILLISECONDS_DAY = 86400000; //24*60*60*1000=86400000
    this.MILLISECONDS_HOUR = this.MILLISECONDS_DAY/24;
    this.now = function(){
        return new Date();
    };

    this.timestamp = function(){
        return this.dateFormat(this.now().getTime());
    };

    this.daysSince = function(date){
        return Math.floor((this.now()-date)/this.MILLISECONDS_DAY);
    };

    this.daysUntil = function(date){
        return Math.floor((date - this.now())/this.MILLISECONDS_DAY);
    };

    this.highlightTime = function (days,old){
        if(!old){
            old = 50;
        }
        if(days<2){
            return "new";
        } else if(days>old){
            return days+" (old)";
        }
        return days;
    };

    this.dayStart  = function(milliseconds){
        return this.daysSinceEpoc(milliseconds)*this.MILLISECONDS_DAY;
    };

    this.daysSinceEpoc = function(milliseconds){
        return Math.floor(milliseconds/this.MILLISECONDS_DAY);
    };


    this.dateFormat = function ( milliseconds ){
        var time = new Date(milliseconds);
        var formatedDate = "" + time.getFullYear() + "-" + twoDigits(time.getMonth() +1) +
                                                  "-" + twoDigits(time.getDate()) +
                                                  " " + twoDigits(time.getHours()) +
                                                  ":" + twoDigits(time.getMinutes());
        return formatedDate;
    };

    this.isoDateFormat = function(milliseconds){
        var time = new Date(milliseconds);
        var formatedDate = "" + time.getFullYear() + "-" + twoDigits(time.getMonth() +1) +
                                                  "-" + twoDigits(time.getDate());
        return formatedDate;
    };

    this.timeFormat = function ( milliseconds ){
        time = new Date(milliseconds);
        var days = Math.floor(milliseconds/this.MILLISECONDS_DAY);
        var hours;
        var minutes;
        milliseconds = milliseconds%this.MILLISECONDS_DAY;
        hours = Math.floor(milliseconds/(this.MILLISECONDS_HOUR));
        minutes = Math.floor((milliseconds%this.MILLISECONDS_HOUR)/60000);
        return "" + days + ":" + twoDigits(hours) + ":" + twoDigits(minutes) ;
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


    function arrayOfNulls(length){
        var self = [];
        var i;
        for(i=0;i<length;i++){
            self[i]=null;
        }

        return self;
    }

    function arraysAreIdentical(arr1,arr2){
        if (!arr1 || !arr2)
        return false;

        // compare lengths - can save a lot of time
        if (arr1.length != arr2.length)
            return false;

        for (var i = 0, l=arr1.length; i < l; i++) {
            // Check if we have nested arrays
            if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
                // recurse into the nested arrays
                if (!arraysAreIdentical(arr1,arr2[i])){
                    return false;
                }

            }
            else if (arr1[i] !== arr2[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    }

    function twoDigits(input){
        var output = "0"+input;
        return output.substring(output.length -2 ,output.length);
    }

    function downloadAsJson(data, filePrefix){
        var blob = new Blob([jsonEncode(data)], {type: "data:application/json;charset=utf-8"});
        saveAs(blob, filePrefix + timeUtil.timestamp()+".json");
    }

    function downloadAsCSV(data, filePrefix){
        var blob = new Blob([jsonGridToCSV(data)], {type: "data:application/csv;charset=utf-8"});
        saveAs(blob, filePrefix + timeUtil.timestamp()+".csv");
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

    function arrayOf(value,length){
        var arr = [];
        for (var i = 0; i < length; i++) {
          arr[i]=value;
        }
        return arr;
    }

    function gridOf(value, rows, columns){
        var grid = [];
        for (var i = 0; i < rows; i++) {
          grid[i]=arrayOf(value,columns);
        }
        return grid;
    }

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function sendExtensionMessage(message) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    chrome.runtime.sendMessage(message, function(response){
        resolve(response);
    });
  });
}

function decodeUrl(encoded){
    return encoded.replace(/\(_\)/g, ':').replace(/\(-\)/g, '/').replace(/ /g,"%20");
}

function encodeUrl(url){
    var withoutColons = url.replace(/:/g,"(_)");
    var withoutSlashes = url.replace(/\//g,"(-)");
    return url.replace(/:/g,"(_)").replace(/\//g,"(-)");
}
function filterArray(arr, filterFunc){
    var filteredArray = [];
    _.forEach(arr, function(item){
        if(filterFunc(item)){
            filteredArray.push(item);
        }
    });

    return filteredArray;
}
