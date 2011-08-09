module("/lowCal/index.html",{
    setup : function(){
        S.open('/lowCal/index.html');
    },
    teardown : function(){
        
    }
})

test("change me!", function(){

    S(".lowCal li.lc-arrow:eq(1)").click();
    S(".lowCal .lc-dates li:eq(18)").click();
    
    equal($(".lowCal .lc-dates li:eq(18)").hasClass("lc-selected") , true , 'yep, has that class' );
})