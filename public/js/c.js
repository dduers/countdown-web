(function ($) {
    /**
     * countdown page js controller
     */
    $.fn.controller = function (options) {
        // options defaults
        let defaults = {
            interval: 1000,
        };
        // merge defaults and options
        let settings = $.extend(true, {}, defaults, options);
        // original server data
        let serverData;
        // target date
        let countdownDate;
        // interval timer
        let timer;

        /**
         * constructor
         */
        let init = function () {
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
            // server ajax request to get the countdown data
            $.ajax({
                url: window.location.href,
                success: function (data) {
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
         * timed countdown update method 
         */
        let updateTime = function () {
            // Get today's date and time
            let now = new Date().getTime();
            // Find the distance between now and the count down date
            let distance = countdownDate - now;
            // Time calculations for days, hours, minutes and seconds
            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(timer);
                $('.card-header').html(serverData.goodbye ? serverData.goodbye : '0 days ' + '0 hours ' + '0 minutes ' + '0 seconds ');
                return;
            }
            // display countdown
            $('.card-header').html(
                (days > 0 ? days + ' days ' : '')
                + (hours > 0 ? hours + ' hours ' : '')
                + (minutes > 0 ? minutes + ' minutes ' : '')
                + (seconds > 0 ? seconds + ' seconds ' : '')
            );
            
        };

        // call controller contructor
        init();
    };
})($);
