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

  var testValues = [1,2,15];
  var expected = ["new",2,"15 (old)"];
  for(i in testValues){
    
    (function (input,expectedResult){
      it("highlightTime should be " + expectedResult, function() {
        var highlightTime = timeUtil.highlightTime(input,14);
        expect(highlightTime).toBe(expectedResult);
        
      });
    })(testValues[i],expected[i]);
  }

 });

describe("cfdUtil",function(){
    var testValues = [0,1,49,50,99,100,149,150];
    describe("cfdSamplingInterval",function(){

       var expected = [1,1,1,1,1,2,2,3]
       var i;
       for(i in testValues){
           (function(value,expected){
               it("should be "+ expected +" when start - end = "+ value ,function(){
                expect(cfdUtil.cfdSamplingIntervall(0,value*timeUtil.MILLISECONDS_DAY)).toBe(expected);
               });
           })(testValues[i],expected[i]);
       }

   });

    describe("cfdSamplingTimes",function(){
        var expected = [2,3,51,52,51,52,51,52]
        var i;
        for(i in testValues){
            (function(value,expected){
                it("should have length "+ expected +" when start is 0 and  end is "+ value ,function(){
                    expect(cfdUtil.generateCfdSampleTimes(0,value*timeUtil.MILLISECONDS_DAY).length).toBe(expected);
                });
            })(testValues[i],expected[i]);
        }
    });

    describe("readableDatesOnCfdData",function(){
        var cfdData = [
                ["Date","ToDo","Done"],
                [0,0,0],
                [timeUtil.MILLISECONDS_DAY,0,0],
                [2*timeUtil.MILLISECONDS_DAY,0,0]
        ]

        approveIt("should replace millisecond times with readable dates",function(approvals){
            approvals.verify(cfdUtil.readableDatesOnCfdData(cfdData));
        });
    });
});