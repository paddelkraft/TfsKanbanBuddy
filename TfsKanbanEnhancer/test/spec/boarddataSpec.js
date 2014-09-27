describe("BoardData", function() {
  var boardData;
  var song;

  beforeEach(function() {
    boardData = new BoardData({});
    snapshot = {
        "time": "2014-09-24-20:38",
        "milliseconds": 1411583924163,
        "board": "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection",
        "lanes": [
          {
            "name": "ToDo",
            "tickets": [
              {
                "id": "4",
                "title": "AT 1",
                "url": "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=4"
              }
            ]
          },
          {
            "name": "Dev IP",
            "wip": {
              "current": "2",
              "limit": "5"
            },
            "tickets": [
              {
                "id": "9",
                "title": "ticket 1",
                "url": "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=9"
              },
            ]
          },
          {
            "name": "Dev DONE",
            "wip": {
              "current": "",
              "limit": ""
            },
            "tickets": [
              {
                "id": "3",
                "title": "CR 1",
                "url": "https://paddelkraft.visualstudio.com/DefaultCollection/tfsDataCollection/_workitems#_a=edit&id=3"
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
  });

  it("should contain addedSnapshot", function() {
    boardData.addSnapshot(snapshot);
    expect(boardData.snapshots[0]).toEqual(snapshot);
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

});

 