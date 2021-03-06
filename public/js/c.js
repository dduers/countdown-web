/* ---------------------------------------------------------
    JS CONTROLLER
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

            $.ajax({
                url: window.location.href,
                success: function(data) {
                    serverData = data;
                    if (!serverData)
                        return;
                    countdownDate = new Date(serverData.date).getTime();
                    timer = setInterval(updateTime, settings.interval);
                    $('title').text($('title').text() + ' - ' + serverData.title);
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
