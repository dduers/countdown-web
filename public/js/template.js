/* ---------------------------------------------------------
	helper functions, global
--------------------------------------------------------- */

// launch the custom page controller
jQuery(document).ready(function ($) {

	// if a controller is found for current page
	if ($.isFunction($.fn.controller)) {

		// launch the controller
		var ctrl = $.fn.controller();
	}
});
