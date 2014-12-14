describe("FlowReport", function() {

  var boardData;
  var boardDesign;
  var snapshot;

  
  beforeEach(function() {
    boardData = new BoardData({});
    snapshot =  testSnapshot(10000000);
    boardDesign = testBoardDesign();
  });


  it("should be generated", function() {
    boardData.addSnapshot(snapshot);
    var flowReport = buildFlowReport(boardData.flowData);
    expect(jsonEncode(flowReport)).toBe(jsonEncode([["Id","Title","url","lane","first","last"],["3","CR 1","https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=3","Dev DONE","1970-01-01 03:46","1970-01-01 03:46"],["","","","","",""],["4","AT 1","https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=4","ToDo","1970-01-01 03:46","1970-01-01 03:46"],["","","","","",""],["9","BL ticket 1","https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=9","Dev IP","1970-01-01 03:46","1970-01-01 03:46"],["9","BL ticket 1","https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=9","Blocked","1970-01-01 03:46","1970-01-01 03:46"],["","","","","",""]]));
  });

});

describe("FlowDataGrid", function() {

  var boardData;
  var boardDesign;
  var snapshot;

  
  beforeEach(function() {
    boardData = new BoardData({});
    snapshot =  testSnapshot(10000000);
    boardDesign = testBoardDesign();
  });


  it("should be generated", function() {
    boardData.addSnapshot(snapshot);
    var flowGrid = new FlowDataGrid(boardData);
    expect(jsonEncode(flowGrid)).toBe(jsonEncode([[null,null,"ToDo",null,"Dev IP",null,"Dev DONE",null,"In production",null],["TFS Id","Title","First","Last","First","Last","First","Last","First","Last"],["3","CR 1",null,null,null,null,"1970-01-01 03:46","1970-01-01 03:46",null,null],["4","AT 1","1970-01-01 03:46","1970-01-01 03:46",null,null,null,null,null,null],["9","BL ticket 1",null,null,"1970-01-01 03:46","1970-01-01 03:46",null,null,null,null]]));
  });

});


