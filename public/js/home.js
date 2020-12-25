/* ---------------------------------------------------------
    STATISTICS CONTROLLER
--------------------------------------------------------- */
(function($) {
	
	// page controller
	$.fn.controller = function() {

		var api = {};

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
		};

		// init the controller
		init();
		
		// for public functions and vars
		return api;
	};
	
})($);
