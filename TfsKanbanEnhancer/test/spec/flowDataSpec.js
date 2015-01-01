

describe("FlowReport", function() {

  var boardData;
  var boardDesign;
  var snapshot;

  
  beforeEach(function() {
    boardData = new BoardData({});
    snapshot =  testSnapshot(10000000);
    boardDesign = testBoardDesign();
  });


  approveIt("fr one ticket moving back and forth", function() {
    var flowReport = buildFlowReport(boardDataOneTicketMovingBackAndforth().flowData);
    return flowReport;
  });

  approveIt("fr one ticket blocked 2 times", function() {
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


  approveIt("fdg one ticket moving back and forth", function() {
    var flowGrid = new FlowDataGrid(boardDataOneTicketMovingBackAndforth());
    return flowGrid;
  });

  approveIt("fdg one ticket blocked 2 times", function() {
    var flowGrid = new FlowDataGrid(boardDataOneTicketBlocked2Times());
    return flowGrid;
  });

});

describe("Snapshot", function() {

  var boardData;
  
  beforeEach(function() {
    boardData = new BoardData({});
  });


  approveIt("mixed snapshot", function() {
    var oldTicket = createSnapshotTicket("1","old Ticket",true);
    var tenDayTicket = createSnapshotTicket("2","10day Ticket");
    var twentyDayTicket = createSnapshotTicket("3","20day Ticket");
    var twentyDayTicketInlane10Days = createSnapshotTicket("4","20day Ticket in lane for 10 days",true);
    var newTicket = createSnapshotTicket("5","new Ticket",true);
    
    function daysAgo(days){
      return new Date().getTime()-days*timeUtil.MILLISECONDS_DAY;
    }

    boardData.addSnapshot(simpleSnapshot(daysAgo(50),[oldTicket],[],[],[]));
    boardData.addSnapshot(simpleSnapshot(daysAgo(20),[oldTicket,twentyDayTicket,twentyDayTicketInlane10Days],[],[],[]));
    boardData.addSnapshot(simpleSnapshot(daysAgo(10),[oldTicket,twentyDayTicket,tenDayTicket],[twentyDayTicketInlane10Days],[],[]));
    boardData.addSnapshot(simpleSnapshot(daysAgo(1),[oldTicket,twentyDayTicket,tenDayTicket,newTicket],[twentyDayTicketInlane10Days],[],[]));
    
    var snapshot = new buildSnapshot(boardData);
    snapshot.milliseconds = 0;
    return snapshot;
  });

  

});



