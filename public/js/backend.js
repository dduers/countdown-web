/* ---------------------------------------------------------
    STATISTICS CONTROLLER
--------------------------------------------------------- */
(function ($) {

    // page controller
    $.fn.controller = function () {
        var api = {};
        // initialize controls with server default values
        var init = function () {
            // delete button
            $('.action-delete').click(function (event) {
                event.preventDefault();
                $.ajax({
                    url: window.location.href + '/' + $(this).val(),
                    type: 'DELETE',
                    success: function (data) {
                        window.location = window.location.href;
                    }
                });
            });
        };
        // init the controller
        init();
        // for public functions and vars
        return api;
    };
})($);