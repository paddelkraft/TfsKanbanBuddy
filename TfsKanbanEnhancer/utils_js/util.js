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

    function saveObjectToStorage(key, toSave){
        var content = jsonEncode(toSave);
        localStorage.setItem(key,content);
    }

    function getObjectFromStorage(key){
        var content = localStorage.getItem(key);
        return jsonDecode(content);
        
    }

    function getStringFromStorage(key){
        return localStorage.getItem(key);
        
    }

    function saveStringToStorage(key, content){
        localStorage.setItem(key, content);
        
    }

    function timestamp( time ){
        if(!time){
            time = new Date();
        }
        
        var timeStamp = "" + time.getFullYear() + "-" + twoDigits(time.getMonth() +1) 
                                                + "-" + twoDigits(time.getDate()) 
                                                + "-" + twoDigits(time.getHours())
                                                + ":" + twoDigits(time.getMinutes());
        return timeStamp;
    }

    function isSameDay(timestamp1 , timestamp2){
      return (timestamp1.substring(0,11) == timestamp1.substring(0,11) )
    }

    function twoDigits(input){
        var output = "0"+input;
        return output.substring(output.length -2 ,output.length)
    }

    function downloadAsJson(data, filePrefix, element){
        var blob = new Blob([jsonEncode(data)], {type: "data:application/json;charset=utf-8"});
        saveAs(blob, filePrefix + timestamp()+".json");
    }

    

    function table2csv(prefix){
        if(!prefix) prefix = "";
        
        var c = function ($) {
              window.jQuery ? $(jQuery) : window.setTimeout(function () {
                c($);
              }, 100)
            };
          c(function ($) {
            function d(a, c) {
              var e = a.find("tr:has(td)");
              if (e.length === 0) {
                alert("Found no tables to convert on this page");
              } else {
                var f = String.fromCharCode(11),
                  g = String.fromCharCode(0),
                  e = '"' + e.map(function (a, c) {
                    return $(c).find("td").map(function (c, a) {
                      return $(a).text().replace('"', '""');
                    }).get().join(f);
                  }).get().join(g).split(g).join('"\r\n"').split(f).join('","') + '"',
                  e = "data:application/csv;charset=utf-8," + encodeURIComponent(e);
                $(this).attr({
                  download: c,
                  href    : e,
                  target  : "_blank"
                });
                console.log("Data collected and attributes set");
              }
            }
            var c = document.getElementsByTagName("head")[0],
              a = document.createElement("link");
            a.rel   = "stylesheet";
            a.type  = "text/css";
            a.href  = "tabletocsv.css";
            a.media = "all";
            c.appendChild(a);
            $("body").append("<div id='tabletocsv-modal' style='display:block'><div id='tabletocsv-modal-dialog'><div id='tabletocsv-modal-content'><div id='tabletocsv-modal-header'><h4 id='tabletocsv-modal-title'>Export table as .csv</h4><br><a href='#' id='tabletocsv-btn'>download</a> </div></div></div></div>");
            document.getElementById("tabletocsv-btn").addEventListener("click", function (a) {
              console.log("Event listener tabletocsv-btn");
              d.apply(this, [
                $("table"), prefix + timestamp()+".csv"
              ]);
              $("#tabletocsv-modal").remove();
            });
          }, false);
    }

    function createDataTable(tableData) {
          var table = document.createElement('table')
            , tableBody = document.createElement('tbody');

          tableData.forEach(function(rowData) {
            var row = document.createElement('tr');

            rowData.forEach(function(cellData) {
              var cell = document.createElement('td');
              cell.appendChild(document.createTextNode(cellData));
              row.appendChild(cell);
            });

            tableBody.appendChild(row);
          });

          table.appendChild(tableBody);
          document.body.appendChild(table);
    }
