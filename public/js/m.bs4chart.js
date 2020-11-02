
(function($) {
	
    $.fn.bs4chart = function( options ) {
 
 		// exposed properties and methods
        var api = {}; 
		
		// set defaults for this module
        var defaults = { 
		
			// originally received data from server
			data: {},
			
			// jquery container element for the control
			ctrlelem: null,
 
			// control type
			ctrltype: '',
 
			// data for the control
			ctrldata: {}, 
			
			// control disabled attribute
            disabled: false,
			
			// control visibility
			visible: true,
			
			// on print header image (is added when printing the chart)
			onprintheaderimage: false,			 												
        };
 
 		// extend the defaults with the options
        var settings = $.extend( true, {}, defaults, options );	

        // inizialize settings array
        var init = function() {

			// copy data to base settings
			settings = $.extend(true, {}, settings, settings.data );
 
 			// console.warn('chart: ', settings);
			
			// build the control
			build(); 
 
        };
 
 		// build the control
		var build = function() { 
		
		
			// highcharts set globals
			Highcharts.setOptions({
				lang: {
					
					// thousands separator
					thousandsSep: settings.ctrldata.customsettings.thousandSeparator,
					
					// decimal separator
					decimalPoint: settings.ctrldata.customsettings.decimalSeparator,
				}
			});
 	
			// format tooltips
			var formatter = function() {
			
				var s = '<b>'+ this.x +'</b>',
					sum = 0;
					
				
				$.each(this.points, function(i, point) {
					s += '<br/><span style="color:' + point.color + '">●</span> ' 
							+ point.series.name + ': <b>' + Highcharts.numberFormat(point.y, settings.ctrldata.customsettings.decimals) + '</b>' 
							+ ' (' + Math.round( point.percentage ) + '%)';
 
					sum += point.y;
				});
				
				s += '<br/>Total: <b>' + Highcharts.numberFormat(sum, settings.ctrldata.customsettings.decimals) + '</b>';
				
				return s;
			};
			
			// TODO:: PRINT HEADER IMAGE
			var image; 
			var events = {
				/*
				load: function () {
					if(this.options.chart.forExport) {

						// add header image, when set
						if(settings.onprintheaderimage) {
							this.renderer.image(settings.onprintheaderimage,30,80,730,85).add();
						}
					}
				},

				afterPrint: function(event) { 
 				
					this.options.chart.height = 700;
					this.options.chart.spacingTop = 5;
					this.options.chart.spacingBottom = 100;
					this.options.chart.marginTop = 100;	

					// remove header image, if set
					if(settings.onprintheaderimage) {
						image.element.remove(); 
					}

					// rerender the control to update settings
					api.update();
				},
 
				beforePrint: function(event) {
					
					this.options.chart.height = 1000; 
					this.options.chart.spacingTop = 210;
					this.options.chart.spacingBottom = 100;
					this.options.chart.marginTop = 290;
					
					// set header image before print, if one is set
					if(settings.onprintheaderimage) {
						image = this.renderer.image(settings.onprintheaderimage,30,80,730,85).add(); 
					}
				},
				*/
				
			};
 
			settings.ctrldata.tooltip.formatter = formatter; 
			settings.ctrldata.chart.events = events; 
 
			// empty the container element
			settings.ctrlelem.empty();

			// if control is set visible
			if(settings.visible) {

				// init third party control with data and options
				settings.ctrlelem.highcharts(settings.ctrldata); 
			}
		};

		// update the control
        api.update = function(data) {
 
			// update settings with new data
			settings = $.extend(true, {}, settings, data );
 
 			// rebuild the control
			build(); 
			
        };
 
 		// execute the init function (contructor)
        init();	
		
		// export the public variables and methods
        return api;	
		
    };
	
})($);
