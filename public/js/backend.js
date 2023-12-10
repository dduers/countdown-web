(function ($) {
    // page controller
    $.fn.controller = function () {
        var api = {};
        // initialize controls with server default values
        var init = function () {
            // delete button
            $('.action-delete').click(function (event) {
                event.preventDefault();
                console.log($(this).val());
                $.ajax({
                    url: window.location.href,
                    type: 'DELETE',
                    contentType: 'application/json',
                    data: {
                        id: $(this).val(),
                    },
                    success: function (data) {
                        console.log(data);
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
