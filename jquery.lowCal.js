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
    currentDate: {},
    currentPos : 0,
    selectedDate : null,
    format : 'dd/mm/yyyy',
    m_names : new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")
  };
  
  // ## Prototype stuff
  // The meat of the plugin.
  
  $.Cal.prototype = {

      // _init fires when instance is first created
      // and when instance is triggered again -> $el.lowCal();
      _init : function( callback ) {
        var $opt = this.options;
        $opt.format = $opt.format.split('/');  
        $opt.currentDate = this._setDate( this.element.val() ? this.element.val() : new Date );

        log( this.getCurrentDate());
        log(this._daysInMonth( 'next' ));
      },
      
      
      tester : function (a) {
        log('obj changed');
        log(a);
      },
      
      
      //
      _create: function( options ){
        this.options = $.extend( true, {}, $.Cal.settings, options );
        
        // split format into array to help determine how the user wants the date returned
          
      },
      
      
      option: function( key, value ){
        // set options AFTER initialization:
        // signature: $('#foo').bar({ cool:false });
        if ( $.isPlainObject( key ) ){
          this.options = $.extend(true, this.options, key);
        } 
      },
      
      
      
      // ### _setDate()
      // Helper function to set the current date
      _setDate: function ( d ) {
        var cd = {};
        if ( typeof d === 'string' ) {
          return this._splitDateString( d );
        }
        else {
          cd.Day = d.getDate();
          cd.Month = d.getMonth() + 1;
          cd.Year = d.getFullYear();
        }
        return cd;  
      },
      
      
      // ### _splitDateString
      // Split the date string into a usable object       
      _splitDateString : function ( dateString ) {
        var cd = {},
            dateString = dateString.split('/'); 
        $.map( this.options.format , function(item, index) {
          switch (item) {
            case 'd' : 
            case 'dd' : 
              cd.Day = dateString[index];
              break;
            case 'm' : 
            case 'mm' : 
              cd.Month = dateString[index];
              break;
            case 'y' : 
            case 'yy' : 
            case 'yyyy' : 
              cd.Year = dateString[index];
              break;
          }
        });
        
        return cd;
        
      },
      
      _daysInMonth : function ( move ) {
        var cd = this.options.currentDate,
            month = ( move == 'next' ) ? parseInt(cd.Month) + 1 : parseInt(cd.Month) - 1,
            year = cd.Year;

        if ( move === 'prev' && month === 0 ) {
          year--;
          month = 12;
          log('hi--');
        }
        else if ( move === 'next' && month === 13 ) {
          year++;
          month = 1;
          log('hi++');
        }
        // obviously this sucks — but it works!
        return [ [year, month , 1] , 32 - new Date(year, (month - 1) , 32).getDate() , new Date(year, (month - 1) , 1).getDay() ];
      },
      
      
      // ### getCurrentDate
      // Returns the Current dates in prefered format
      getCurrentDate : function () {
        return this._formatDate( this.options.currentDate );
      },
      
      _formatDate : function ( dateArray ) {
        return dateArray.Day + "/" + dateArray.Month + "/" + dateArray.Year;
      }
      

    
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