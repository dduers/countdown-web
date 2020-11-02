/*
 * jQuery plugin bootstrap 4 geomap 
 * Author: dani d
 */

(function($) {
    $.fn.bs4geomap = function( options ) {
 
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
 
			// disable state of the control
            disabled : false,
 
			// visibility state 
			visible: true, 
			
			//tooltip
			tooltip: '',

			// map options
			options: {

				kmlurl: '',
				language: 'de',
				height: 700,
				width: 600,
				title: '',
				subtitle: '',
				controls: false,
			},
 
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

			var $div = $( '<div></div>' );

			// append title and subtitle
			$div.append('<p class="table-title">' + settings.options.title + '</p>');
			$div.append('<p class="table-subtitle">' + settings.options.subtitle + '</p>');
			
			// create input element
			var $e = $( '<iframe></iframe>' );

			// disable frameborder
			$e.attr('frameborder', 0);

			// allow fullscreen
			$e.attr('allowfullscreen', 'allowfullscreen');
			
			// iframe size
			$e.attr('height', settings.options.height);
			$e.attr('width', settings.options.width);

			// iframe source url
			$e.attr('src',
				"https://map.geo.admin.ch/"
				+ (settings.options.controls === true ? "" : "embed.html")
				+ "?topic=ech" 
				+ "&lang=" + settings.options.language
				//+ "&bgLayer=ch.swisstopo.swissimage"
				+ "&bgLayer=ch.swisstopo.pixelkarte-farbe"
				+ "&layers="
					+ "KML%7C%7C"
					+ settings.options.kmlurl 
				+ "&layers_visibility=true" 
				+ "&X=189031.44"
				+ "&Y=664722.71"
				+ "&zoom=1"
			);

			// position of tooltip
			$e.attr('data-placement', 'top');
 
			// render tooltips 
			$e.tooltip({
				trigger : 'hover'
			});  
			
			// fix persistent tooltips
			$e.on('click', function () {
				$(this).tooltip('hide')
			});

			$div.append($e);
 
		 	// return element
            return $div; 
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
