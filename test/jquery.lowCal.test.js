$(document).ready(function() {
  tests();
});

function tests( ) {

module("lowCal", {
  setup: function() {
    S.open('../index.html');
    this.dateSet = '17/08/2011';
    this.dateNew = new Date();
    this.td = this.dateNew.getDate() + "/" + (this.dateNew.getMonth()+1 ) + "/" + this.dateNew.getFullYear();
    this.thisMonthStarts = new Date( this.dateNew.getFullYear() , this.dateNew.getMonth() , 1 ).getDay();
    this.days = [ '', 'Monday' , 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
    this.inputEl = '<input type="text" class="date" value="@@" />';
    this.el = $('#qunit-fixture');
    this.addInput( this.dateSet );
  },
  addInput: function( date ) {
    this.t = this.el.html( this.inputEl.replace('@@', date ));
  },
  teardown: function () {
    return this;
  }
});



test("Set dates", function() {
  console.log(S);
  var inst = $('.date').lowCal(),
      setDate = inst.data('lowCal').getCurrentDate();
      
  equal( setDate, this.dateSet, "Date Set via input" );
  
  // Test for checking when the week starts (from input field)
  var testDateObj = inst.data('lowCal')._splitDateString(setDate);
  var monthStarts = inst.data('lowCal')._dayMonthBegins( testDateObj.Month , testDateObj.Year );
  equal( monthStarts , 1 , "The month of August 2011 starts on a Monday (1) " );
  inst.remove();

  // Test for getting date from Date()
  this.addInput('');
  inst = $('.date').lowCal();
  setDate = inst.data('lowCal').getCurrentDate();
  equal( setDate, this.td, "Date Set via Date()" );
  
  testDateObj = inst.data('lowCal')._splitDateString(setDate);
  monthStarts = inst.data('lowCal')._dayMonthBegins( testDateObj.Month , testDateObj.Year );
  equal( monthStarts , this.thisMonthStarts , "This month starts on … " + this.days[this.thisMonthStarts] + " (" + this.thisMonthStarts + ")" );
//  inst.remove();
});

test("Test for IS leap year", function() {
  var years = {2100 : false , 2005 : false, 2004 : true , 2003 : false, 2001 : false, 2000 : true , 1999  : false },
      feb = "01/02/",
      inst = $('.date').lowCal(),
      leapDays = 29;
      
      $.each(years, function ( i , v ) { 
        if ( v ) {
          equal( inst.data('lowCal')._daysInMonth( "02" , i ) , leapDays , i + " is a leap year");
        } else {
          notEqual( inst.data('lowCal')._daysInMonth( "02" , i ) , leapDays , i + " is NOT a leap year");
        }
      });
});

}