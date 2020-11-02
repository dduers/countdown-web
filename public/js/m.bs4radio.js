/*
 * jQuery plugin bootstrap 4 dropdown
 * Author: dani d
 */

(function($) {
    $.fn.bs4radio = function( options ) {
 
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
 
			// name of the parameter sent to the server
			ctrlname: '',
						
			// select options
            options : {},			
			
			// init selected option
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
			
			// select classes for element, that will be attached to container (settings.elem)
            class : 'btn-group d-flex',
	
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
			$e.attr('role', 'group');
			$e.attr('title', settings.tooltip);
			$e.attr('data-toggle', 'buttons');
			
			// position of tooltip
			$e.attr('data-placement', 'top');

			
			if(settings.disabled) { 
				$e.addClass('disabled');
			}	
					
			
 
            $.each( settings.options, function( k, v ) {
                
				// create otion object
				var $label = $( '<button></button>' );
				$label.addClass('btn w-100');
				$label.attr('data-value', k);
 
				// value is currently chosen
                if(k == settings.chosen) { 
                    $label.addClass('active');  
                }
				
				// set disabled attribute to button if set in settings
				if(settings.disabled) { 
					$label.attr('disabled','disabled');
				}				
 
				// append text to label, if any
				if(v)
					$label.append(v);  
 
				// when clicking a dropdown select entry
				$label.click(function(){ 
				
 
					// HACK: hide buggy persistent tooltips
					$('[title=""]').tooltip('hide');
 
				
					// if no new value was selected
					if(settings.chosen == $(this).attr('data-value') 
						|| $(this).hasClass('active') 
						|| $(this).hasClass('disabled')) {
					
						// return with no action
						return false;  
					}
					
					$(this).parent().find('.btn.active').removeClass('active');
 
					// set new chosen value
					settings.chosen = $(this).attr('data-value');

					// if a valid onchange funtion is found in the settings
					if($.isFunction(settings.onChange)) {
					 
						// run the change event
						settings.onChange(); 
					}
					
				});	
 
				// append label to control
				$e.append( $label );
 
            });
 
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
			
			// set current chosen value to active 
			if(settings.chosen != null)
				$('#' + settings.ctrlelem.attr('id') + ' .btn[data-value="' + settings.chosen + '"]').addClass('active');
 
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
