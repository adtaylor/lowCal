
$(document).ready(function() {
  tests();
});




function tests( ) {

//QUnit.config.hidepassed = true;

var dateSet = '17/08/2011',
    dateNew = new Date,
    td = dateNew.getDate() + "/" + (dateNew.getMonth()+1 ) + "/" + dateNew.getFullYear(),
    thisMonthStarts = new Date( dateNew.getFullYear() , dateNew.getMonth() , 1 ).getDay(),
    days = [ '', 'Monday' , 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ],
    inputEl = '<input type="text" class="date" value="@@" />',
    $el = $('#qunit-fixture');

module("lowCal");
test("Set dates", function() {
  expect(4);
  
  // Test for getting the date from a input field
  var t = $el.html( inputEl.replace('@@', dateSet )),
  inst = $('.date').lowCal(),
  setDate = inst.data('lowCal').getCurrentDate();
  equal( setDate, dateSet, "Date Set via input" );
  
  // Test for checking when the week starts (from input field)
  var testDateObj = inst.data('lowCal')._splitDateString(setDate);
  monthStarts = inst.data('lowCal')._dayMonthBegins( testDateObj.Month , testDateObj.Year );
  equal( monthStarts , 1 , "The month of August 2011 starts on a Monday (1) " );
  // pull down the instance
  inst.remove();

  // Test for getting date from Date()
  t = $el.html( inputEl.replace('@@', '' ));
  inst = $('.date').lowCal();
  setDate = inst.data('lowCal').getCurrentDate();
  equal( setDate, td, "Date Set via Date()" );
  
  testDateObj = inst.data('lowCal')._splitDateString(setDate);
  monthStarts = inst.data('lowCal')._dayMonthBegins( testDateObj.Month , testDateObj.Year );
  equal( monthStarts , thisMonthStarts , "This month starts on … " + days[thisMonthStarts] + " (" + thisMonthStarts + ")" );
  inst.remove();
});

test("Check for leap years", function() {

//    2100, 2005, 2004, 2003, 2001, 2000 and 1999 
//    2004 and 2000 should be leap years

	ok(true);
});

test("Check month decrement", function() {
	ok(true);
});

test("Check month to year increment", function() {
	ok(true);
});

test("Check month to year decrement", function() {
	ok(true);
});







module("Render Calendar");
test("Render Cal widget", function() {
	ok(true);
});

test("Test binds on buttons", function() {
	ok(true);
});



module("Set input");

test("Set value to input", function() {
	expect(1);
	ok(true);
});

};

