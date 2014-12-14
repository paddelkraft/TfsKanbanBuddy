function testSnapshot(milliseconds){
    return {
        "milliseconds": milliseconds,
        "board": "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection",
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
              "current": 2
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
              "current": "0"
              
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

  function testBoardDesign(){
    return [
          {
            "name": "ToDo",
          },
          {
            "name": "Dev IP",
            "wip": {
              "limit": "5"
            },
          },
          {
            "name": "Dev DONE",
            "wip": {
              "limit": "0"
            },
          },
          {
            "name": "In production",
          }
        ];
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

  



  it("should contain addedSnapshot", function() {
    boardData.addSnapshot(snapshot);
    expect(jsonEncode(boardData.getLatestSnapshot())).toEqual(jsonEncode(snapshot));
  });

  it("should contain Board Design", function() {
    boardData.addSnapshot(snapshot);
    expect(boardData.boardDesignHistory.boardDesignRecords[0].getBoardDesignForSnapshot()).toEqual(boardDesign);
  });

  it("boardDesign shoud have correct firstSeen and lastSeen times", function() {
    boardData.addSnapshot(snapshot);
    snapshot.milliseconds = snapshot.milliseconds + 10;
    boardData.addSnapshot(snapshot);
    var boardDesign = boardData.boardDesignHistory.boardDesignRecords[0];
    expect(boardDesign.firstSeen()).toEqual(snapshot.milliseconds-10);
    expect(boardDesign.lastSeen()).toEqual(snapshot.milliseconds);
  });

  it("should contain new Board Design", function() {
    boardData.addSnapshot(snapshot);
    snapshot.milliseconds = snapshot.milliseconds + 10;
    snapshot.lanes[0].name = "Att Göra";
    boardDesign[0].name = "Att Göra";
    boardData.addSnapshot(snapshot);
    var newBoardDesign = boardData.boardDesignHistory.boardDesignRecords[1].getBoardDesignForSnapshot();
    expect(newBoardDesign).toEqual(boardDesign);
  });



  it("flow Data ticket should have correct enter and exit time", function() {
    boardData.addSnapshot(snapshot);
    snapshot.milliseconds = snapshot.milliseconds + 10;
    boardData.addSnapshot(snapshot);
    var ticket = boardData.flowData["3"];
    var lane = ticket.lanes["Dev DONE"];
    console.log(lane);
    expect(lane.enterMilliseconds).toEqual(snapshot.milliseconds-10);
    expect(lane.exitMilliseconds).toEqual(snapshot.milliseconds);
  });

  it("boardDesign with earlier firstSeen should be first", function() {
    boardData.addSnapshot(snapshot);
    var mergeData = new BoardData();
    snapshot = testSnapshot(snapshot.milliseconds - 10);
    snapshot.lanes[0].name = "Att Göra";
    boardDesign[0].name = "Att Göra";
    mergeData.addSnapshot(snapshot);
    boardData = mergeBoardData(boardData,mergeData);
    console.log(jsonEncode(boardData));
    var mergedBoardDesign = boardData.boardDesignHistory.boardDesignRecords[0].getBoardDesignForSnapshot();
    expect(mergedBoardDesign).toEqual(boardDesign);
  });

  it("flow Data ticket should have correct enter and exit time after merge", function() {
    boardData.addSnapshot(snapshot);
    var mergeData = new BoardData();
    snapshot = testSnapshot(snapshot.milliseconds -10);
    snapshot.lanes[0].name = "Att Göra";
    boardDesign[0].name = "Att Göra";
    mergeData.addSnapshot(snapshot);
    boardData = mergeBoardData(boardData,mergeData);
    var ticket = boardData.flowData["3"];
    var lane = ticket.lanes["Dev DONE"];
    expect(lane.enterMilliseconds).toEqual(snapshot.milliseconds);
    expect(lane.exitMilliseconds).toEqual(snapshot.milliseconds+10);
  });

  it("should create first snapshot from boardData", function() {
    boardData.addSnapshot(snapshot);
    boardData.addSnapshot(testSnapshot(snapshot.milliseconds+10));
    expect(jsonEncode(boardData.getSnapshot(snapshot.milliseconds))).toEqual(jsonEncode(snapshot));
  });

  it("should return all added snapshots from boardData", function() {
    var snapshot2;
    boardData.addSnapshot(snapshot);
    snapshot2 = testSnapshot(snapshot.milliseconds+10);
    boardData.addSnapshot(snapshot2);
    expect(jsonEncode(boardData.getSnapshots())).toEqual(jsonEncode([snapshot,snapshot2]));
  });
});

describe("FlowTicket", function() {
  var testValues ;
  var i;
  var blockedSnapshotItem= {"id":"2","title":"testTitle","blocked":true};
  var snapshotItem = {"id":"2","title":"testTitle","blocked":false};;
  var flowTicket;
  
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

  
});


 