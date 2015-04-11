

function testSnapshot(milliseconds){
    return {
        "milliseconds": milliseconds,
        "board": "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection",
        "boardUrl": "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_backlogs/board/boardName",
        "genericItemUrl" : "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=",
        "lanes": [
          {
            "name": "ToDo",
            "tickets": [
              {
                "id": "4",
                "title": "AT 1",
              }
            ]
          },
          {
            "name": "Dev IP",
            "wip": {
              "limit": "5",
              "current": "2"
            },
            "tickets": [
              {
                "id": "9",
                "title": "BL ticket 1",
                "blocked": true
              },
            ]
          },
          {
            "name": "Dev DONE",
            "wip": {
              "limit": "0",
              "current": ""
              
            },
            "tickets": [
              {
                "id": "3",
                "title": "CR 1",
              }
            ]
          },
          {
            "name": "In production",
            "tickets": [
              
            ]
          }
        ]
      };
  }

  function simpleSnapshot(milliseconds,toDo,devIP,devDone,inProd){
    var currentWip = 0;
    if(devIP && devDone){
      currentWip = devIP.length+devDone.length;
    }
    
    
    return new Snapshot({
        "milliseconds": milliseconds,
        "board": "https://boardUrl/",
        "genericItemUrl" : "https://collectionUrl/_workitems#_a=edit&id=",
        "doneState":["Done","Done"],
        "lanes": [
          {
            "name": "ToDo",
            "tickets": toDo
          },
          {
            "name": "Dev IP",
            "wip": {
              "limit": 5,
              "current": currentWip
            },
            "tickets": devIP
          },
          {
            "name": "Dev DONE",
            "wip": {
              "limit": 0,
              "current": ""
              
            },
            "tickets": devDone
          },
          {
            "name": "In production",
            "tickets": inProd
          }
        ]
      });
  }

  function testBoardDesign(){
    return [
          {
            "name": "ToDo"
          },
          {
            "name": "Dev IP",
            "wip": {
              "limit": 5
            }
          },
          {
            "name": "Dev DONE",
            "wip": {
              "limit": 0
            }
          },
          {
            "name": "In production"
          }
        ];
  }

  function createSnapshotTicket(id,title,blocked){
    var newTicket = {};
    newTicket.id = id;
    newTicket.title = title;
    if(blocked){
      newTicket.blocked = true;
    }
    return new SnapshotTicket( "https://collectionUrl/_workitems#_a=edit&id=",newTicket);
  }

  function boardDataOneTicketMovingBackAndforth(){
    var boardData = new BoardData();
    var ticket = createSnapshotTicket("1","CR testTicket");
    var day = timeUtil.MILLISECONDS_DAY;
    boardData.addSnapshot(simpleSnapshot(10*day,[ticket],[],[],[]));
    boardData.addSnapshot(simpleSnapshot(19*day,[ticket],[],[],[]));
    

    boardData.addSnapshot(simpleSnapshot(20*day,[],[ticket],[],[]));
    boardData.addSnapshot(simpleSnapshot(29*day,[],[ticket],[],[]));
    
    boardData.addSnapshot(simpleSnapshot(30*day,[ticket],[],[],[]));
    return boardData;
  }

  function boardDataOneTicketBlocked2Times(){
    var boardData = new BoardData();
    var blockedTicket = createSnapshotTicket("1","CR testTicket",true);
    var ticket = createSnapshotTicket("1","CR testTicket");
    var day = timeUtil.MILLISECONDS_DAY;
    boardData.addSnapshot(simpleSnapshot(10*day,[blockedTicket],[],[],[]));
    boardData.addSnapshot(simpleSnapshot(19*day,[blockedTicket],[],[],[]));
    
    boardData.addSnapshot(simpleSnapshot(20*day,[ticket],[],[],[]));
    boardData.addSnapshot(simpleSnapshot(29*day,[ticket],[],[],[]));
    
    boardData.addSnapshot(simpleSnapshot(30*day,[blockedTicket],[],[],[]));
    return boardData;
  }

function twoIdenticalSnapdhots(){
    var boardData = new BoardData();
    var ticket = createSnapshotTicket("1","CR testTicket");
    var day = timeUtil.MILLISECONDS_DAY;
    boardData.addSnapshot(simpleSnapshot(10*day,[ticket],[],[],[]));
    boardData.addSnapshot(simpleSnapshot(19*day,[ticket],[],[],[]));
    return boardData;
}

function boardDataWith1Snapdhot(){
    var boardData = new BoardData();
    var ticket = createSnapshotTicket("1","CR testTicket");
    var day = timeUtil.MILLISECONDS_DAY;
    boardData.addSnapshot(simpleSnapshot(10 * day,[ticket],[],[],[]));
    return boardData;
}

describe("BoardData", function() {
  var boardData;
  var boardDesign;
  var snapshot;

  
  beforeEach(function() {
    boardData = new BoardData({});
    snapshot =  testSnapshot(10000000);

      boardDesign = testBoardDesign();
  });

  approveIt("create empty object ",function(approvals){
    approvals.verify(boardData);
  });

  approveIt("construction from existing data",function(approvals){
    var boardDataJson;
    boardData.addSnapshot(snapshot);
    boardDataJson = jsonEncode(boardData);
    approvals.verify(new BoardData(jsonDecode(boardDataJson)));
  });

  it("should have itemUrl ",function(){
    boardData.addSnapshot(snapshot);
   expect(boardData.flowData["4"].url()).toBe("https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=4");
  });

  it("created from data should have itemUrl ",function(){
    boardData.addSnapshot(snapshot);
    boardData = new BoardData(boardData);
    expect(boardData.flowData["4"].url()).toBe("https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=4");
  });

  approveIt("should contain added Snapshot", function(approvals) {
    boardData.addSnapshot(snapshot);
    approvals.verify(boardData.getLatestSnapshot());
  });

    it("identical snapshots should result in 1 snapshot record",function(){
        expect(twoIdenticalSnapdhots().snapshotRecords.length).toBe(1);
    })

  approveIt("boardData for 1 ticket moving back and forth",function(approvals){
    approvals.verify(jsonEncode(boardDataOneTicketMovingBackAndforth()));
  });

  approveIt("boardData for 1 ticket blocked 2 times",function(approvals){
    
    approvals.verify(jsonEncode(boardDataOneTicketBlocked2Times()));
  });

  it("should contain Board Design", function() {
    boardData.addSnapshot(snapshot);
    expect(boardData.boardDesignHistory.boardDesignRecords[0].getBoardDesignForSnapshot()).approve(boardDesign);
  });

  it("boardDesign should have correct firstSeen and lastSeen times", function() {
    boardData.addSnapshot(snapshot);
    snapshot.milliseconds = snapshot.milliseconds + 10;
    boardData.addSnapshot(snapshot);
    var boardDesign = boardData.boardDesignHistory.boardDesignRecords[0];
    expect(boardDesign.firstSeen).toEqual(snapshot.milliseconds-10);
    expect(boardDesign.lastSeen).toEqual(snapshot.milliseconds);
  });


    it("should have latest snapshot time", function() {
        boardData.addSnapshot(snapshot);
        expect(boardData.getLatestSnapshotTime()).toEqual(snapshot.milliseconds);
    });

    it("should have lastLane on board", function() {
        boardData.addSnapshot(snapshot);
        expect(boardData.getLastLaneOnBoard()).toEqual(_.last(snapshot.lanes).name);
    });


    it("should contain new Board Design", function() {
    boardData.addSnapshot(snapshot);
    snapshot.milliseconds = snapshot.milliseconds + 10;
    snapshot.lanes[0].name = "Att Göra";
    boardDesign[0].name = "Att Göra";
    boardData.addSnapshot(snapshot);
    var newBoardDesign = boardData.boardDesignHistory.boardDesignRecords[1].getBoardDesignForSnapshot();
    expect(newBoardDesign).approve(boardDesign);
  });



  it("flow Data ticket should have correct enter and exit time", function() {
    boardData.addSnapshot(snapshot);
    snapshot.milliseconds = snapshot.milliseconds + 10;
    boardData.addSnapshot(snapshot);
    var ticket = boardData.flowData["3"];
    var lane = ticket.lanes["Dev DONE"];
    console.log(lane);
    expect(lane[0].firstSeen).toEqual(snapshot.milliseconds-10);
    expect(lane[0].lastSeen).toEqual(snapshot.milliseconds);
  });

  approveIt("boardDesign with earlier firstSeen should be first", function(approvals) {
    boardData.addSnapshot(snapshot);
    var mergeData = new BoardData();
    snapshot = testSnapshot(snapshot.milliseconds - 10);
    snapshot.lanes[0].name = "Att Göra";
    boardDesign[0].name = "Att Göra";
    mergeData.addSnapshot(snapshot);
    boardData = mergeBoardData(boardData,mergeData);
    console.log(jsonEncode(boardData));
    var mergedBoardDesign = boardData.boardDesignHistory.boardDesignRecords[0].getBoardDesignForSnapshot();
    approvals.verify(boardData.boardDesignHistory.boardDesignRecords);
  });

  approveIt("flow Data ticket should have correct enter and exit time after merge", function(approvals) {
    boardData.addSnapshot(snapshot);
    var mergeData = new BoardData();
    snapshot = testSnapshot(snapshot.milliseconds -10);
    snapshot.lanes[0].name = "Att Göra";
    boardDesign[0].name = "Att Göra";
    mergeData.addSnapshot(snapshot);
    boardData = mergeBoardData(boardData,mergeData);
    var ticket = boardData.flowData["3"];
    var lane = ticket.lanes["Dev DONE"];
    approvals.verify(ticket);
  });

    it("ticket should be missing",function(){
        var flowData = new FlowData();
        boardData.addSnapshot(simpleSnapshot(0,[createSnapshotTicket("1","TestTicket")]));
        boardData.addSnapshot(simpleSnapshot(timeUtil.MILLISECONDS_DAY));
        expect(boardData.getTicketsMissingOnBoard()).jsonToBe(["1"]);
    });

    it("ticket should be done",function(){
        boardData.addSnapshot(simpleSnapshot(0,[createSnapshotTicket("1","TestTicket")]));
        boardData.addSnapshot(simpleSnapshot(timeUtil.MILLISECONDS_DAY));
        boardData.updateStateForTicketsNotOnBoard([{"id":1,"state":"Done"}])
        boardData.updateDoneTickets();
        expect(boardData.flowData[1].inLane).toBe("In production");
        expect(boardData.flowData[1].state).toBe("done");
    });

    it("ticket should be removed",function(){
        var flowData = new FlowData();
        boardData.addSnapshot(simpleSnapshot(0,[createSnapshotTicket("1","TestTicket")]));
        boardData.addSnapshot(simpleSnapshot(timeUtil.MILLISECONDS_DAY));
        boardData.updateStateForTicketsNotOnBoard([{"id":1,"state":"ToDo"}])
        boardData.updateDoneTickets();
        expect(boardData.flowData[1].state).toBe("removed");
    });

  approveIt("should create first snapshot from boardData", function(approvals) {
    boardData.addSnapshot(snapshot);
    boardData.addSnapshot(testSnapshot(snapshot.milliseconds+10));
    approvals.verify(jsonEncode(boardData.getSnapshot(snapshot.milliseconds)));
  });

  approveIt("should return all added snapshots from boardData", function(approvals) {
    var snapshot2;
    boardData.addSnapshot(snapshot);
    snapshot2 = testSnapshot(snapshot.milliseconds+10);
    boardData.addSnapshot(snapshot2);
    approvals.verify(boardData.getSnapshots());
  });

    it("done state should be done",function(){
        expect(twoIdenticalSnapdhots().doneState).jsonToBe(["Done","Done"]);
    })

});

describe("Snapshot",function(){
  it("ticket should have url",function(){
    var snapshot = new Snapshot(simpleSnapshot(1000,[createSnapshotTicket(1,"Test")]));
    var snapshotTicket = snapshot.lanes[0].tickets[0];
    expect(snapshotTicket.url()).toBe("https://collectionUrl/_workitems#_a=edit&id=1");
  });
});

describe("FlowData",function(){

  approveIt("should return cfd data", function(approvals){
    var flowData = new FlowData();
    flowData.addSnapshot(simpleSnapshot(0,[createSnapshotTicket("1","Title")],
                                          [createSnapshotTicket("2","Title2")]));
    flowData.addSnapshot(simpleSnapshot(timeUtil.MILLISECONDS_DAY,[createSnapshotTicket("3","Title3")],
                                                                  [createSnapshotTicket("1","Title")],
                                                                  [createSnapshotTicket("2","Title2")]));
    approvals.verify(flowData.getCfdData());
  });

  it("should have item url", function(){
    var flowData = new FlowData();
    flowData.addSnapshot(simpleSnapshot(0,[createSnapshotTicket("1","Title")]));
    
    expect(flowData[1].url()).toBe("https://collectionUrl/_workitems#_a=edit&id=1");
  });

  it("created from data should have item url", function(){
    var flowData = new FlowData();
    flowData.addSnapshot(simpleSnapshot(0,[createSnapshotTicket("1","Title")]));
    flowData = new FlowData(flowData,"genericItemUrl=");
    expect(flowData[1].url()).toBe("genericItemUrl=1");
  });
  // Ticket has left board

  
});

describe("FlowTicket", function() {
  var testValues ;
  var expectedResults ;
  var i;
  var blockedSnapshotItem= {"id":"2","title":"testTitle","blocked":true};
  var snapshotItem = {"id":"2","title":"testTitle","blocked":false};
  var flowTicket;
  
  function flowticketWithTwoRecordsInLaneA10milliseconds(){
    return flowticketWithTwoRecordsInLane(10);
  }

  

  function flowticketWithTwoRecordsInLane(milliseconds){
    var laneName = "lane";
    flowTicket.setLane(laneName,1 * milliseconds);
    flowTicket.setLane(laneName,2 * milliseconds);
    flowTicket.setLane("other lane",2.5 * milliseconds);
    flowTicket.setLane(laneName,3 * milliseconds);
    flowTicket.setLane(laneName,4 * milliseconds);
    return flowTicket;
  }

  function flowticketWithTwoBlockagesA10milliseconds(){
    flowTicket.setBlockStatus(blockedSnapshotItem,10);
    flowTicket.setBlockStatus(blockedSnapshotItem,20);
    flowTicket.setBlockStatus(snapshotItem,30);
    flowTicket.setBlockStatus(blockedSnapshotItem,40);
    flowTicket.setBlockStatus(blockedSnapshotItem,50);
    return flowTicket;
  }

  beforeEach(function() {
    flowTicket = new FlowTicket({},"url");
  });

//Functions
  it("should have itemUrl", function(){
    flowTicket = new FlowTicket({"id":"10"},"url=");
    expect(flowTicket.url()).toBe("url=10");
  });

//lane location
  it("should curently be in lane", function() {
    var laneName = "lane";
    flowTicket.setLane(laneName,10);
    expect(flowTicket.inLane).toBe(laneName);
    
  });


  it("should have firstSeen ===10", function() {
    var laneName = "lane";
    flowTicket.setLane(laneName,10);
    flowTicket.setLane(laneName,20);
    expect(flowTicket.getCurrentLaneRecord().firstSeen).toBe(10);
  });

  it("should have lastSeen ===20", function() {
    var laneName = "lane";
    flowTicket.setLane(laneName,10);
    flowTicket.setLane(laneName,20);
    expect(flowTicket.getCurrentLaneRecord().lastSeen).toBe(20);
  });


  it("should have bin in lane 2 times", function() {
    var laneName = "lane";
    flowTicket.setLane(laneName,10);
    flowTicket.setLane("other lane",15);
    flowTicket.setLane(laneName,20);
    expect(flowTicket.lanes[laneName].length).toBe(2);
  });

   it("should have bin in lane 1 times", function() {
    var laneName = "lane";
    flowTicket.setLane(laneName,10);
    flowTicket.setLane(laneName,20);
    expect(flowTicket.lanes[laneName].length).toBe(1);
  });

  it("should have bin in lane 20 milliseconds", function() {
    flowTicket = flowticketWithTwoRecordsInLaneA10milliseconds();
    expect(flowTicket.getTotalTimeInLane("lane")).toBe(20);

  });

  testValues = [10,15,20,25,30,40,26];
  expectedResults = ["lane","lane","lane","other lane","lane","lane",null];
  for(i in testValues){
    (function (time,inLane){
      it("should have been "+inLane+" at " +time, function() {
        flowTicket = flowticketWithTwoRecordsInLaneA10milliseconds();
        expect(flowTicket.wasInLane(time)).toBe(inLane);
      });
    })(testValues[i],expectedResults[i]);
  }


//Blockages

  it("should curently be blocked", function() {
    flowTicket.setBlockStatus(blockedSnapshotItem,10);
    expect(flowTicket.isBlocked).toBe(true);
    
  });

  it("should curently not be blocked", function() {
    flowTicket.setBlockStatus(snapshotItem,10);
    expect(flowTicket.isBlocked).toBe(false);
    
  });

  it("should have correct blockedRecord firstSeen", function() {
    flowTicket.setBlockStatus(blockedSnapshotItem,10);
    flowTicket.setBlockStatus(blockedSnapshotItem,20);
    expect(flowTicket.blockedRecords[0].firstSeen).toBe(10);
  });

  

  it(" should  have correct blockedRecord lastSeen", function() {
    flowTicket.setBlockStatus(blockedSnapshotItem,10);
    flowTicket.setBlockStatus(blockedSnapshotItem,20);
    expect(flowTicket.blockedRecords[0].lastSeen).toBe(20);
  });


  it("should have blockedRecord with length 2", function() {
    flowTicket.setBlockStatus(blockedSnapshotItem,10);
    flowTicket.setBlockStatus(snapshotItem,20);
    flowTicket.setBlockStatus(blockedSnapshotItem,30);
    expect(flowTicket.blockedRecords.length).toBe(2);
  });



  it("should have correct totalBlocked time", function() {
    var flowTicket= flowticketWithTwoBlockagesA10milliseconds();
    expect(flowTicket.getTotalBlockedTime()).toBe(20);
  });

  it("should be blocked since 40", function() {
    var flowTicket= flowticketWithTwoBlockagesA10milliseconds();
    expect(flowTicket.blockedSince()).toBe(40);
  });

  it("should be blocked since null", function() {
    expect(flowTicket.blockedSince()).toBe(null);
  });

  testValues = [10,15,20,40,50];
  for(i in testValues){
    (function (time){
      it("should have been blocked for time =" +testValues[i], function() {
        var flowTicket= flowticketWithTwoBlockagesA10milliseconds();
        expect(flowTicket.wasBlocked(time)).toBe(true);
        
      });
    })(testValues[i]);
    
  }

  testValues = [21,25,29];
  for(i in testValues){
    (function (time){
      it("should not have been blocked for time =" +testValues[i], function() {
        
        var flowTicket= flowticketWithTwoBlockagesA10milliseconds();
        expect(flowTicket.wasBlocked(time)).toBe(false);
            
      });
    })(testValues[i]);
    
  }

  

  // CFD
  approveIt("ticket should return cfdData", function(approvals) {
    flowTicket = flowticketWithTwoRecordsInLane(1.1 * timeUtil.MILLISECONDS_DAY);
    approvals.verify(flowTicket.cfdData());
  });
});

describe("CFD",function(){

  function ticketMovingAcrossTheBoard1ColumnPerDay(boardData,arrayWithTickets){
    boardData.addSnapshot(simpleSnapshot(0,arrayWithTickets));
    boardData.addSnapshot(simpleSnapshot(timeUtil.MILLISECONDS_DAY,[],arrayWithTickets));
    boardData.addSnapshot(simpleSnapshot(2*timeUtil.MILLISECONDS_DAY,[],[],arrayWithTickets));
    boardData.addSnapshot(simpleSnapshot(3*timeUtil.MILLISECONDS_DAY,[],[],[],arrayWithTickets));
    return boardData;
  }
  
  approveIt("CFD for ticket moving across board", function(approvals){
    var boardData = ticketMovingAcrossTheBoard1ColumnPerDay(new BoardData(),[createSnapshotTicket("1","TestTicket")]);
    approvals.verify(boardData.getCfdData());
  });

  //nvD3 data format
  approveIt("CFD chart data for ticket moving across board", function(approvals){
    var boardData = ticketMovingAcrossTheBoard1ColumnPerDay(new BoardData(),[createSnapshotTicket("1","TestTicket")]);
    approvals.verify(boardData.buildCfdChartData(boardData.getCfdData()));
  });

  approveIt("CFD for tickets last two days moving across the board", function(approvals){
    var boardData = ticketMovingAcrossTheBoard1ColumnPerDay(new BoardData(),[createSnapshotTicket("1","TestTicket")]);
    var filter = {"startMilliseconds" : 2*timeUtil.MILLISECONDS_DAY};
    approvals.verify(boardData.getCfdData(filter));
  });

  approveIt("CFD for tickets first two days moving across the board", function(approvals){
    var boardData = ticketMovingAcrossTheBoard1ColumnPerDay(new BoardData(),[createSnapshotTicket("1","TestTicket")]);
    var filter = {"endMilliseconds" : 1*timeUtil.MILLISECONDS_DAY};
    approvals.verify( boardData.getCfdData(filter));
  });

    approveIt("CFD for done ticket disapeared from board ", function(approvals){
        var boardData = new BoardData();
        boardData.addSnapshot(simpleSnapshot(0,[createSnapshotTicket("1","TestTicket")]));
        boardData.addSnapshot(simpleSnapshot(timeUtil.MILLISECONDS_DAY-1));
        boardData.updateStateForTicketsNotOnBoard([{"id":1,"state":"Done"}])
        approvals.verify(boardData.getCfdData());
    });

    approveIt("CFD for removed ticket", function(approvals){
        var boardData = new BoardData();
        boardData.addSnapshot(simpleSnapshot(0,[createSnapshotTicket("1","TestTicket")]));
        boardData.addSnapshot(simpleSnapshot(timeUtil.MILLISECONDS_DAY-1));
        boardData.updateStateForTicketsNotOnBoard([{"id":1,"State":"ToDo"}])
        approvals.verify(boardData.getCfdData());
    });



  approveIt("CFD for tickets filtered by CR", function(approvals){
    var boardData = ticketMovingAcrossTheBoard1ColumnPerDay(new BoardData(),[createSnapshotTicket("1","TestTicket"),createSnapshotTicket("2"," CR TestTicket")]);
    var filter = {"text" : "CR"};
    approvals.verify(boardData.getCfdData(filter));
  });

  approveIt("CFD for tickets filtered no tickets found", function(approvals){
    var boardData = ticketMovingAcrossTheBoard1ColumnPerDay(new BoardData(),[createSnapshotTicket("1","TestTicket"),createSnapshotTicket("2"," CR TestTicket")]);
    var filter = {"text" : "_"};
    approvals.verify(boardData.getCfdData(filter));
  });

});