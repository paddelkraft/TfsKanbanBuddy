(function () {
  if (!window.jQuery) {
    var d = document.createElement("script");
    d.src  = "//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js";
    d.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(d);
  }
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
      }
    }
    var c = document.getElementsByTagName("head")[0],
      a = document.createElement("link");
    a.rel   = "stylesheet";
    a.type  = "text/css";
    a.href  = "//pap.as/js/tabletocsv.css";
    a.media = "all";
    c.appendChild(a);
    $("body").append("<div id='tabletocsv-modal' style='display:block'><div id='tabletocsv-modal-dialog'><div id='tabletocsv-modal-content'><div id='tabletocsv-modal-header'><h4 id='tabletocsv-modal-title'>Export table as .csv</h4><br><a href='#' id='tabletocsv-btn'>download</a> </div></div></div></div>");
    document.getElementById("tabletocsv-btn").addEventListener("click", function (a) {
      d.apply(this, [
        $("table"), "export.csv"
      ]);
      $("#tabletocsv-modal").remove();
    });
  }, false);
})();