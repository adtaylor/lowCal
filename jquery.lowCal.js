/**
 * jQuery lowCal v1
 * A light-weight jQuery calendar widget with no
 * other dependancies.
 *
 * Copyright 2011 Ad Taylor (@iamadtaylor)
 */
 
( function( window, $ ){

  this.debug = true;
  this.debugStrict = true;
  $.Cal = function( options, element ){
    this.el = $( element );
    this.cache = {};

    this._create( options );
    this._init();
  };
  
  $.Cal.templates = {
    days :'<% $.each(days, function(index, val) { %><li class="lc-date <% if(val.lcclass) { %><%=val.lcclass%><% } %> <% if(val.selected) { %><%=val.selected%><% } %>" data-date="<%=val.date%>"><span><%=val.Day%></span></li><% }); %>',
    navBar : '<li data-move="prev"  class="lc-arrow lc-arrow-prev"><<</li><li class="lc-currDate"><%=date%></li><li data-move="next" class="lc-arrow lc-arrow-next lc-lastUnit">>></li>',
    cal : '<div id="lc-<%=instID%>" class="lowCal"><div class="lc-inner"><div class="lc-hd"><ul class="lc-navBar lc-line"><%=navBar%></ul><ul class="lc-days lc-line"><li>Mo</li><li>Tu</li><li>We</li><li>Th</li><li>Fr</li><li>Sa</li><li class="lc-lastUnit">Su</li></ul></div><div class="bd"><ol class="lc-dates lc-line"><%=days%></ol></div></div></div><style type="text/css">.lc-hide{position:absolute;top:-1000px;left:-1000px;}.lowCal{font :13px/1.54 Helvetica,"Helvetica Neue",Arial,sans-serif;}.lc-bd,.lc-hd{display:inline-block;width:100%;zoom:1;vertical-align:top;}.lc-inner{position:relative;}.lc-inner:after,.lc-lastUnit:after,.lc-line:after{clear:both;display:block;visibility:hidden;overflow:hidden;height:0!important;line-height:0;font-size:xx-large;content:" x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x "}.lc-line{*zoom:1;margin:0}.lc-lastUnit{display:table-cell;float:none;width:auto;_position:relative;_left:-2px;_margin-right:-3px;}.lc-days{overflow:hidden;text-align:center;}.lowCal li,.lowCal ol,.lowCal ul{list-style:none;}.lc-dates{overflow:hidden;*zoom:1;}.lc-currDate{text-align:center;font-weight:bold;}.lc-navBar .lc-arrow-prev{float:left;width :13%}.lc-navBar .lc-currDate{float:left;width:75%}.lc-days li,.lc-date{float:left;width:14.29%;}.lc-date span{float:none;display:block;text-align:right;padding:2px;margin-left:4px;margin-bottom:2px;margin-right:0;cursor:pointer;}.lc-other-month span{cursor:not-allowed;}.lc-hide{position:absolute;top:-1000px;left:-1000px;}.lc-date .lc-lastUnit{float:none;width:auto;}</style>'
  };
  
  $.Cal.settings = {
    currentDate: {},
    currentPos : 0,
    instID : new Date().getTime(),
    selectedDate : null,
    format : 'dd/mm/yyyy',
    m_names :  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    templates : null,
    selectedClass : 'lc-selected'
  };
  
  // ## Prototype stuff
  // The meat of the plugin.
  
  $.Cal.prototype = {

      // _init fires when instance is first created
      // and when instance is triggered again -> $el.lowCal();
      _init : function( callback ) {
        var $opt = this.options;
        $opt.format = $opt.format.split('/');
        $opt.currentDate = this._setDate( this.el.val() ? this.el.val() : new Date() );
        
        this._uiInit();
      },
      
      
      //
      _create: function( options ){
        this.options = $.extend( true, {}, $.Cal.settings, options );
        this.cache = this._initCache();
        // setUp events 
        this._events();
        
        // Allow for custom templates
        this.options.templates = $.extend( true, {}, $.Cal.templates,  this.options.templates );          
      },
      
      _initCache : function () {
        return {
          date : {},
          template : {},
          prevDate : {}
        };
      },
      
      //## option
      // set options AFTER initialization:
      option: function( key, value ){
        if ( $.isPlainObject( key ) ){
          this.options = $.extend(true, this.options, key);
          this.options.templates = $.extend( true, {}, $.Cal.templates,  this.options.templates );
        } 
      },
      
      // ## Event handling  
      
      // ### delegateEvents
      // 
      _events : function () {
        var that = this;
        this.el.bind({
            'changeMonth.lowCal'  : function( event , d ){
              that.updateCalendar( that._changeMonth( d ) );
            },
            'setNewDate.lowCal' : function( event , d ){
              that._setInputDate( d.date );
              that._changeSelected( d.el );
              log(['setnewdate', d.date ]);
            }
          });
      },
      
      
      // ## UI Functions  
      
      // ### _uiInit  
      // Set up the UI
      
      _uiInit : function () {
        // initalise the main templates
        var calendar = this._initCal(), 
            that = this;
        // Wrap the input 
        this.el.wrap('<div id="lc-wrap-'+this.options.instID+'" />');
        this.el.hide().after( calendar );
        
        this.cal = $('#lc-'+this.options.instID);
        this.calBody = $(this.cal).find('.lc-dates');
        this.calMonth = $(this.cal).find('.lc-currDate');
        // Now the calendar is built lets attach the events
        this._uiInteractions();
      },
      
      // ### _uiInteractions  
      // A controller of the simple interactions of lowCal
      _uiInteractions : function () {
        var that = this;
        // Move calendar when arrow is clicked on
        this.cal.delegate(".lc-arrow", "click" , function() { that.el.trigger( 'changeMonth.lowCal' , $(this).data('move') ); });
        // Handle the user selections
        this.cal.delegate('.lc-day-active', "click" , function() { that.el.trigger( 'setNewDate.lowCal' , { date : $(this).data('date') , el : this }); });
      },
      
      updateCalendar : function ( date ) {
        var opts = this.options;
        
        this.calMonth.text( opts.m_names[ opts.currentDate.Month - 1 ] + ' ' + opts.currentDate.Year );
        return ( $.type( date ) === 'object' ) ? this.calBody.html(this._makeCalMonthTemplate()) : this.calBody.html(date);  
      },
      
      _changeSelected : function ( el ) {
        this.calBody.children('li').removeClass(this.options.selectedClass);
        $( el ).addClass(this.options.selectedClass);
      },
      
      // ## Date functions
      
      // ### _setDate()  
      // Helper function to set the current date
      _setDate: function ( d ) {
        var cd = {};
        if ( typeof d === 'string' ) {
          cd = this._splitDateString( d );
          log([ 'cd' , cd ]);
        }
        else {
          cd.Day = d.Day || d.getDate();
          cd.Month = d.Month || d.getMonth() + 1;
          cd.Year = d.Year || d.getFullYear();
        }
        
        cd.daysInMonth = this._daysInMonth( cd.Month , cd.Year );
        cd.monthBegins = this._dayMonthBegins( cd.Month , cd.Year );
        
        this._updateCurrentDate( cd );
        // cache test result and if we get a win we return the result
        var cr = this._checkCache( 'date' , d );
        if( cr )
          return (this.sameMonth( cd )) ? this._removeSelected( cr ) : cr ;
          
        return this._addToCache( 'date' , cd , cd );
      },
      
      // ### updateCurrentDate
      // update current date and set previous one to cache
      _updateCurrentDate : function ( cd ) {
        this.cache.prevDate = this.options.currentDate;
        return (this.options.currentDate = cd);
      },
      
      sameMonth : function ( cd ) {
        var pd = this.cache.prevDate;
        return ( pd.Year === cd.Year && pd.Month === cd.Month ) ? true : false;
      },
      
      // ### _setInputDate  
      // Change the value of the input
      _setInputDate : function ( date ) {
        this.el.val( date );
      },
      
      
      // ### _splitDateString   
      // Split the date string into a usable object       
      _splitDateString : function ( dateString ) {
        var d = {},
            dateArray = dateString.split('/'); 
        $.map( this.options.format , function(item, index) {
          switch (item) {
            case 'd' : 
            case 'dd' : 
              d.Day = dateArray[index];
              break;
            case 'm' : 
            case 'mm' : 
              d.Month = dateArray[index];
              break;
            case 'y' : 
            case 'yy' : 
            case 'yyyy' : 
              d.Year = dateArray[index];
              break;
          }
        });
        return d;
      },
      
      
      // ### _dayMonthBegins  
      // We find out when the month starts so that it
      // can be laid out in the calendar format 
      _dayMonthBegins : function ( month, year ) {
        return new Date( year,  month - 1 , 1).getDay();
      },
      
      // ### _daysInMonth
      // How many days are in the month
      _changeMonth : function ( move ) {
        var cd = this.options.currentDate,
            month = ( move === 'next' ) ? parseInt(cd.Month , 10) + 1: parseInt(cd.Month , 10) - 1,
            year = cd.Year;
        if ( move === 'prev' && month === 0 ) {
          year--;
          month = 12;
        }
        else if ( move === 'next' && month === 13 ) {
          year++;
          month = 1;
        }
        return this._setDate( { Day : "0" , Month : month , Year : year  } );
      },
      
      // ### _daysInMonth
      // How many days are in the month
      _daysInMonth : function ( month, year ) {
        return 32 - new Date(year, parseInt(month , 10) - 1 , 32).getDate() ;
      },
      
      
      // ### getCurrentDate
      // Returns the Current dates in prefered format
      getCurrentDate : function () {
        return this._formatDate( this.options.currentDate );
      },
      
      _formatDate : function ( dateObj ) {
        return dateObj.Day + "/" + dateObj.Month + "/" + dateObj.Year;
      },
      
      // ## Caching functions
      
      // ### _addToCache   
      // Add item to cache  
      // @param {string} store name of the store
      // @param {obj} date date object
      _addToCache : function ( store , dateObj , storeObj ) {
        if ( !this.cache[store] ) { logError('No store called ' + store); return false;}
        if(!this.cache[store][ dateObj.Year ]) this.cache[store][ dateObj.Year ] = {};
        return (this.cache[store][ dateObj.Year ][ dateObj.Month ] = storeObj);
      },
      
      // ### _checkCache
      // query the cache for a previously made object  
      // @param {string} store name of the store  
      // @param {obj} date date object  
      _checkCache : function ( store ,  dateObj ) {
        if ( !this.cache[store] ) { logError('No store called ' + store); return false;}
        if (this.cache[store][ dateObj.Year ])
          return this.cache[store][ dateObj.Year ][ dateObj.Month ] ? this.cache[store][ dateObj.Year ][ dateObj.Month ] : false;
        return false;
      },
      
      
      // ## Calendar UI
      
      // ## _initCal
      // Inital loading of the calendar. Load in 
      // structure and CSS of template AND currentDate
      _initCal : function () {
        var tmpls = this.options.templates,
            uiObj = {};

        uiObj = {
          navBar : this._buildNavBar(),
          instID : this.options.instID,
          days : this._buildCalDays()
          };

        return this._tmpl( tmpls.cal , uiObj );
      },
      
      // ### Build nav bar 
      _buildNavBar : function( ) {
        var opts = this.options,
            o = { 'date' : opts.m_names[ parseInt( opts.currentDate.Month , 10) - 1 ] + ' ' + opts.currentDate.Year };
       return this._tmpl( this.options.templates.navBar , o );
      },
      
      // ### _buildCalDays  
      // Get cal days from cache or by building the obj
      
      _buildCalDays : function () {
        return this._getCalMonthTemplate();
      },
      
      _getCalMonthTemplate : function () {
        var query = this._checkCache( 'template' , this.options.currentDate );
        if( query )
          return query;
        return this._makeCalMonthTemplate();
      },
      
      _makeCalMonthTemplate : function () {
        var daysObj = this._makeCalMonthObject(),
            template = "",
            that = this;
        
        $.each(daysObj, function(index, val) { 
          template += that._tmpl( that.options.templates.days , { days : daysObj[index] });
        });

        return this._addToCache( 'date' , this.options.currentDate , template );
      },

      
      _makeCalMonthObject : function () {
        var cd = this.options.currentDate,
            cal = {},
            blankCells = (cd.monthBegins === 0 ) ? 6 : cd.monthBegins - 1,
            cellCount = blankCells + cd.daysInMonth,
            totalCells = Math.ceil ( cellCount / 7 ) * 7,
            postBlankCells = totalCells - cellCount,
            count = 1;

        cal.pre_blank = {};
        for ( var i = 0; i < blankCells; i++ ) {
          cal.pre_blank[ i+1 ] = { Day : "&nbsp;", lcclass : ( count % 7 === 0 ) ? "lc-other-month lc-lastUnit" : "lc-other-month" };
          count++;
        }
        
        cal.days = {};
        for ( i = 0; i < cd.daysInMonth; i++ ) {
          cal.days[ i+1 ] = { date : this._formatDate( { Day : i+1,  Month :  cd.Month , Year : cd.Year }) , Day : i+1 , lcclass : ( count % 7 === 0 ) ? "lc-day-active lc-lastUnit" : "lc-day-active" , selected : ((i+1) === parseInt(cd.Day , 10)) ? this.options.selectedClass : false };
          count++;
        }
        
        cal.post_blank = {};
        for ( i = 0; i < postBlankCells; i++ ) {
          cal.post_blank[ i+1 ] = { Day : i+1, lcclass : ( count % 7 === 0 ) ? "lc-other-month lc-lastUnit" : "lc-other-month" };
          count++;
        }
        
        return cal;
      },
      
      _removeSelected : function ( tmpl ) {
        return tmpl.replace( this.options.selectedClass , '' );
      }, 
      
      // ## John Resig's Micro-Templating
      // A clean way to keep my templates tidy. 
      //
      // @see http://ejohn.org/blog/javascript-micro-templating/
      _tmpl : function ( str , data ) {
        var fn = new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +
            // Convert the template into pure JavaScript
            str
              .replace(/[\r\t\n]/g, " ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .split("\t").join("');")
              .split("%>").join("p.push('")
              .split("\r").join("\\'")
          + "');}return p.join('');");
        
        // Provide some basic currying to the user
        return fn( data );
      }
      
  }; 
  
 
 
  // ### Logger functions
  // 
  // Make the console safe.
  //
  var logError = function( message ) {
	  if ( this.debug ){
	    if ( this.debugStrict ) {
	    throw message;
	    }
      else if ( this.console ) {
        console.error( message );
      }
    }
  };

  var log = function( message ) {
    if(this.debug)
      if( this.console ) console.log( message );
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