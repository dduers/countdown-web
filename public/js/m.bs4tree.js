/*
 * jQuery plugin bootstrap 4 dropdown
 * Author: dani d
 */

(function($) {
	
    $.fn.bs4tree = function( options ) {
 
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
 
			// data for the control
			ctrldata: {}, 
			 
			// visibility state 
            visible: true,
			
			// disable state of the control
			disabled : false,
			
			// deny parents to be chooseable
			disableparents: false,
			
			// collapsed state
			collapsed: true,
			
			// tooltip
			tooltip: '',
			
			// the chosen element's value
			chosen: '',

			// animation speed in ms
			animationspeed: 0,
 
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
		
 		// create content element (recursive)
		var create = function(data) {
 
 			// when recurse is done, data is set as parameter, otherwise use settings.ctrldata
			var ctrldata = data ? data : settings.ctrldata; 
 			
			// create ul container element
			var $e = $('<ul></ul>'); 
			
			// add classes to container element
			$e.addClass('nav');
			$e.addClass('nav-list');
			
			// if a recursion is going on, add the tree class
			if(data)
				$e.addClass('tree');
 
 
	 		// for every element in the ctrldata json
			$.each(ctrldata, function(k,v) {

				// create a li element
				var $li = $('<li></li>');
 
				// create html anchor
				$a = $('<a></a>');
				$a.attr('href','#'); 
				
				// set data value 
				$a.attr('data-value', k); 
				
				// ad active class to chosen link
				if(k == settings.chosen)
					$a.addClass('active'); 
				
				// set text for anchor
				$a.html(v.name); 
				
				// set click function to anchor
				$a.click(function(e) {
					
					// prevent default click action
					e.preventDefault();
					
					// if its a parent entry and parents are click denied
					if(v.hasOwnProperty('data') && settings.disableparents)
						return true;

					// if no new value was selected, or selected entry is already active or disabled
					if(settings.chosen == $(this).attr('data-value') 
						|| $(this).hasClass('active') 
						|| $(this).hasClass('disabled')) {
					
						// return with no action
						return false;  
					}
										
					// set new chosen value
					settings.chosen = $(this).attr('data-value');

					// remove active class from previously selected
					$(this).parent('.nav.nav-list').find('.active').removeClass('active');
												
					// add active class to clicked anchor
					$(this).addClass('active');
					
					// uncollapse label of sub achor / TODO: does not work
					// $(this).parent().parent().parent().find('label').click(); 
 
					// if a valid onchange funtion is found in the settings
					if($.isFunction(settings.onChange)) {
					
						// run the change event
						settings.onChange(); 
					}
					
				});

									
				// if value has no children ...
				if(!v.hasOwnProperty('data')) {
					
					// append anchor to li element
					$li.append($a); 

				// if value has children
				} else {

					var $label = $('<label></label>');
					
					// class according to collaped state
					if(settings.collapsed)
						$label.addClass('opened');
					else $label.addClass('closed');
					
					$label.addClass('tree-toggler');
					$label.addClass('nav-header'); 
 
					$label.append($a); 
					
					// append click function to label
					$label.click(function(e) {
						
						// toggle with animation
						$(this).parent().children('ul.tree').toggle(settings.animationspeed); 
						if($(this).hasClass('closed')) {
							$(this).addClass('opened');
							$(this).removeClass('closed');
						} else if($(this).hasClass('opened')) {
							$(this).removeClass('opened');
							$(this).addClass('closed');
						} 
					});
		 
					$li.append($label);  			
					$li.append(create(v.data)); 
				} 
 
				$e.append($li);
			});   

 			// collapse on labels if collapsed state is set
			if(settings.collapsed) {
				$e.find('label.tree-toggler').click();
			}

			// position of tooltip / TODO: Buggy ...
			//$e.attr('title', settings.tooltip); 
			//$e.attr('data-placement', 'top');
			//$e.tooltip({
			//	trigger : 'hover'
			//});
							
			// return created element
			return($e); 
		};

        // build the control
        var build = function() {
 
			// clear the container element
            settings.ctrlelem.empty(); 
			
			// create the content element, if visible is set true
			if(settings.visible)
				settings.ctrlelem.append(create());
 
			// uncollapse parent label of active child
			//settings.ctrlelem.find('.active').parent('li').parent('ul').parent('li').find('label').click(); 
			var $label = settings.ctrlelem.find('.active').parent('li').parent('ul').parent('li').find('label');

			// toggle without animation (0ms)
			$label.parent().children('ul.tree').toggle(0); 
			if($label.hasClass('closed')) {
				$label.addClass('opened');
				$label.removeClass('closed');
			} else if($label.hasClass('opened')) {
				$label.removeClass('opened');
				$label.addClass('closed');
			}  
        };
 
		// get chosen value
		api.value = function() {

			return(settings.chosen);
		};
		
		api.ctrlname = function() {
			//alert(settings.ctrlname);
			return(settings.ctrlname); 
		};

        // update the control
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
