/*
 * jQuery plugin bootstrap 4 input
 * Author: dani d
 */

(function($) {
    $.fn.bs4input = function( options ) {
 
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
 
			// chosen option's value
			chosen: '',
			
			// text input type
			type: 'text',
 
			// disable state of the control
            disabled : false,
			
			// readonly state of the control
			readonly: false,
			
			// visibility state 
			visible: true, 
			
			//tooltip
			tooltip: '',
			
			// classes for control element
            class: 'form-input',
			
			// placeholder, if no value chosen
			placeholder: 'Please select', 
			
			// on change event
            onChange: $.noop,
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
			
			// create input element
			var $e = $( '<input></input>' );
			
			// add element class
			$e.attr('class', settings.class);
			
			// the tooltip
			$e.attr('title', settings.tooltip);

			// the tooltip
			$e.attr('type', settings.type);

			// set the currently chosen value
			$e.val(settings.chosen);

			// position of tooltip
			$e.attr('data-placement', 'top');
			
			// set disabled, if disabled
			if(settings.disabled) { 
				$e.attr('disabled', 'disabled');
			}	

			// set readonly, if readonly
			if(settings.readonly) {
				$e.attr('readonly', 'readonly');
			}

			// add placeholder
			$e.attr('placeholder', settings.placeholder);

			// render tooltips 
			$e.tooltip({
				trigger : 'hover'
			});  
			
			// fix persistent tooltips
			$e.on('click', function () {
				$(this).tooltip('hide')
			});

			// fix persistent tooltips
			$e.on('change', function () {

				// if a valid onchange funtion is found in the settings
				if($.isFunction(settings.onChange)) {

					settings.chosen = $(this).val();

					// run the change event
					settings.onChange(); 
				}

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
