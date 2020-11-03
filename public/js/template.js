/* ---------------------------------------------------------
    helper functions, global
--------------------------------------------------------- */

// launch the custom page controller
jQuery(document).ready(function($) {

	// listen to pop state events
	window.addEventListener('popstate', function(event) {
		
		// if there is a state available to pop
		if(event.state) {
			
			// similar behavior as an HTTP redirect
			window.location.replace(event.state.url);
			
			// similar behavior as clicking on a link
			// window.location.href = event.state.url;
		}
		
    }, false);

	/**
	 * disable submit buttons on click
	 */ 
	
    // all buttons with disable with text
    $("*[data-disable-with]").each(function() {
        
        // the button
        var t = $(this);

        // is html5 button flag
        var a = t.is("button");

        // the disable text to set
        var i = $(this).html(); //t.attr("data-disable-with");

        // value for input and html for button elements
        var n = "";
        n = a ? t.html() : t.val();
        
        // the form 
        var d = t.parents().filter("form").first();
        
        // form submit event
        d.on("submit", function() { 

            //t.attr("disabled","disabled"); 
            // set all form inputs readonly
            d.find('input').attr('readonly', 'readonly');
            d.find('textarea').attr('readonly', 'readonly');
            //d.find('select').attr('readonly', 'readonly');

            // disable further clicks on the button
            t.click(function(e) {
                e.preventDefault();
                $(this).focusout();
                $(this).blur();
                return false;
            })
            .addClass("disabled")
            .focusout()
            .blur();
 
            // set html of value for the submit button
            a ? t.html(i) : t.val(i); 
        });
        
    });
 
	// if a controller is found for current page
	if($.isFunction($.fn.controller)) {
	
		// launch the controller
		var ctrl = $.fn.controller(); 
		
    }
    
    // set dropdown item active, if submenu item is active
    $('.dropdown-item.active').parent().parent().addClass('active');
});


function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for(var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}
	return(false);
}

/**
 * google recaptcha v3 form submit
 * @param data google response to token request 
 */
function captchaSubmit(data) {

    // ajax call to check token
    $.ajax({

        // use current location
        url: window.location.href,
            
        // send a get request
        type: 'POST',

        // response data type
        dataType: 'json',

        // data to send
        data: $('form').serialize(), 

        // success callback
        success: function(json) { 
            if (json.result === 'success') {
                $('form').html('<div role="alert" class="alert alert-' + json.result + ' alert-dismissible fade show">' + json.message + '</div>'); 
            } else {
                $('form').prepend('<div role="alert" class="alert alert-' + json.result + ' alert-dismissible fade show">' + json.message + '</div>'); 
            } 
        }, 
    });
}
