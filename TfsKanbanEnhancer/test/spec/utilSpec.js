describe("TimeUtil", function() {
  var timeUtil;
  var testValues;
  var expected;
  var i;
  beforeEach(function() {
    timeUtil = new TimeUtil();
  });

  
  testValues = [0.01,1,2.99];
  expected = [0,1,2];
  for(i in testValues){
    
    (function (input, expectedResult){
      it("daysSince should be "+ expectedResult, function() {
        var days = timeUtil.daysSince(timeUtil.now()-(input*timeUtil.MILLISECONDS_DAY));
        expect(days).toBe(expectedResult);
        
      });
    })(testValues[i],expected[i]);
    
  }


  it("readable date should be 2014-12-06 22:22", function() {
    var readableDate = timeUtil.dateFormat(1417900965183);
    expect(readableDate).toBe("2014-12-06 22:22");
    
  });

  it("readable time should be 1:1:1", function() {
    var readableDate = timeUtil.timeFormat(timeUtil.MILLISECONDS_DAY+timeUtil.MILLISECONDS_HOUR + 60000);
    expect(readableDate).toBe("1:01:01");
    
  });

  testValues = [1,2,15];
  expected = ["new",2,"15 (old)"];
  for(i in testValues){
    
    (function (input,expectedResult){
      it("highlightTime should be " + expectedResult, function() {
        var highlightTime = timeUtil.highlightTime(input);
        expect(highlightTime).toBe(expectedResult);
        
      });
    })(testValues[i],expected[i]);
  }

});