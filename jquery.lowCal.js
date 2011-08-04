/**
 * jQuery lowCal v1
 * A light-weight calendar widget with no
 * dependancies.
 *
 * Copyright 2011 Ad Taylor (@iamadtaylor)
 */
 
(function( window, $, undefined ){

  $.Cal = function( options, element ){
    this.element = $( element );

    this._create( options )
    this._init();
  };
  
  $.Cal.settings = {
    static: true,
    currentDate: {},
    currentPos : 0,
    selectedDate : null
  };
  
  // ## Prototype stuff
  // The meat of the plugin.
  
  $.Cal.prototype = {

    
      // _init fires when instance is first created
      // and when instance is triggered again -> $el.lowCal();
      _init : function( callback ) {
        
        this._setDate();
        log(this.options);
        logError('init');
      },
      
      
      //
      _create: function( options ){
        this.options = $.extend( true, {}, $.Cal.settings, options );      
      },
      
      
      option: function( key, value ){
        // set options AFTER initialization:
        // signature: $('#foo').bar({ cool:false });
        if ( $.isPlainObject( key ) ){
          this.options = $.extend(true, this.options, key);
        } 
      },
      
      
      _setDate: function () {
        var d = new Date,
            cd = {};
        cd.Day = j.getDate();
        cd.Month = j.getMonth();
        cd.Year = j.getFullYear();

        this.options.currentDate = f;
      },
      
      _redrawCal: function () {
//                f.DaysInMonth = new Date(f.drawYear, f.drawMonth, 0).getDate();
      },
      
      _setMonth: function () {
        var l = this._getInst(b[0]);
        l._selectingMonthYear = false;
        l["selected" + (j == "M" ? "Month" : "Year")] = l["draw" + (j == "M" ? "Month" : "Year")] = parseInt(f.options[f.selectedIndex].value, 10);
                   
      },
    
  }; 
  
  
 
 
  // ### Logger functions
  // 
  // Make the console safe.
  //
  var logError = function( message ) {
    if ( this.console ) console.error( message );
  };

  var log = function( message ) {
    if ( this.console ) console.log( message );
  };
  
  
  
  
  
  // ## Bridge —— An ashamedly ripped straight from Masonry
  // A bit from jQuery UI
  //   https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
  // A bit from jcarousel 
  //   https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

  $.fn.lowCal = function( options ) {
    if ( typeof options === 'string' ) {
      // call method
      var args = Array.prototype.slice.call( arguments, 1 );

      this.each(function(){
        var instance = $.data( this, 'lowCal' );
        if ( !instance ) {
          logError( "cannot call methods on lowCal prior to initialization; " +
            "attempted to call method '" + options + "'" );
          return;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
          logError( "no such method '" + options + "' for lowCal instance" );
          return;
        }
        // apply method
        instance[ options ].apply( instance, args );
      });
    } else {
      this.each(function() {
        var instance = $.data( this, 'lowCal' );
        if ( instance ) {
          // apply options & init
          instance.option( options || {} );
          instance._init();
        } else {
          // initialize new instance
          $.data( this, 'lowCal', new $.Cal( options, this ) );
        }
      });
    }
    return this;
  };
  
  
})( window, jQuery );