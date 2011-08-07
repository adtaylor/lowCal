
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
  var t = $el.html( inputEl.replace('@@', dateSet )),
  inst = $('.date').lowCal(),
  setDate = inst.data('lowCal').getCurrentDate(),
  monthStarts = inst.data('lowCal')._dayMonthBegins();
  equal( setDate, dateSet, "Date Set via input" );
  equal( monthStarts , 1 , "The month of August starts on a Monday (1) " );
  inst.remove();


  t = $el.html( inputEl.replace('@@', '' ));
  inst = $('.date').lowCal();
  setDate = inst.data('lowCal').getCurrentDate();
  monthStarts = inst.data('lowCal')._dayMonthBegins();
  equal( setDate, td, "Date Set via input" );
  console.log( [ 'month starts' , thisMonthStarts ])
  equal( monthStarts , thisMonthStarts , "This month starts on … " + days[thisMonthStarts] + " (" + thisMonthStarts + ")" );
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

