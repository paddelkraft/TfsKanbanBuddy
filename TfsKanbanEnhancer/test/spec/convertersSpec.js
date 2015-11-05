var _storedLinks = {"google":"http://google.com","bing":"http://bing.com"};
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
    {"color" : "gray" ,        "prefix" : ""},
    {"color" : "lightpurple" ,  "prefix" : ""},];

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
    {"color" : "gray" ,        "prefix" : ""},
    {"color" : "lightpurple" ,  "prefix" : ""}];

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
    {"color" : "gray" ,        "prefix" : "",   "description" : ""},
    {"color" : "lightpurple" , "prefix" : "",   "description" : ""}];

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
    {"color" : "gray" ,        "prefix" : "", "description" : ""},
    {"color" : "lightpurple" , "prefix" : "", "description" : ""}];


describe("Converters", function() {

  
  beforeEach(function() {
    
  });

  it("should convert stored links to view format", function() {
    var links = _storedLinks;
    var settingsLinks = convertStorageLinksToSettingsLinks(links);
    var expectedResult = _settingsPageLinks;
    expect(settingsLinks).jsonToBe(expectedResult);
  });

  it("should convert settings links to storage format", function() {
    var expectedResult = _storedLinks;
    var links = _settingsPageLinks;
    var storageLinks = convertSettingsLinksToStorageLinks(links);
    expect(storageLinks).jsonToBe(expectedResult);
  });

  it("should return empty colorMap with null input", function() {
    var settingsPageColorMap = convertStorageColorMapToSettingsColorMap(null,null);
    expect(settingsPageColorMap).jsonToBe(_newEmptySettingsPageColorMap);
  });

  it("should convert stored color map to view format", function() {
    var settingsPageColorMap = convertStorageColorMapToSettingsColorMap(_storageColorMap,_storageDescriptionMap);
    expect(settingsPageColorMap).jsonToBe(_newSettingsPageColorMap);
  });

  it("should convert settings color map to storage color format", function() {
    var storageColorMap = convertSettingsColorMapToStorageColorMap(_newSettingsPageColorMap);
    expect(storageColorMap).jsonToBe(_storageColorMap);
  });

  it("should convert settings color map to storage description format", function() {
    var storageDescriptionMap = convertSettingsColorMapToStorageDescriptionMap(_newSettingsPageColorMap);
    expect(storageDescriptionMap).jsonToBe(_storageDescriptionMap);
  });
  
  it("should convert old seetings page color map to new format", function () {
    var newSettingsPageColorMap = convertSettingsPageColorMapToNewFormat(_settingsPageColorMap);
    expect(newSettingsPageColorMap).jsonToBe(_newSettingsPageColorMap);
  });

  it("should convert 2 dimensional json array to csv", function() {
    var grid = [[1,2],[3,4]];
    var csv = jsonGridToCSV(grid);
    expect(csv).toEqual('"1","2"\r\n"3","4"');
  });

});

describe("url conversions",function(){
  it("decode url keep encoded spaces",function(){
    expect(decodeUrlKeepEncodedSpaces("http://tfs.it.volvo.net:8080/tfs/Global/SEGOT-GDP/Team%204%20%E2%80%93%20BICT/_backlogs/board/Features")).
    jsonToBe("http://tfs.it.volvo.net:8080/tfs/Global/SEGOT-GDP/Team%204%20–%20BICT/_backlogs/board/Features");
  });

  it("convert to Spa Url", function(){
    expect(encodeUrl("http://tfs.it.volvo.net:8080/tfs/Global/SEGOT-GDP/Team%204%20%-%20BICT/_backlogs/board/Features")).
    jsonToBe("http(_)(-)(-)tfs.it.volvo.net(_)8080(-)tfs(-)Global(-)SEGOT-GDP(-)Team%204%20%-%20BICT(-)_backlogs(-)board(-)Features");
  })

  it("convert from Spa Url", function(){
    expect(decodeUrl("http(_)(-)(-)tfs.it.volvo.net(_)8080(-)tfs(-)Global(-)SEGOT-GDP(-)Team%204%20%-%20BICT(-)_backlogs(-)board(-)Features")).
    jsonToBe("http://tfs.it.volvo.net:8080/tfs/Global/SEGOT-GDP/Team%204%20%-%20BICT/_backlogs/board/Features");
  })
});

 