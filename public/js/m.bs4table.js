
(function($) {
	
    $.fn.bs4table = function( options ) {
 
 		// exposed properties and methods
        var api = {}; 
		
		// set defaults for this module
        var defaults = { 
		
			// originally received data from server
			data: {},
			
			// jquery container element for the control
			ctrlelem: null,
 
			// control type
			ctrltype: '',
 
			// data for the control
			ctrldata: {}, 
			
			// disable state of the element
            disabled: false,
			
			// visibility state of the element					
            visible: true,  
			 												
        };
 
 		// extend the defaults with the options
        var settings = $.extend( true, {}, defaults, options );	

        // inizialize settings array
        var init = function() {

			// copy data to base settings
			settings = $.extend(true, {}, settings, settings.data );

			// build the control
			build(); 
 
        };
 
 		// build the control
		var build = function() { 

			// empty the container element
			settings.ctrlelem.empty();

			// if table is visible
			if(settings.visible) {
			
				// create table sub container
				$table = $('<table></table>');
				
				// create flexible table width
				$table.attr('width', '100%');
				
				// add class to draw cell borders
				$table.addClass('cell-border');
				
				if(settings.ctrldata.hasOwnProperty('caption') && settings.ctrldata.caption.hasOwnProperty('title')) {
					
					// create table caption
					$title = $('<p></p>');
					$title.addClass('table-title');
					
					// set text for caption
					$title.text(settings.ctrldata.caption.title);
		
					// append title to table
					settings.ctrlelem.append($title);
					
				}
				
				if(settings.ctrldata.hasOwnProperty('caption') && settings.ctrldata.caption.hasOwnProperty('subtitle')) {
			
					// create table subtitle
					$subtitle = $('<p></p>');
					$subtitle.addClass('table-subtitle');
					
					// set text for caption
					$subtitle.text(settings.ctrldata.caption.subtitle);			
					
					// append title to table
					settings.ctrlelem.append($subtitle); 	
				}

				// append sub container to main container element
				settings.ctrlelem.append($table);
				
				// create datatables under main sub container element
				settings.ctrlelem.find('table').DataTable(settings.ctrldata); 
			}
		};

		// update the control
        api.update = function(data) {
 
			// update settings with new data
			settings = $.extend(true, {}, settings, data );
 
 			// rebuild the control
			build(); 
			
        };
 
 		// execute the init function (contructor)
        init();	
		
		// export the public variables and methods
        return api;	
		
    };
	
})($);
