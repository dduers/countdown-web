/*
 * jQuery plugin bootstrap 4 dropdown
 * Author: dani d
 */

(function($) {
    $.fn.bs4rangeslider = function( options ) {
 
        // spot the public variables and methods
        var api = {};

        //set defaults for this module
        var defaults = {
            
			// originally received data from server
			data: {},
			
			// jquery container element for the control
			ctrlelem: null,
 
			// name of the parameter under which the value is sent to server
			ctrlname: '',
 
			// control type
			ctrltype: '',
 
			// visibility state 
            visible: true,
			
			// tooltip
			tooltip: '',
 
			// on change event
            onChange: $.noop,

			// data for the control
			ctrldata: {
				
				// disable the control
				disable: false,
					
				// slider type single or double
				type: 'single',
				
				// haging a grid true or false
				grid: false,
						
				// minimum value in the range
				min: 0,
				
				// maximum value in the range
				max: 100,
				
				// chosen range starting point or single point when slidertype = single
				from: 10,
				
				// chosen range end point, when slidertype = double
				to: 20,
				
				// hide min and max values on the slider
				hide_min_max: false,
				
				// hide from and to values on the slider
				hide_from_to: false,
	 
				// the steps from one value to another
				step: 1,
				
				// prefix all values with
				prefix: '',
				
				// postfix all values with
				postfix: '',
				
				// postfix the maximum value
				max_postfix: '',
				
				// use postfix on both from and to value when slidertype=double
				decorate_both: true,
				
				// value separator used when from and to value are nearby on a double slider
				values_separator: ' - ',
				
				// lock selection to these values
				values: [],
	
				// format large numbers with thousands spaces
				prettify_enabled: true,
				
				// format character for thousands spaces
				prettify_separator: "'",
				
				// fix some of the sliders
				from_fixed: false,
				
				// from slider limitations
				from_min: false,
				from_max: false,
				
				// shadow from limitation
				from_shadow: true,

				// fix some of the sliders
				to_fixed: false,
				
				// to slider limitations 
				to_min: false,
				to_max: false,	
				
				// shadow to limitation
				to_shadow: true,
				
				// slide with keyboard arrow keys when focused
				keyboard: true,
				
				// min and maximum ranges
				min_interval: false,
				max_interval: false,
				
				// draging when interval is reached
				drag_interval: false,
				
				// callbacks
				onStart: null,
				onChange: null,
				onFinish: null,
				onUpdate: null,
 	
			}, 	
        };
 
        //extend the defaults with the options
        var settings = $.extend(true, {}, defaults, options );
 
        // inizialize settings array
        var init = function() {
			
			// move some options to fit with thirdparty control
			settings.data.ctrldata.onFinish = function(data) {
				//console.log(data, settings.ctrldata);
				//if(!(data.to == settings.ctrldata.to && data.from == settings.ctrldata.from))
					settings.onChange();
			};
			
			// update data on slider change
			settings.data.ctrldata.onChange = change;
 
			// copy data to base settings
			settings = $.extend(true, {}, settings, settings.data );

			// build the control
			build(); 
 
        };

        // build the control
        var build = function() {
			
			// clear the container element
            settings.ctrlelem.empty();
 
			// when control is set visible
            if(settings.visible) {
				
				// append control markup and events to the container
				settings.ctrlelem.ionRangeSlider(settings.ctrldata); 
				
            } 
 
        };
		
		var change = function(data) {
			
			//console.log('change!');
			
			// settings.ctrldata = $.extend(true, {}, settings.ctrldata, data );
			
			settings.ctrldata.from = data.from;
			settings.ctrldata.to = data.to;
			
		};
		
		
		// get chosen value
		api.value = function() {

			return({
				// min: data.min,
				// max: data.max,
				from: settings.ctrldata.from,
				to: settings.ctrldata.to,
			}); 
		};
		
		api.ctrlname = function() {
			//alert(settings.ctrlname);
			return(settings.ctrlname); 
		};

        // update the control
        api.update = function(data) { 
 
			// update settings with new data
			settings = $.extend(true, {}, settings, data );
 
			// if control is flagged visible
			if(settings.visible) {

				// pass control data to thirdparty module
				settings.ctrlelem.data("ionRangeSlider").update(settings.ctrldata);
			
			// if control is no visible
			} else {

				// destroy range slider
				if(settings.ctrlelem.data("ionRangeSlider")) {
					settings.ctrlelem.data("ionRangeSlider").destroy();
				}
			} 
	
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

