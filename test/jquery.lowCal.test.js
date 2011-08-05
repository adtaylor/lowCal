
$(document).ready(function() {
  tests();
});




function tests( ) {

//QUnit.config.hidepassed = true;

var dateSet = '17/08/2011',
    dateNew = new Date,
    td = dateNew.getDate() + "/" + dateNew.getMonth() + "/" + dateNew.getFullYear(),
    inputEl = '<input type="text" class="date" value="@@" />',
    $el = $('#qunit-fixture');

module("lowCal");
test("Set dates", function() {
  var t, inst, setDate;
  
  expect(2);
  t = $el.html( inputEl.replace('@@', dateSet ));
  inst = $('.date').lowCal(),
  setDate = inst.data('lowCal').getCurrentDate();
  
  equal( setDate, dateSet, "Date Set via input" );
  inst.remove();


  t = $el.html( inputEl.replace('@@', '' ));
  inst = $('.date').lowCal(),
  setDate = inst.data('lowCal').getCurrentDate();
  
  equal( setDate, td, "Date Set via input" );
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

