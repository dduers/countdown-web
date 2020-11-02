/* ---------------------------------------------------------
    MARKGROUP CONTROLLER
--------------------------------------------------------- */
(function($) {
    
    // page controller
    $.fn.controller = function(options, callback) {
        
        // for public functions and vars
        var api = {};

        // overlay element
        var $overlay = $('<div id="overlay"></div>');
 
        // initialize controls with server default values
        var init = function() {

            // query to server for initialization
            $.ajax({ 
              
                // use current location
                url: window.location.href,

                // send a get request
                type: 'GET',

                // build controls
                success: function(data) {
                    //rebuildMethodSelection(data);
                    build(data);
                },
                
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

        var build = function(data) {

            // tooltips
            $('[data-toggle="tooltip"]').tooltip();

            // default value for fishcount
            if (!$('.form-control[name="fishcount"]').val()) {

                // set defaul single fish
                $('.form-control[name="fishcount"]').val('1');
            }

            /**
             * PUBLIC USER REQUESTS
             */
            if (getQueryVariable('domain') == 'public') {

                // make reporting available for the last 90 days
                var today = new Date();
                var minDate = today.setDate(today.getDate() - 90);

                // init date picker
                $('input[name="date_report"]').flatpickr({ 
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                    //altInput: true,
                    //altFormat: "j. F Y H:i",
                    minuteIncrement: 1,
                    defaultHour: 0,
                    defaultMinute: 0,
                    maxDate: 
                        /*new Date(data.data.project[0].date_end) < new Date() 
                        ? new Date(data.data.project[0].date_end) 
                        : (
                            new Date(data.data.project[0].date_end) > new Date() 
                            ? new Date(data.data.project[0].date_end) 
                            :*/ new Date()/*
                        )*/,
                    minDate: minDate,
                    time_24hr: true,
                    enableSeconds: false,
                    locale: data.params.lang
                });

                // for ever tag section                 
                $('.tag').each(function(index) {
    
                    // remove none display class from all method selection options
                    $('.form-control[name="tag[' + index + '][id_method]"]').find('option').removeClass('d-none');

                });

                // when the fishcount changes
                $('.form-control[name="fishcount"]').change(function(event) {

                    // if fish group
                    if ($(this).val() > 1) {

                        // hide these fields for groups 
                        $('.mark-param.length_mm').addClass('d-none');  
                        $('.mark-param.weight_g').addClass('d-none'); 

                    // if single fish
                    } else {

                        // show these fields for singles 
                        $('.mark-param.length_mm').removeClass('d-none');  
                        $('.mark-param.weight_g').removeClass('d-none'); 
                    }
                });

            /**
             * LOGGED IN USERS REQUESTS
             */
            } else {

                //var today = new Date();
                //var maxDate = today.setDate(today.getDate());

                $('input[name="date_report"]').flatpickr({ 
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                    //altInput: true,
                    //altFormat: "j. F Y H:i",
                    minuteIncrement: 1,
                    defaultHour: 0,
                    defaultMinute: 0,
                    maxDate: new Date()/*
                        data.data.project[0].date_end
                        ? (
                            new Date(data.data.project[0].date_end) < new Date() 
                            ? new Date(data.data.project[0].date_end) 
                            : (
                                new Date(data.data.project[0].date_end) > new Date() 
                                ? new Date(data.data.project[0].date_end) 
                                : new Date()
                            )
                        ) : null*/,
                    minDate: new Date(data.data.project[0].date_start),
                    time_24hr: true,
                    enableSeconds: false,
                    locale: data.params.lang
                    //maxDate: new Date().fp_incr(14) // 14 days from now
                });

                $('.form-control[name="fishcount"]').change(function(event) {

                    // if fish group
                    if ($(this).val() > 1) {

                        $('.tag').each(function(index) {

                            // remove none display class from all method selection options
                            $('.form-control[name="tag[' + index + '][id_method]"]').find('option').removeClass('d-none');

                            // hide these fields for groups 
                            $('.mark-param.length_mm').addClass('d-none');  
                            $('.mark-param.weight_g').addClass('d-none'); 

                            // add display non class for all options not meant for groups
                            $('.form-control[name="tag[' + index + '][id_method]"]').find('option').each(function(index) {
                                if (!$(this).attr('data-isgroup')) {
                                    $(this).addClass('d-none');
                                }
                            });

                        });

                    // if single fish
                    } else {

                        $('.tag').each(function(index) {

                            // remove none display class from all method selection options
                            $('.form-control[name="tag[' + index + '][id_method]"]').find('option').removeClass('d-none');

                            // show these fields for singles 
                            $('.mark-param.length_mm').removeClass('d-none');  
                            $('.mark-param.weight_g').removeClass('d-none'); 

                            // add display non class for all options not meant for singles
                            $('.form-control[name="tag[' + index + '][id_method]"]').find('option').each(function(index) {
                                if (!$(this).attr('data-isindividual')) {
                                    $(this).addClass('d-none');
                                }
                            });
                        });
                    }
                });

                // if there is a get var id present
                if (getQueryVariable('id')) {
    
                    // for every tag section ...
                    $('.tag').each(function(index) {

                        var section = $(this);

                        // hide all parameter inputs
                        section.children('.tag-param').addClass('d-none');

                        // remove required attribute from all parameter controls
                        section.children('.tag-param').find('.form-control').removeAttr('required'); 

                        // show all inputs relevant for the selected method
                        $.each(data.methodparams[$('.form-control[name="tag[' + index + '][id_method]"]').val()], function(k, v) { 

                            section.children('.tag-param.' + k).removeClass('d-none'); 

                            // if the param is required
                            if(v === 'required') {
                                
                                section.children('.tag-param.' + k).find('.form-control').attr('required', 'required'); 
                            }
                        });
                    });
                } 
            }

            // for every tag section ...
            $('.tag').each(function(index) {

                var section = $(this); 

                // when mark method 1 control changes
                $('.form-control[name="tag[' + index + '][id_method]"]').change(function(event) {

                    // hide all parameter inputs
                    section.children('.tag-param').addClass('d-none');

                    // remove required attribute from all parameter controls
                    section.children('.tag-param').find('.form-control').removeAttr('required'); 

                    // show all inputs relevant for the selected method
                    $.each(data.methodparams[$('.form-control[name="tag[' + index + '][id_method]"]').val()], function(k, v) { 

                        section.children('.tag-param.' + k).removeClass('d-none'); 

                        // if the param is required
                        if(v === 'required') {
                            
                            section.children('.tag-param.' + k).find('.form-control').attr('required', 'required'); 
                        }
                    });
                });
            });
          
            // trigger fishcount change event
            $('.form-control[name="fishcount"]').change();
        };
 
        // init the controller
        init();
        
        // for public functions and vars
        return api;
    } 
    
})($);
