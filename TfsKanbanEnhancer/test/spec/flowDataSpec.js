

describe("FlowReport", function() {

  var boardData;
  var boardDesign;
  var snapshot;

  
  beforeEach(function() {
    boardData = new BoardData({});
    snapshot =  testSnapshot(10000000);
    boardDesign = testBoardDesign();
  });


  jsonApproveIt("fr one ticket moving back and forth", function() {
    var flowReport = buildFlowReport(boardDataOneTicketMovingBackAndforth().flowData);
    return flowReport;
  });

  jsonApproveIt("fr one ticket blocked 2 times", function() {
    var flowReport = buildFlowReport(boardDataOneTicketBlocked2Times().flowData);
    return flowReport;
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


  jsonApproveIt("fdg one ticket moving back and forth", function() {
    var flowGrid = new FlowDataGrid(boardDataOneTicketMovingBackAndforth());
    return flowGrid;
  });

  jsonApproveIt("fdg one ticket blocked 2 times", function() {
    var flowGrid = new FlowDataGrid(boardDataOneTicketBlocked2Times());
    return flowGrid;
  });

});

/*describe("Snapshot", function() {

  var boardData;
  var boardDesign;
  var snapshot;

  
  beforeEach(function() {
    boardData = new BoardData({});
    snapshot =  testSnapshot(10000000);
    boardDesign = testBoardDesign();
  });


  jsonApproveIt("snapdhot with 1 ticket new ticket", function() {
    boardData.addSnapshot(simpleSnapshot(new date().getTime(),[],));
    var flowGrid = new buildSnapshot(boardData);
    return flowGrid;
  });

  jsonApproveIt("fdg one ticket moving back and forth", function() {
    var flowGrid = new FlowDataGrid(boardDataOneTicketMovingBackAndforth());
    return flowGrid;
  });

  jsonApproveIt("fdg one ticket blocked 2 times", function() {
    var flowGrid = new FlowDataGrid(boardDataOneTicketBlocked2Times());
    return flowGrid;
  });

});*/



