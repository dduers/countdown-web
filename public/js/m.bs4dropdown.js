/*
 * jQuery plugin bootstrap 4 dropdown
 * Author: dani d
 */

(function($) {
    $.fn.bs4dropdown = function( options ) {
 
        // spot the public variables and methods
        var api = {};

        //set defaults for this module
        var defaults = {
            
			// originally received data
			data: {},
			
			// jquery container element for the control
			ctrlelem: null,
 
			// name of the parameter sent to the server
			ctrlname: '',
						
			// control type
			ctrltype: '',
						
			// dropdown options
            options : {},			
			
			// chosen option's value
            chosen : '',
 
			// disable state of the control
            disabled : false,
			
			// readonly state of the control
			readonly : false,
			
			// visibility state 
            visible : true,
			
			//tooltip
			tooltip: '',
 
			// on change event
            onChange : $.noop,
			
			// classes for control element
            class : 'btn-group',
			
			// placeholder, if no value chosen
			placeholder: 'Please select', 
				
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

        // creating markup and event listeners for the control
        var create = function() {
			
			var $e = $( '<div></div>' );
			
            $e.attr('class', settings.class);
			$e.attr('title', settings.tooltip);
			
			// position of tooltip
			$e.attr('data-placement', 'top');
			
			if(settings.disabled) { 
				$e.addClass('disabled');
			}	
			
			// create dropdown button
			var $button = $('<a></a>');
			$button.attr('class', 'btn dropdown-toggle text-left'); 
			$button.attr('data-toggle', 'dropdown');

            if(settings.disabled) {
                $button.addClass('disabled');
            }
 
			// set place holder as a default
			$button.text(settings.placeholder);

			// create dropdown menu container
			var $ul = $('<ul></ul>');
			$ul.addClass('dropdown-menu');
 
 			// add options to dropdown menu
            $.each( settings.options, function( k, v ) {
                
				// create otion object
				var $li = $( '<li></li>' );
				$li.addClass('dropdown-item');
				
				var $a = $('<a></a>');
				//$a.attr('href', ''); 
				$a.attr('data-value', k);
				$a.text(v);

				// value is currently chosen
                if(k == settings.chosen) { 
                    $li.addClass('active');  
					$button.html(v);
                }
				 
				// when clicking a dropdown option entry
				$a.click(function(){ 
				
					// if no new value was chosen
					if(settings.chosen == $(this).attr('data-value')) {
					
						// return with no action
						return false;  
					}
				
					// remove current active dropdown-item
					$('#' + settings.ctrlelem.attr('id') + ' ul.dropdown-menu li.active').removeClass('active');
					
					// add active class to clicked dropdown-item
					$(this).parent('li.dropdown-item').addClass('active');
 
 					// set the new text to the dropdown menu box
			  		$(this).parents('.btn-group').find('.dropdown-toggle').html($(this).text() + ' <span class="caret"></span>');
					
					// set new chosen value
					settings.chosen = $(this).attr('data-value');
 
					// if a valid onchange funtion is found in the settings
					if($.isFunction(settings.onChange)) {
					
						// run the change event
						settings.onChange(); 
					}
				});
 
 				// append text to dropdown-item
				$li.append($a);
 
				// append option to dropdown element
                $ul.append( $li ); 	
            });
			
			
			// append button to dropdown
			$e.append($button);
			
			// append dropdown control
			$e.append( $ul );
			
			// render tooltips 
			$e.tooltip({
				trigger : 'hover'
			});  
			
			// fix persistent tooltips
			$e.on('click', function () {
				$(this).tooltip('hide')
			});
 
		 	// return element
            return $e;
			
        };

        // build the control
        var build = function() {
			
			// clear the container element
            settings.ctrlelem.empty();
			
			// when control is set visible
            if(settings.visible) {
				
				// append control markup and events to the container
                settings.ctrlelem.append(create());
 
				
            } 
 
        };
 
		// get chosen value
		api.value = function() {
			return(settings.chosen); 
		};
		
		api.ctrlname = function() {
			return(settings.ctrlname); 
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
