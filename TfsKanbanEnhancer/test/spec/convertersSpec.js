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
 
   _newEmptySettingsPageColorMap = [{"color" : "black" ,       "prefix" : "", "description" : "expediter"},
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
  
  it("should convert old seetings page color map to new format", function () {
	  var newSettingsPageColorMap = convertSettingsPageColorMapToNewFormat(_settingsPageColorMap);
	  expect(newSettingsPageColorMap).toEqual(_newSettingsPageColorMap);
  });

});

 