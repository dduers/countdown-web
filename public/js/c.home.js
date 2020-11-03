/* ---------------------------------------------------------
    STATISTICS CONTROLLER
--------------------------------------------------------- */
(function($) {
	
	// page controller
	$.fn.controller = function(options, callback) {
		
		// for public functions and vars
		var api = {};
		
		// default settings
		var defaults = {};
		
		// storage for control object instances
		var controls = {};
		
		// loading overlay
		var $overlay = $('<div id="overlay"></div>');
 
		// initialize controls with server default values
		var init = function() {

			// init date picker
			$('input[name="date"]').flatpickr({ 
				enableTime: true,
				dateFormat: "Y-m-d H:i",
				//altInput: true,
				//altFormat: "j. F Y H:i",
				minuteIncrement: 1,
				defaultHour: 0,
				defaultMinute: 0,
				/*maxDate: 
					new Date(data.data.project[0].date_end) < new Date() 
					? new Date(data.data.project[0].date_end) 
					: (
						new Date(data.data.project[0].date_end) > new Date() 
						? new Date(data.data.project[0].date_end) 
						: new Date()
					),*/
				minDate: new Date(),
				time_24hr: true,
				enableSeconds: false,
				//locale: 'en',
			});
		
			
			// query to server for initialization
			$.ajax({ 
			  
				// use current location
				url: window.location.href,
					
				// send a get request
				type: 'GET',

				// build controls
				success: build,
				
				// overlay activate and remove
				beforeSend: function() { 
					$overlay.appendTo(document.body)
				}, 
				complete: function() {
					$($overlay).remove();
				}, 
				error: function(xhr, status, error) {
					alert('Error: ' + xhr.status); 
					$($overlay).remove();
				},
			}); 
		};
 
		// build the markup and events for all controls
		var build = function(data) {
 
			// for every control block in data
			$.each(data.controls, function(k,v) {
 
				// data to pass to control modules
				var ctrldata = {
					
					// data to build the control
					data: v, 
					
					// control container element
					ctrlelem: $('#' + k),
					
					// onchange callback to attach to control
					onChange: query,
						 
				};

				// create the module instance
				if($.isFunction('$.fn.' + v.ctrltype.toLowerCase()));
					eval('controls[k] = $.fn.' + v.ctrltype.toLowerCase() + '(ctrldata);');
			});	 
			
			// initially replace the state, when get parameters are not already in url
			/* if(getQueryVariable('tt') === false)
				createState(true); */ 
		};
		
		// create a browser history state and create parameter value array from controls
		var createState = function(replace) {
			
			// array to store parameters for the query request
			var p = {};
 
			// get parameter name and value from every control
			$.each(controls, function(k,v) {
 
			 	// store control value under it's parameter name 
				// 	( only if control is emitting value )
				if($.isFunction(v.ctrlname) && $.isFunction(v.value)) {
				
					// create parameter list of contol values
					p[v.ctrlname()] = v.value(); 
				} 
			});	
			
			// create querystring from control values
			var q = $.param(p);
			
			// if state should be replaced
			if(replace === true) {
				
				// replace state
				window.history.replaceState( 
					{
						// set url property to state object
						url: window.location.href.split('?')[0] + '?' + q,
					}, 
					// this is the page title
					window.location.href.split('?')[0] + '?' + q,  
					// this is the state's perma link
					window.location.href.split('?')[0] + '?' + q 
				);

			// if a new state should be pushed
			} else {

				// push state to history stack
				window.history.pushState( 
					{
						// set url property to state object
						url: window.location.href.split('?')[0] + '?' + q,
					}, 
					// this is the page title
					window.location.href.split('?')[0] + '?' + q,  
					// this is the state's perma link
					window.location.href.split('?')[0] + '?' + q 
				);
			}

			// append new querystring to language selector anchors
			$('.nav-item.language .nav-link').each(function() { 
				$(this).attr('href', $(this).attr('href').split('?')[0] + '?' + q);
			});
			
			// return query parameters array
			return(p); 
		};
 
		// send query parameters to server
		var query = function() {
 
			// send ajax request to server
			$.ajax({
				
				// alway query to current route
				url: window.location.href,
				
				// send a get request
				type: 'GET',	
						
				// query parameters 
				data: createState(),
				
				// update the controls with new data
				success: update,
				
				// overlay activate and remove
				beforeSend: function() { 
					$overlay.appendTo(document.body)
				}, 
				complete: function() {
					$($overlay).remove();
				}, 
				error: function(xhr, status, error) {
					alert('Error: ' + xhr.status); 
					$($overlay).remove();
				},
			}); 
		};
 
		// update all controls after query to server
		var update = function(data) {
 
 			// remove unused controls and rebuild controls array
			build(data);

			// loop through update controls data from server
			$.each(data.controls, function(k,v) {
 
				// put all received updates to the controls
				controls[k].update(v);
			});
		};
		
		// init the controller
		init();
		
		// for public functions and vars
		return api;
	};

	/**
	 * the count down
	 * @param {*} options 
	 */
	$.fn.countdown = function(options) {
 
		var defaults = { 
			
			container: $('body'),
			interval: 1000,	 
		};
		
		var api = {}; 
		var settings = $.extend(true, {}, defaults, options);

		var countdownDate = new Date("Jan 5, 2021 15:37:25").getTime();
	 
		var init = function() {
			build(); 
		};

		/**
		 * update the time
		 */
		var updateTime = function() {

			// Get today's date and time
			var now = new Date().getTime();
		  
			// Find the distance between now and the count down date
			var distance = countdownDate - now;
		  
			// Time calculations for days, hours, minutes and seconds
			var days = Math.floor(distance / (1000 * 60 * 60 * 24));
			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		  
			// display the result in the element with id="demo"
			$('.card-header').html(days + ' days ' + hours + ' hours ' + minutes + ' minutes ' + seconds + ' seconds ');
		  
			// If the count down is finished, write some text
			if (distance < 0) {
			  	clearInterval(updateTime);
			  	$('.card-header').html('EXPIRED');
			}
		};
		
		var build = function() {
			$.ajax({ 
				url: window.location.href, 
				//context: settings.container, 
				success: function(data) { 
					console.log(data);
					countdownDate = new Date(data.date).getTime();
					//$('.card-header').html(data.date); 
					$('.card-title').html(data.title); 
					$('.card-text').html(data.description); 
				}, 
			});
		};
	 
		setInterval(updateTime, settings.interval);
	
		init();  
		return api; 
	};
	
})($);
