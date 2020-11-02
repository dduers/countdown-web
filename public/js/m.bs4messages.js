/*
 * jQuery plugin bootstrap 4 alerts
 * Author: dani d
 */

(function($) {
    $.fn.bs4messages = function( options ) {
 
        // spot the public variables and methods
        var api = {};

        //set defaults for this module
        var defaults = {
            
			// originally received data
			data: {},
			
			// jquery container element for the control
			ctrlelem: null,
 
			// control type
			ctrltype: '',
		
			// the alert array
            options : {},			

			// on change event
            onChange : $.noop,
        };
 
        //extend the defaults with the options
        var settings = $.extend(true, {}, defaults, options );
 
        // inizialize settings array
        var init = function() {

			// copy data to base settings
			settings = $.extend(true, {}, settings, settings.data );

			// build the control
			build(); 
        };

        // creating markup
        var create = function() {
			
			var $div = $( '<div></div>' );
			
			// for ever message in options
            $.each( settings.options, function( k, v ) {

				// set deafult dismissible parameter
				if(typeof v.dismissible === 'undefined'){
					v.dismissible = true;
				}

				var $e = $( '<div></div>' );
				$e.attr('role', 'alert'); 
				$e.addClass('alert');
				$e.addClass('alert-' + v.type); 

				// make alert dismissable
				if(v.dismissible === true) {
					$e.addClass('alert-dismissible');
					$e.addClass('fade');
					$e.addClass('show');
				}

				$e.html(v.text);
				
				var $button = $( '<button></button>' );
				$button.attr('type', 'button');
				$button.attr('class', 'close');
				$button.attr('data-dismiss', 'alert');
				$button.attr('aria-label', 'Close');
				
				var $span = $( '<span></span>' );
				$span.attr('aria-hidden', 'true');
				$span.html('&times;');
				
				// make alert dismissable
				if(v.dismissible === true) {
					$button.append($span); 
					$e.append($button); 
				}

 				$div.append($e);
            });

		 	// return element
            return $div;
        };

        // build the control
        var build = function() {
			
			// clear the container element
            settings.ctrlelem.empty();

			// append messages to element
			settings.ctrlelem.append(create());
        };

        // update the created module
        api.update = function(data) { 
		
			// update settings with new data
			settings = $.extend(true, {}, settings, data );
			
			// rebuild the control
			build();
        };

        // destroy the module
        api.destroy = function() { 
        };

        // execute the init function
        init();

        // export the public variables and methods
        return api;
    };
	
})($);
