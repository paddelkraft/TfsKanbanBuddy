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

  var _storageColorMap = {"!":"expediter","*":"blocked","CR":"blue"};
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
  
  _emptySettingsPageColorMap = [{"color" : "expediter" ,   "prefix" : "" },
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
    var settingsPageColorMap = convertStorageColorMapToSettingsColorMap(null);
    expect(settingsPageColorMap).toEqual(_emptySettingsPageColorMap);
  });

  it("should convert stored color map to view format", function() {
    var settingsPageColorMap = convertStorageColorMapToSettingsColorMap(_storageColorMap);
    expect(settingsPageColorMap).toEqual(_settingsPageColorMap);
  });

  it("should convert settings color map to storage format", function() {
    var storageColorMap = convertSettingsColorMapToStorageColorMap(_settingsPageColorMap);
    expect(storageColorMap).toEqual(_storageColorMap);
  });

  it("should convert 2 dimensional json array to csv", function() {
    var grid = [[1,2],[3,4]];
    var csv = jsonGridToCSV(grid);
    console.log(csv);
    expect(csv).toEqual('"1","2"\r\n"3","4"');
  });
});

 