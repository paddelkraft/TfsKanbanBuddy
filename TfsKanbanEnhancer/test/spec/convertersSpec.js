describe("Converters", function() {
  var _storedLinks = {"google":"http://google.com","bing":"http://bing.com"};;
  var _settingsPageLinks = [{caption : "google", url : "http://google.com"},
                          {caption : "bing", url : "http://bing.com"},
                          {caption : "", url : ""},
                          {caption : "", url : ""},
                          {caption : "", url : ""},
                          {caption : "", url : ""},
                          {caption : "", url : ""},
                          {caption : "", url : ""},
                          {caption : "", url : ""},
                          {caption : "", url : ""}
                         ];

  var _storageColorMap = {"!":"black","*":"red","CR":"blue"};

  var _storageDescriptionMap = {"!":"expediter","*":"blocked","CR":""};
  
  var _settingsPageColorMap = [{"color" : "expediter" ,   "prefix" : "!" },
                               {"color" : "blocked" ,     "prefix" : "*"},
                               {"color" : "blue" ,        "prefix" : "CR"},
                               {"color" : "yellow" ,      "prefix" : ""},
                               {"color" : "orange" ,      "prefix" : ""},
                               {"color" : "green" ,       "prefix" : ""},
                               {"color" : "pink" ,        "prefix" : ""},
                               {"color" : "asure" ,       "prefix" : ""},
                               {"color" : "purple" ,      "prefix" : ""},
                               {"color" : "lightgreen" ,  "prefix" : ""},
                               {"color" : "gray" ,        "prefix" : ""}];
  
  var _emptySettingsPageColorMap = [{"color" : "expediter" ,   "prefix" : "" },
                               {"color" : "blocked" ,     "prefix" : ""},
                               {"color" : "blue" ,        "prefix" : ""},
                               {"color" : "yellow" ,      "prefix" : ""},
                               {"color" : "orange" ,      "prefix" : ""},
                               {"color" : "green" ,       "prefix" : ""},
                               {"color" : "pink" ,        "prefix" : ""},
                               {"color" : "asure" ,       "prefix" : ""},
                               {"color" : "purple" ,      "prefix" : ""},
                               {"color" : "lightgreen" ,  "prefix" : ""},
                               {"color" : "gray" ,        "prefix" : ""}];

   var _newSettingsPageColorMap = [{"color" : "black" ,       "prefix" : "!" , "description" : "expediter"},
                                   {"color" : "red" ,         "prefix" : "*" , "description" : "blocked"},
                                   {"color" : "blue" ,        "prefix" : "CR", "description" : ""},
                                   {"color" : "yellow" ,      "prefix" : "",   "description" : ""},
                                   {"color" : "orange" ,      "prefix" : "",   "description" : ""},
                                   {"color" : "green" ,       "prefix" : "",   "description" : ""},
                                   {"color" : "pink" ,        "prefix" : "",   "description" : ""},
                                   {"color" : "asure" ,       "prefix" : "",   "description" : ""},
                                   {"color" : "purple" ,     "prefix" : "",   "description" : ""},
                                   {"color" : "lightgreen" ,  "prefix" : "",   "description" : ""},
                                   {"color" : "gray" ,        "prefix" : "",   "description" : ""}];
 
   var _newEmptySettingsPageColorMap = [{"color" : "black" ,       "prefix" : "", "description" : "expediter"},
                                    {"color" : "red" ,         "prefix" : "", "description" : "blocked"},
                                    {"color" : "blue" ,        "prefix" : "", "description" : ""},
                                    {"color" : "yellow" ,      "prefix" : "", "description" : ""},
                                    {"color" : "orange" ,      "prefix" : "", "description" : ""},
                                    {"color" : "green" ,       "prefix" : "", "description" : ""},
                                    {"color" : "pink" ,        "prefix" : "", "description" : ""},
                                    {"color" : "asure" ,       "prefix" : "", "description" : ""},
                                    {"color" : "purple" ,      "prefix" : "", "description" : ""},
                                    {"color" : "lightgreen" ,  "prefix" : "", "description" : ""},
                                    {"color" : "gray" ,        "prefix" : "", "description" : ""}];

  var _boardData045 = {"ver":"0.4.5","board":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection","storageKey":"snapshots_https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection","genericItemUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=","snapshots":null,"boardDesignHistory":{"boardDesignRecords":[{"seen":[1410293597175,1417355741960],"design":[{"name":"ToDo"},{"name":"Req IP","wip":{"limit":"1"}},{"name":"Req DONE","wip":{"limit":""}},{"name":"Architecture IP","wip":{"limit":"3"}},{"name":"Architecture DONE","wip":{"limit":""}},{"name":"Dev IP","wip":{"limit":"5"}},{"name":"Dev DONE","wip":{"limit":""}},{"name":"Test IP","wip":{"limit":"5"}},{"name":"Test DONE","wip":{"limit":""}},{"name":"Approval","wip":{"limit":"5"}},{"name":"Redy for production","wip":{"limit":"5"}},{"name":"In production"}]},{"seen":[1419885408160,1419889962039],"design":[{"name":"ToDo"},{"name":"Req IP","wip":{"limit":"1"}},{"name":"Req DONE","wip":{"limit":"0"}},{"name":"Architecture IP","wip":{"limit":"3"}},{"name":"Architecture DONE","wip":{"limit":"0"}},{"name":"Dev IP","wip":{"limit":"5"}},{"name":"Dev DONE","wip":{"limit":"0"}},{"name":"Test IP","wip":{"limit":"5"}},{"name":"Test DONE","wip":{"limit":"0"}},{"name":"Approval","wip":{"limit":"5"}},{"name":"Redy for production","wip":{"limit":"5"}},{"name":"In production"}]}]},"flowData":{"1":{"title":"CR #111 Test1","id":"1","lanes":{"Dev DONE":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410458955392},"Test IP":{"enterMilliseconds":1417355741960,"exitMilliseconds":1419889962039}}},"2":{"title":"! CR #112 Test 2","id":"2","lanes":{"Dev DONE":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410458955392},"Test IP":{"enterMilliseconds":1417355741960,"exitMilliseconds":1419889962039}}},"3":{"title":"* CR #113 Test3","id":"3","lanes":{"Dev DONE":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410458955392},"Test IP":{"enterMilliseconds":1417355741960,"exitMilliseconds":1419889962039}}},"4":{"title":"AT #111 Test4","id":"4","lanes":{"Dev DONE":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410458955392},"Test IP":{"enterMilliseconds":1417355741960,"exitMilliseconds":1419889962039}}},"5":{"title":"BUG #3587 critical","id":"5","lanes":{"Test IP":{"enterMilliseconds":1410293597175,"exitMilliseconds":1419889962039}}},"6":{"title":"SUPPORT #not support","id":"6","lanes":{"Dev IP":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410458955392},"Test IP":{"enterMilliseconds":1417355741960,"exitMilliseconds":1419889962039}}},"7":{"title":"MAINT #111 fixa","id":"7","lanes":{"Req DONE":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410458955392},"Architecture IP":{"enterMilliseconds":1417355741960,"exitMilliseconds":1419885408160},"Architecture DONE":{"enterMilliseconds":1419889962039,"exitMilliseconds":1419889962039}}},"8":{"title":"TEST testing","id":"8","lanes":{"Architecture DONE":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410458955392},"Dev IP":{"enterMilliseconds":1417355741960,"exitMilliseconds":1419889962039}}},"9":{"title":"FD 2014-10-10 #123 bla bla bla |maint","id":"9","lanes":{"Dev IP":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410458955392},"Dev DONE":{"enterMilliseconds":1417355741960,"exitMilliseconds":1419889962039}}},"10":{"title":"SPIKE spike 1 |project","id":"10","lanes":{"Architecture IP":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410295754885},"Req DONE":{"enterMilliseconds":1410458955392,"exitMilliseconds":1419889962039}}}}}
  //{"ver":"0.4.5","board":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection","storageKey":"snapshots_https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection","genericItemUrl":"https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=","snapshots":null,"boardDesignHistory":{"boardDesignRecords":[{"seen":[1410293597175,1417355741960],"design":[{"name":"ToDo"},{"name":"Req IP","wip":{"limit":"1"}},{"name":"Req DONE","wip":{"limit":""}},{"name":"Architecture IP","wip":{"limit":"3"}},{"name":"Architecture DONE","wip":{"limit":""}},{"name":"Dev IP","wip":{"limit":"5"}},{"name":"Dev DONE","wip":{"limit":""}},{"name":"Test IP","wip":{"limit":"5"}},{"name":"Test DONE","wip":{"limit":""}},{"name":"Approval","wip":{"limit":"5"}},{"name":"Redy for production","wip":{"limit":"5"}},{"name":"In production"}]},{"seen":[1419885408160],"design":[{"name":"ToDo"},{"name":"Req IP","wip":{"limit":"1"}},{"name":"Req DONE","wip":{"limit":"0"}},{"name":"Architecture IP","wip":{"limit":"3"}},{"name":"Architecture DONE","wip":{"limit":"0"}},{"name":"Dev IP","wip":{"limit":"5"}},{"name":"Dev DONE","wip":{"limit":"0"}},{"name":"Test IP","wip":{"limit":"5"}},{"name":"Test DONE","wip":{"limit":"0"}},{"name":"Approval","wip":{"limit":"5"}},{"name":"Redy for production","wip":{"limit":"5"}},{"name":"In production"}]}]},"flowData":{"1":{"title":"CR #111 Test1","id":"1","lanes":{"Dev DONE":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410458955392},"Test IP":{"enterMilliseconds":1417355741960,"exitMilliseconds":1419885408160}}},"2":{"title":"! CR #112 Test 2","id":"2","lanes":{"Dev DONE":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410458955392},"Test IP":{"enterMilliseconds":1417355741960,"exitMilliseconds":1419885408160}}},"3":{"title":"* CR #113 Test3","id":"3","lanes":{"Dev DONE":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410458955392},"Test IP":{"enterMilliseconds":1417355741960,"exitMilliseconds":1419885408160}}},"4":{"title":"AT #111 Test4","id":"4","lanes":{"Dev DONE":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410458955392},"Test IP":{"enterMilliseconds":1417355741960,"exitMilliseconds":1419885408160}}},"5":{"title":"BUG #3587 critical","id":"5","lanes":{"Test IP":{"enterMilliseconds":1410293597175,"exitMilliseconds":1419885408160}}},"6":{"title":"SUPPORT #not support","id":"6","lanes":{"Dev IP":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410458955392},"Test IP":{"enterMilliseconds":1417355741960,"exitMilliseconds":1419885408160}}},"7":{"title":"MAINT #111 fixa","id":"7","lanes":{"Req DONE":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410458955392},"Architecture IP":{"enterMilliseconds":1417355741960,"exitMilliseconds":1419885408160}}},"8":{"title":"TEST testing","id":"8","lanes":{"Architecture DONE":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410458955392},"Dev IP":{"enterMilliseconds":1417355741960,"exitMilliseconds":1419885408160}}},"9":{"title":"FD 2014-10-10 #123 bla bla bla |maint","id":"9","lanes":{"Dev IP":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410458955392},"Dev DONE":{"enterMilliseconds":1417355741960,"exitMilliseconds":1419885408160}}},"10":{"title":"SPIKE spike 1 |project","id":"10","lanes":{"Architecture IP":{"enterMilliseconds":1410293597175,"exitMilliseconds":1410295754885},"Req DONE":{"enterMilliseconds":1410458955392,"exitMilliseconds":1419885408160}}}}};

  beforeEach(function() {
    
  });

  it("should convert stored links to view format", function() {
    var links = _storedLinks;
    var settingsLinks = convertStorageLinksToSettingsLinks(links);
    var expectedResult = _settingsPageLinks;
    expect(settingsLinks).toEqual(expectedResult);
  });

  it("should convert settings links to storage format", function() {
    var expectedResult = _storedLinks;
    var links = _settingsPageLinks;
    var storageLinks = convertSettingsLinksToStorageLinks(links);
    expect(storageLinks).toEqual(expectedResult);
  });

  it("should return empty colorMap with null input", function() {
    var settingsPageColorMap = convertStorageColorMapToSettingsColorMap(null,null);
    expect(settingsPageColorMap).toEqual(_newEmptySettingsPageColorMap);
  });

  it("should convert stored color map to view format", function() {
    var settingsPageColorMap = convertStorageColorMapToSettingsColorMap(_storageColorMap,_storageDescriptionMap);
    expect(settingsPageColorMap).toEqual(_newSettingsPageColorMap);
  });

  it("should convert settings color map to storage color format", function() {
    var storageColorMap = convertSettingsColorMapToStorageColorMap(_newSettingsPageColorMap);
    expect(storageColorMap).toEqual(_storageColorMap);
  });

  it("should convert settings color map to storage description format", function() {
    var storageDescriptionMap = convertSettingsColorMapToStorageDescriptionMap(_newSettingsPageColorMap);
    expect(storageDescriptionMap).toEqual(_storageDescriptionMap);
  });
  
  it("should convert old seetings page color map to new format", function () {
	  var newSettingsPageColorMap = convertSettingsPageColorMapToNewFormat(_settingsPageColorMap);
	  expect(newSettingsPageColorMap).toEqual(_newSettingsPageColorMap);
  });

  it("should convert 2 dimensional json array to csv", function() {
    var grid = [[1,2],[3,4]];
    var csv = jsonGridToCSV(grid);
    console.log(csv);
    expect(csv).toEqual('"1","2"\r\n"3","4"');
  });

  approveIt("should convert boarddata from 0.4.5 to ver 0.5.0",function(){
    var boardData = new BoardData(_boardData045);
    return boardData;
  });
});

 