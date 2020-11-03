/* ---------------------------------------------------------
    STATISTICS CONTROLLER
--------------------------------------------------------- */
(function($) {
	
	// page controller
	$.fn.controller = function(options, callback) {
 
		var defaults = {  
			interval: 1000,	 
		};
		
		var api = {}; 
		var settings = $.extend(true, {}, defaults, options);

		var countdownDate;
	 
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
				success: function(data) {  
					countdownDate = new Date(data.date).getTime();
					updateTime();
				}, 
			});
		};
	 
		setInterval(updateTime, settings.interval);
	
		init();  
		return api; 
	};

})($);
