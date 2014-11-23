describe("BoardData", function() {
  var boardData;
  var boardDesign;
  var snapshot;

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
                "title": "ticket 1",
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

  beforeEach(function() {
    boardData = new BoardData({});
    snapshot =  testSnapshot(10000000);

      boardDesign = [
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
    snapshot.milliseconds = snapshot.milliseconds - 10;
    snapshot.lanes[0].name = "Att Göra";
    boardDesign[0].name = "Att Göra";
    mergeData.addSnapshot(snapshot);
    boardData.merge(mergeData);
    console.log(jsonEncode(boardData));
    var mergedBoardDesign = boardData.boardDesignHistory.boardDesignRecords[0].getBoardDesignForSnapshot();
    expect(mergedBoardDesign).toEqual(boardDesign);
  });

  it("flow Data ticket should have correct enter and exit time after merge", function() {
    boardData.addSnapshot(snapshot);
    var mergeData = new BoardData();
    snapshot.milliseconds = snapshot.milliseconds - 10;
    snapshot.lanes[0].name = "Att Göra";
    boardDesign[0].name = "Att Göra";
    mergeData.addSnapshot(snapshot);
    boardData.merge(mergeData);
    var ticket = boardData.flowData["3"];
    var lane = ticket.lanes["Dev DONE"];
    expect(lane.enterMilliseconds).toEqual(snapshot.milliseconds);
    expect(lane.exitMilliseconds).toEqual(snapshot.milliseconds+10);
  });

  it("should create snapshots from boardData", function() {
    boardData.addSnapshot(snapshot);
    boardData.addSnapshot(testSnapshot(snapshot.milliseconds+10));
    expect(jsonEncode(boardData.getSnapshot(snapshot.milliseconds))).toEqual(jsonEncode(snapshot));
  });




});

 