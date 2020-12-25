/* ---------------------------------------------------------
    STATISTICS CONTROLLER
--------------------------------------------------------- */
(function($) {
    
    // page controller
    $.fn.controller = function(options) {
 
        var defaults = {  
            interval: 1000,	 
        };

        var settings = $.extend(true, {}, defaults, options);

        var countdownDate;
        var timer;
        var serverData;
     
        var init = function() {
            $.ajax({ 
                url: window.location.href, 
                success: function(data) {
                    serverData = data;
                    countdownDate = new Date(serverData.date).getTime();
                    timer = setInterval(updateTime, settings.interval);
                    updateTime();
                }, 
            });
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
                clearInterval(timer);
                $('.card-header').html(serverData.goodbye ? serverData.goodbye : '0 days ' + '0 hours ' + '0 minutes ' + '0 seconds ');
            }
        };

        init(); 
    };
})($);
