describe("Converters", function() {
  var boardData;
  var song;

  beforeEach(function() {
    
  });

  it("should convert stored links to view format", function() {
    var links = {"google":"http://google.com","bing":"http://bing.com"};
    var settingsLinks = convertStorageLinksToSettingsLinks(links);
    var expectedResult = [{caption : "google", url : "http://google.com"},
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
    expect(settingsLinks).toEqual(expectedResult);
  });

  it("should convert settings links to storage format", function() {
    var expectedResult = {"google":"http://google.com","bing":"http://bing.com"};
    var links = [{caption : "google", url : "http://google.com"},
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
    var storageLinks = convertSettingsLinksToStorageLinks(links);
    expect(storageLinks).toEqual(expectedResult);
  });

  

});

 