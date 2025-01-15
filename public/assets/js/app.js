var App = function () {

    var isMainPage = false;
    var isMapPage = false;
    var isIE8 = false;

    // used by plot functions
    var data = [];
    var totalPoints = 250;

    // random data generator for plot charts
    function getRandomData() {
        if (data.length > 0) data = data.slice(1);
        // do a random walk
        while (data.length < totalPoints) {
            var prev = data.length > 0 ? data[data.length - 1] : 50;
            var y = prev + Math.random() * 10 - 5;
            if (y < 0) y = 0;
            if (y > 100) y = 100;
            data.push(y);
        }
        // zip the generated y values with the x values
        var res = [];
        for (var i = 0; i < data.length; ++i) res.push([i, data[i]])
        return res;
    }


    var handleAllJQVMAP = function () {
        var setMap = function (name) {
            var data = {
                map: 'world_en',
                backgroundColor: null,
                borderColor: '#333333',
                borderOpacity: 0.5,
                borderWidth: 1,
                color: '#c6c6c6',
                enableZoom: true,
                hoverColor: '#c9dfaf',
                hoverOpacity: null,
                values: sample_data,
                normalizeFunction: 'linear',
                scaleColors: ['#b6da93', '#427d1a'],
                selectedColor: '#c9dfaf',
                selectedRegion: null,
                showTooltip: true,
                onRegionOver: function (event, code) {
                    //sample to interact with map
                    if (code == 'ca') {
                        event.preventDefault();
                    }
                },
                onRegionClick: function (element, code, region) {
                    //sample to interact with map
                    var message = 'You clicked "' + region + '" which has the code: ' + code.toUpperCase();
                    alert(message);
                }
            };

            data.map = name + '_en';
            var map = jQuery('#vmap_' + name);
            map.width(map.parent().width());
            map.vectorMap(data);
        }

        setMap("world");
        setMap("usa");
        setMap("europe");
        setMap("russia");
        setMap("germany");
    }

    var handlKnobElements = function () {
        //knob does not support ie8 so skip it
        if (!jQuery().knob || isIE8) {
            return;
        }

        if ($(".knobify").size() > 0) {
            $(".knobify").knob({
                readOnly: true,
                skin: "tron",
                'width': 100,
                'height': 100,
                'dynamicDraw': true,
                'thickness': 0.2,
                'tickColorizeValues': true,
                'skin': 'tron',
                draw: function () {
                    // "tron" case
                    if (this.$.data('skin') == 'tron') {

                        var a = this.angle(this.cv) // Angle
                        ,
                            sa = this.startAngle // Previous start angle
                            ,
                            sat = this.startAngle // Start angle
                            ,
                            ea // Previous end angle
                            ,
                            eat = sat + a // End angle
                            ,
                            r = 1;

                        this.g.lineWidth = this.lineWidth;

                        this.o.cursor && (sat = eat - 0.3) && (eat = eat + 0.3);

                        if (this.o.displayPrevious) {
                            ea = this.startAngle + this.angle(this.v);
                            this.o.cursor && (sa = ea - 0.3) && (ea = ea + 0.3);
                            this.g.beginPath();
                            this.g.strokeStyle = this.pColor;
                            this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
                            this.g.stroke();
                        }

                        this.g.beginPath();
                        this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
                        this.g.stroke();

                        this.g.lineWidth = 2;
                        this.g.beginPath();
                        this.g.strokeStyle = this.o.fgColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                        this.g.stroke();

                        return false;

                    }
                }
            });
        }
    }


    var handleMainMenu = function () {
        jQuery('#sidebar .has-sub > a').click(function () {
            var sub = jQuery(this).next();
            if (sub.is(":visible")) {
                jQuery('.arrow', jQuery(this)).removeClass("open");
                sub.slideUp(200);
            } else {
                jQuery('.arrow', jQuery(this)).addClass("open");
                sub.slideDown(200);
            }
        });

        jQuery('.ajaxify').unbind("click");
        jQuery('.ajaxify').click(function (e) {
            e.preventDefault();
            jQuery.post(jQuery(this).attr("href") + '?rand=' + ((new Date).getTime()), {}, function (data) {
                jQuery('#page').html(data);
                App.init();
            })
        })
    }

    var handleWidgetTools = function () {
        jQuery('.widget .tools .icon-remove').click(function () {
            jQuery(this).parents(".widget").parent().remove();
        });

        jQuery('.widget .tools .icon-refresh').click(function () {
            var el = jQuery(this).parents(".widget");
            App.blockUI(el);
            window.setTimeout(function () {
                App.unblockUI(el);
            }, 1000);
        });

        jQuery('.widget .tools .icon-chevron-down, .widget .tools .icon-chevron-up').click(function () {
            var el = jQuery(this).parents(".widget").children(".widget-body");
            if (jQuery(this).hasClass("icon-chevron-down")) {
                jQuery(this).removeClass("icon-chevron-down").addClass("icon-chevron-up");
                el.slideUp(200);
            } else {
                jQuery(this).removeClass("icon-chevron-up").addClass("icon-chevron-down");
                el.slideDown(200);
            }
        });
    }



    var handleFixInputPlaceholderForIE = function () {
        //fix html5 placeholder attribute for ie7 & ie8
        if (jQuery.browser.msie && jQuery.browser.version.substr(0, 1) <= 9) { // ie7&ie8
            jQuery('input[placeholder], textarea[placeholder]').each(function () {

                var input = jQuery(this);

                jQuery(input).val(input.attr('placeholder'));

                jQuery(input).focus(function () {
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });

                jQuery(input).blur(function () {
                    if (input.val() == '' || input.val() == input.attr('placeholder')) {
                        input.val(input.attr('placeholder'));
                    }
                });
            });
        }
    }

    var handleStyler = function () {
        var scrollHeight = '120px';

        jQuery('#styler').mouseleave(function () {
            if (!$(this).attr("opening") && !$(this).attr("closing")) {
                $(this).removeAttr("opened");
                $(this).attr("closing", "1");

                $("#styler").css("overflow", "hidden").animate({
                    width: '20px',
                    height: '22px',
                    'padding-top': '3px'
                }, {
                    complete: function () {
                        $(this).removeAttr("closing");
                        $("#styler .settings").hide();
                    }
                });
            }
        });

        jQuery('#styler').click(function () {
            if ($(this).attr("opened") && !$(this).attr("opening") && !$(this).attr("closing")) {

            } else if (!$(this).attr("closing") && !$(this).attr("opening")) {
                $(this).attr("opening", "1");
                $("#styler").css("overflow", "visible").animate({
                    width: '190px',
                    height: scrollHeight,
                    'padding-top': '10px'
                }, {
                    complete: function () {
                        $(this).removeAttr("opening");
                        $(this).attr("opened", 1);
                    }
                });
                $("#styler .settings").show();
            }
        });

        jQuery('#styler .colors span').click(function () {
            var color = $(this).attr("data-style");
            setColor(color);
        });

        jQuery('#styler .layout input').change(function () {
            setLayout();
        });

        var setColor = function (color) {
            $('#style_color').attr("href", "assets/css/style_" + color + ".css");
        }

        var setLayout = function () {
            if (jQuery('#styler .layout input.header').is(":checked")) {
                $("body").addClass("fixed-top");
                $("#header").addClass("navbar-fixed-top");
            } else {
                $("body").removeClass("fixed-top");
                $("#header").removeClass("navbar-fixed-top");
            }

            if (jQuery('#styler .layout input.metro').is(":checked")) {
                $('#style_metro').attr("href", "assets/css/style_metro.css");
            } else {
                $('#style_metro').attr("href", "");
            }
        }

        //changeFixedTop(); 
    }

    var handlePulsate = function () {
        if (!jQuery().pulsate) {
            return;
        }

        if (isIE8 == true) {
            return; // pulsate plugin does not support IE8 and below
        }

        if (jQuery().pulsate) {
            jQuery('#pulsate-regular').pulsate({
                color: "#bf1c56"
            });

            jQuery('#pulsate-once').click(function () {
                $(this).pulsate({
                    color: "#399bc3",
                    repeat: false
                });
            });

            jQuery('#pulsate-hover').pulsate({
                color: "#5ebf5e",
                repeat: false,
                onHover: true
            });

            jQuery('#pulsate-crazy').click(function () {
                $(this).pulsate({
                    color: "#fdbe41",
                    reach: 50,
                    repeat: 10,
                    speed: 100,
                    glow: true
                });
            });
        }
    }

    var handleIntro = function () {

        if ($.cookie('intro_show')) {
            return;
        }
        $.cookie('intro_show', 1);

        setTimeout(function () {
            var unique_id = $.gritter.add({

                // (string | mandatory) the heading of the notification
                title: 'Meet Conquer v1.2!',
                // (string | mandatory) the text inside the notification
                text: 'Conquer is a brand new Responsive Admin Dashboard Template you have always been looking for!',
                // (string | optional) the image to display on the left
                image1: './assets/img/avatar-mini.png',
                // (bool | optional) if you want it to fade out on its own or just sit there
                sticky: true,
                // (int | optional) the time you want it to be alive for before fading out
                time: '',
                // (string | optional) the class name you want to apply to that specific message
                class_name: 'my-sticky-class'
            });

            // You can have it return a unique id, this can be used to manually remove it later using
            setTimeout(function () {
                $.gritter.remove(unique_id, {
                    fade: true,
                    speed: 'slow'
                });
            }, 12000);
        }, 2000);

        setTimeout(function () {
            var unique_id = $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'Buy Conquer!',
                // (string | mandatory) the text inside the notification
                text: 'Conquer comes with a huge collection of reusable and easy customizable UI components and plugins. Buy Conquer today!',
                // (string | optional) the image to display on the left
                image1: './assets/img/avatar-mini.png',
                // (bool | optional) if you want it to fade out on its own or just sit there
                sticky: true,
                // (int | optional) the time you want it to be alive for before fading out
                time: '',
                // (string | optional) the class name you want to apply to that specific message
                class_name: 'my-sticky-class'
            });

            // You can have it return a unique id, this can be used to manually remove it later using
            setTimeout(function () {
                $.gritter.remove(unique_id, {
                    fade: true,
                    speed: 'slow'
                });
            }, 13000);
        }, 8000);

        setTimeout(function () {

            $('#styler').pulsate({
                color: "#bb3319",
                repeat: 10
            });

            $.extend($.gritter.options, {
                position: 'top-left'
            });

            var unique_id = $.gritter.add({
                position: 'top-left',
                // (string | mandatory) the heading of the notification
                title: 'Customize Conquer!',
                // (string | mandatory) the text inside the notification
                text: 'Conquer allows you to easily customize the theme colors and layout settings.',
                // (string | optional) the image to display on the left
                image1: './assets/img/avatar-mini.png',
                // (bool | optional) if you want it to fade out on its own or just sit there
                sticky: true,
                // (int | optional) the time you want it to be alive for before fading out
                time: '',
                // (string | optional) the class name you want to apply to that specific message
                class_name: 'my-sticky-class'
            });

            $.extend($.gritter.options, {
                position: 'top-right'
            });

            // You can have it return a unique id, this can be used to manually remove it later using
            setTimeout(function () {
                $.gritter.remove(unique_id, {
                    fade: true,
                    speed: 'slow'
                });
            }, 15000);

        }, 23000);

        setTimeout(function () {

            $.extend($.gritter.options, {
                position: 'top-left'
            });

            var unique_id = $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'Notification',
                // (string | mandatory) the text inside the notification
                text: 'You have 3 new notifications.',
                // (string | optional) the image to display on the left
                image1: './assets/img/avatar-mini.png',
                // (bool | optional) if you want it to fade out on its own or just sit there
                sticky: true,
                // (int | optional) the time you want it to be alive for before fading out
                time: '',
                // (string | optional) the class name you want to apply to that specific message
                class_name: 'my-sticky-class'
            });

            setTimeout(function () {
                $.gritter.remove(unique_id, {
                    fade: true,
                    speed: 'slow'
                });
            }, 4000);

            $.extend($.gritter.options, {
                position: 'top-right'
            });

            var number = $('#header_notification_bar .label').text();
            number = parseInt(number);
            number = number + 3;
            $('#header_notification_bar .label').text(number);
            $('#header_notification_bar').pulsate({
                color: "#66bce6",
                repeat: 5
            });

        }, 40000);

        setTimeout(function () {

            $.extend($.gritter.options, {
                position: 'top-left'
            });

            var unique_id = $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'Inbox',
                // (string | mandatory) the text inside the notification
                text: 'You have 2 new messages in your inbox.',
                // (string | optional) the image to display on the left
                image1: './assets/img/avatar-mini.png',
                // (bool | optional) if you want it to fade out on its own or just sit there
                sticky: true,
                // (int | optional) the time you want it to be alive for before fading out
                time: '',
                // (string | optional) the class name you want to apply to that specific message
                class_name: 'my-sticky-class'
            });

            $.extend($.gritter.options, {
                position: 'top-right'
            });

            setTimeout(function () {
                $.gritter.remove(unique_id, {
                    fade: true,
                    speed: 'slow'
                });
            }, 4000);

            var number = $('#header_inbox_bar .label').text();
            number = parseInt(number);
            number = number + 2;
            $('#header_inbox_bar .label').text(number);
            $('#header_inbox_bar').pulsate({
                color: "#dd5131",
                repeat: 5
            });

        }, 60000);
    }

    var handlePeity = function () {
        if (!jQuery().peity) {
            return;
        }

        if (jQuery.browser.msie && jQuery.browser.version.substr(0, 2) <= 8) { // ie7&ie8
            return;
        }


        $(".stat.bad .line-chart").peity("line", {
            height: 20,
            width: 50,
            colour: "#d12610",
            strokeColour: "#666"
        }).show();

        $(".stat.bad .bar-chart").peity("bar", {
            height: 20,
            width: 50,
            colour: "#d12610",
            strokeColour: "#666"
        }).show();

        $(".stat.ok .line-chart").peity("line", {
            height: 20,
            width: 50,
            colour: "#37b7f3",
            strokeColour: "#757575"
        }).show();

        $(".stat.ok .bar-chart").peity("bar", {
            height: 20,
            width: 50,
            colour: "#37b7f3"
        }).show();

        $(".stat.good .line-chart").peity("line", {
            height: 20,
            width: 50,
            colour: "#52e136"
        }).show();

        $(".stat.good .bar-chart").peity("bar", {
            height: 20,
            width: 50,
            colour: "#52e136"
        }).show();
        //

        $(".stat.bad.huge .line-chart").peity("line", {
            height: 20,
            width: 40,
            colour: "#d12610",
            strokeColour: "#666"
        }).show();

        $(".stat.bad.huge .bar-chart").peity("bar", {
            height: 20,
            width: 40,
            colour: "#d12610",
            strokeColour: "#666"
        }).show();

        $(".stat.ok.huge .line-chart").peity("line", {
            height: 20,
            width: 40,
            colour: "#37b7f3",
            strokeColour: "#757575"
        }).show();

        $(".stat.ok.huge .bar-chart").peity("bar", {
            height: 20,
            width: 40,
            colour: "#37b7f3"
        }).show();

        $(".stat.good.huge .line-chart").peity("line", {
            height: 20,
            width: 40,
            colour: "#52e136"
        }).show();

        $(".stat.good.huge .bar-chart").peity("bar", {
            height: 20,
            width: 40,
            colour: "#52e136"
        }).show();
    }

    var handleDeviceWidth = function () {
        function fixWidth(e) {
            var winHeight = $(window).height();
            var winWidth = $(window).width();
            //alert(winWidth);
            //for tablet and small desktops
            if (winWidth < 1125 && winWidth > 767) {
                $(".responsive").each(function () {
                    var forTablet = $(this).attr('data-tablet');
                    var forDesktop = $(this).attr('data-desktop');
                    if (forTablet) {
                        $(this).removeClass(forDesktop);
                        $(this).addClass(forTablet);
                    }

                });
            } else {
                $(".responsive").each(function () {
                    var forTablet = $(this).attr('data-tablet');
                    var forDesktop = $(this).attr('data-desktop');
                    if (forTablet) {
                        $(this).removeClass(forTablet);
                        $(this).addClass(forDesktop);
                    }
                });
            }
        }

        fixWidth();

        running = false;
        jQuery(window).resize(function () {
            if (running == false) {
                running = true;
                setTimeout(function () {
                    // fix layout width
                    fixWidth();

                    if (isMainPage) {
                    } else {
                    }
                    // fix vector maps width
                    if (isMainPage) {
                        jQuery('.vmaps').each(function () {
                            var map = jQuery(this);
                            map.width(map.parent().parent().width());
                        });
                    }
                    if (isMapPage) {
                        jQuery('.vmaps').each(function () {
                            var map = jQuery(this);
                            map.width(map.parent().width());
                        });
                    }
                    // fix event form chosen dropdowns
                    $('#event_priority_chzn').width($('#event_title').width() + 15);
                    $('#event_priority_chzn .chzn-drop').width($('#event_title').width() + 13);

                    $(".chzn-select").val('').trigger("liszt:updated");
                    //finish
                    running = false;
                }, 200); // wait for 200ms on resize event           
            }
        });
    }


    var handleTooltip = function () {
        jQuery('.tooltips').tooltip();
    }

    var handlePopover = function () {
        jQuery('.popovers').popover();
    }

    var handleSelectInput = function () {
        if (!jQuery().chosen) {
            return;
        }
        $(".chosen").chosen();
        $(".chosen-with-diselect").chosen({
            allow_single_deselect: true
        });
    }

    var handleToggleButtons = function () {
        if (!jQuery().toggleButtons) {
            return;
        }
        $('.basic-toggle-button').toggleButtons();
        $('.text-toggle-button').toggleButtons({
            width: 200,
            label: {
                enabled: "Lorem Ipsum",
                disabled: "Dolor Sit"
            }
        });
        $('.danger-toggle-button').toggleButtons({
            style: {
                // Accepted values ["primary", "danger", "info", "success", "warning"] or nothing
                enabled: "danger",
                disabled: "info"
            }
        });
        $('.info-toggle-button').toggleButtons({
            style: {
                enabled: "info",
                disabled: ""
            }
        });
        $('.success-toggle-button').toggleButtons({
            style: {
                enabled: "success",
                disabled: "info"
            }
        });
        $('.warning-toggle-button').toggleButtons({
            style: {
                enabled: "warning",
                disabled: "info"
            }
        });

        $('.height-toggle-button').toggleButtons({
            height: 100,
            font: {
                'line-height': '100px',
                'font-size': '20px',
                'font-style': 'italic'
            }
        });
    }

    var handleAccordions = function () {
        $(".accordion").collapse().height('auto');
    }

    var handleScrollers = function () {
        if (!jQuery().slimScroll) {
            return;
        }

        $('.scroller').each(function () {
            $(this).slimScroll({
                //start: $('.blah:eq(1)'),
                height: $(this).attr("data-height"),
                alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
                railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
                disableFadeOut: true
            });
        });
    }

    var handleGoTop = function () {
        /* set variables locally for increased performance */
        jQuery('#footer .go-top').click(function () {
            App.scrollTo();
        });

    }
    
    var handleDateTimePickers = function () {    	 
    	 $('.date-picker').datepicker({
    	     format: "dd-mm-yyyy"
    	 });

         $('.timepicker-default').timepicker();

         $('.timepicker-24').timepicker({
             minuteStep: 1,
             showSeconds: true,
             showMeridian: false
         });
    }
    
    var handleColorPicker = function () {
        if (!jQuery().colorpicker) {
            return;
        }
        $('.colorpicker-default').colorpicker({
            format: 'hex'
        });
        $('.colorpicker-rgba').colorpicker();
    }
    
    var Handelftr = function () {
    	
    	var form = $('#ftr');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	produk: {
                    required: true,
                }, 
            },
            messages:{
            	produk: {
            		required:"<strong>ERROR ! </strong> PILIH PRODUK !!!",
            	},
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    var Handelrcn = function () {
    	var form = $('#rcn');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	produk: {
                    required: true,
                },
                bank:{
                	required: true,
                }
            },
            messages:{
            	produk: {
            		required:"<strong>ERROR ! </strong> PILIH PRODUK !!!",
            	},
            	bank:{
                	required: "<strong>ERROR ! </strong> PILIH BANK !!!",
                }
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    var Handelfcn = function () {
    	var form = $('#fcn');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	produk: {
                    required: true,
                },
                bank:{
                	required: true,
                }
            },
            messages:{
            	produk: {
            		required:"<strong>ERROR ! </strong> PILIH PRODUK !!!",
            	},
            	bank:{
                	required: "<strong>ERROR ! </strong> PILIH BANK !!!",
                }
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();

            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    
    var HandelSettlement = function () {
    	var form = $('#settlement');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	produk: {
                    required: true,
                },
                bank:{
                	required: true,
                }
            },
            messages:{
            	produk: {
            		required:"<strong>ERROR ! </strong> PILIH PRODUK !!!",
            	},
            	bank:{
                	required: "<strong>ERROR ! </strong> PILIH BANK !!!",
                }
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();

            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    
    var SearchBiller = function () {
    	var form = $('#billerlog');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	server: {
                    required: true,
                },
                key1:{
                	required: true,
                }
            },
            messages:{
            	server: {
            		required:"<strong>ERROR ! </strong> PILIH SERVER !!!",
            	},
            	key1:{
                	required: "<strong>ERROR ! </strong> MASUKAN IDPEL / NOMETER / NOREG !!!",
                }
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();

            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    
    var HandelKereta = function () {
    	var form = $('#kereta');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	bank: {
                    required: true,
                },
            },
            messages:{
            	bank: {
            		required:"<strong>ERROR ! </strong> PILIH BANK !!!",
            	},
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();

            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    
    var HandelPajak = function () {
    	var form = $('#pbbaja');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	pbb: {
                    required: true,
                },
            },
            messages:{
            	pbb: {
            		required:"<strong>ERROR ! </strong> PILIH PBB !!!",
            	},
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();

            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    
    var HandelSyncMB = function () {
    	var form = $('#syncmbxx');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	produk: {
                    required: true,
                }
            },
            messages:{
            	produk: {
            		required:"<strong>ERROR ! </strong> PILIH PRODUK !!!",
            	}
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();

            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    
    var HandelFTRSA = function () {
    	var form = $('#ftrsa,#fcnsa,#settle');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	produk: {
                    required: true,
                },
                mitrasa:{
                	required: true,
                }
            },
            messages:{
            	produk: {
            		required:"<strong>ERROR ! </strong> PILIH PRODUK !!!",
            	},
            	mitrasa:{
            		required:"<strong>ERROR ! </strong> PILIH MITRA !!!",
                }
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();

            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    
    var HandelSPXSA = function () {
    	var form = $('#spxsa');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	produk: {
                    required: true,
                },
            },
            messages:{
            	produk: {
            		required:"<strong>ERROR ! </strong> PILIH PRODUK !!!",
            	},
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();

            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    
    var HandelGenerateFTRSa = function () {
    	var form = $('#generateftrsax');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	produk: {
                    required: true,
                },
                bank:{
                	required: true,
                }
            },
            messages:{
            	produk: {
            		required:"<strong>ERROR ! </strong> PILIH PRODUK !!!",
            	},
            	bank:{
                	required: "<strong>ERROR ! </strong> PILIH BANK !!!",
                }
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();

            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    var HandelSetCalender = function () {
    	var form = $('#kalender');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
                ket:{
                	required: true,
                },
                pic:{
                	required: true,
                },
            },
            messages:{
                ket:{
                	required: "<strong>ERROR ! </strong> PILIH KETERANGAN !!!",
                },
                pic:{
                	required: "<strong>ERROR ! </strong> ISIKAN PIC !!!",
                },
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();

            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    var HandelFAQ = function () {
    	var form = $('#todo');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	judul:{
                	required: true,
                },
                des:{
                	required: true,
                },
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();

            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    var HandelUsr = function () {
    	var form = $('#fuser');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	userx:{
                	required: true,
                },
                pass:{
                	required: true,
                },
                emailx:{
                	required: true,
                	email:true,
                },
            },
            messages:{
                emailx:{
                	email: "<strong>ERROR ! </strong> ALAMAT EMAIL TIDAK VALID !!!",
                },
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();

            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    var Handelisopasrs = function () {
    	var form = $('#isopars');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	pesan:{
                	required: true,
                },
            },
            messages:{
            	pesan:{
                	required: "<strong>ERROR ! </strong> MASUKAN ISO STREAM !!!",
                },
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();

            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    var HandelSettlement = function () {
    	
    	var form = $('#datasettlement');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	produkx: {
                    required: true,
                },
                tglawal:{
                	required: true,
                },
                tglakhir:{
                	required: true,
                },
            },
            messages:{
            	produkx: {
            		required:"<strong>ERROR ! </strong> PILIH PRODUK !!!",
            	},
            	tglawal: {
            		required:"<strong>ERROR ! </strong> PILIH TANGGAL AWAL !!!",
            	},
            	tglakhir: {
            		required:"<strong>ERROR ! </strong> PILIH TANGGAL AKHIR !!!",
            	},
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    var handleCalendar = function () {

        if (!jQuery().fullCalendar) {
            return;
        }

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        var h = {};

        if ($(window).width() <= 320) {
            h = {
                left: 'title, prev,next',
                center: '',
                right: 'today,month,agendaWeek,agendaDay'
            };
        } else {
            h = {
                left: 'title',
                center: '',
                right: 'prev,next,today,month,agendaWeek,agendaDay'
            };
        }

        var initDrag = function (el) {
            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim(el.text()) // use the element's text as the event title
            };
            // store the Event Object in the DOM element so we can get to it later
            el.data('eventObject', eventObject);
            // make the event draggable using jQuery UI
            el.draggable({
                zIndex: 999,
                revert: true, // will cause the event to go back to its
                revertDuration: 0 //  original position after the drag
            });
        }

        var addEvent = function (title, priority) {
            title = title.length == 0 ? "Untitled Event" : title;
            priority = priority.length == 0 ? "default" : priority;

            var html = $('<div data-class="label label-' + priority + '" class="external-event label label-' + priority + '">' + title + '</div>');
            jQuery('#event_box').append(html);
            initDrag(html);
        }

        $('#external-events div.external-event').each(function () {
            initDrag($(this))
        });

        $('#event_add').click(function () {
            var title = $('#event_title').val();
            var priority = $('#event_priority').val();
            addEvent(title, priority);
        });

        //modify chosen options
        var handleDropdown = function () {
            $('#event_priority_chzn .chzn-search').hide(); //hide search box
            $('#event_priority_chzn_o_1').html('<span class="label label-default">' + $('#event_priority_chzn_o_1').text() + '</span>');
            $('#event_priority_chzn_o_2').html('<span class="label label-success">' + $('#event_priority_chzn_o_2').text() + '</span>');
            $('#event_priority_chzn_o_3').html('<span class="label label-info">' + $('#event_priority_chzn_o_3').text() + '</span>');
            $('#event_priority_chzn_o_4').html('<span class="label label-warning">' + $('#event_priority_chzn_o_4').text() + '</span>');
            $('#event_priority_chzn_o_5').html('<span class="label label-important">' + $('#event_priority_chzn_o_5').text() + '</span>');
        }

        $('#event_priority_chzn').click(handleDropdown);

        //predefined events
        addEvent("My Event 1", "default");
        addEvent("My Event 2", "success");
        addEvent("My Event 3", "info");
        addEvent("My Event 4", "warning");
        addEvent("My Event 5", "important");
        addEvent("My Event 6", "success");
        addEvent("My Event 7", "info");
        addEvent("My Event 8", "warning");
        addEvent("My Event 9", "success");
        addEvent("My Event 10", "default");

        $('#calendar').fullCalendar({
            header: h,
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            drop: function (date, allDay) { // this function is called when something is dropped

                // retrieve the dropped element's stored Event Object
                var originalEventObject = $(this).data('eventObject');
                // we need to copy it, so that multiple events don't have a reference to the same object
                var copiedEventObject = $.extend({}, originalEventObject);

                // assign it the date that was reported
                copiedEventObject.start = date;
                copiedEventObject.allDay = allDay;
                copiedEventObject.className = $(this).attr("data-class");

                // render the event on the calendar
                // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

                // is the "remove after drop" checkbox checked?
                if ($('#drop-remove').is(':checked')) {
                    // if so, remove the element from the "Draggable Events" list
                    $(this).remove();
                }
            },
            events: "../home/index/kalender/",
            eventRender: function(event, element) {
                element.attr('title', event.descripsi);
            }
        });

    }

	
        var HandelFTRBPJS = function () {
    	/*
    	var form = $('#bpjs');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	fileftrbpjs: {
                    required: true,
                },
            },
            messages:{
            	fileftrbpjs: {
            		required:"<strong>ERROR ! </strong> SELECT FILE !!!",
            	},
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });   
        */ 
    }
    
    var handleWysihtml5 = function () {
        if (!jQuery().wysihtml5) {
            return;
        }

        if ($('.wysihtml5').size() > 0) {
            $('.wysihtml5').wysihtml5();
        }
    }


     var HandelFTPMitraTeknis = function () {
    	
    	var form = $('#formftp');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	tidftp: {
                    required: true,
                },
                userftp:{
                	required: true,
                },
                passftp:{
                	required: true,
                },
            },
            messages:{
            	tidftp: {
            		required:"<strong>ERROR ! </strong> MASUKAN TID !!!",
            	},
            	userftp: {
            		required:"<strong>ERROR ! </strong> MASUKAN USER !!!",
            	},
            	passftp: {
            		required:"<strong>ERROR ! </strong> MASUKAN PASS !!!",
            	},
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    
    var handleTables = function () {
        if (!jQuery().dataTable) {
            return;
        }

        $('#tableftplistmitra,#tableftplistmitramb,#tableemaillistmitra').dataTable({
            "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_ per page",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                }
            },
            "aoColumnDefs": [{
                'bSortable': false,
                'aTargets': [0]
            }]
        });

        jQuery('.group-checkable').change(function () {
            var set = jQuery(this).attr("data-set");
            var checked = jQuery(this).is(":checked");
            jQuery(set).each(function () {
                if (checked) {
                    $(this).attr("checked", true);
                } else {
                    $(this).attr("checked", false);
                }
            });
            jQuery.uniform.update(set);
        });
    }

	
    var HandelErrorBook = function () {
    	
    	var form = $('#ERRB');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	pelapor: {
                    required: true,
                },
                institusi:{
                	required: true,
                },
                gangguan:{
                	required: true,
                },
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }
    
    
    var HandelEmailMitra = function () {
    	
    	var form = $('#formemailmitra');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	kodemappingx: {
                    required: true,
                },
                toemailmitra: {
                    required: true,
                },
                ccemailmitra: {
                    required: true,
                },
            },
            messages:{
            	kodemappingx: {
            		required:"<strong>ERROR ! </strong> MASUKAN KODE MITRA MAPPING !!!",
            	},
            	toemailmitra: {
            		required:"<strong>ERROR ! </strong> MASUKAN EMAIL TO MITRA MAPPING !!!",
            	},
            	ccemailmitra: {
            		required:"<strong>ERROR ! </strong> MASUKAN EMAIL CC MITRA MAPPING !!!",
            	},
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }

    var HandelUpdateBillerlog = function () {
    	
    	var form = $('#updatebillerlog');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	key1log: {
                    required: true,
                },
                key2log:{
                	required: true,
                },
            },
            messages:{
            	key1log: {
            		required:"<strong>ERROR ! </strong> MASUKAN IDPEL !!!",
            	},
            	key2log: {
            		required:"<strong>ERROR ! </strong> MASUKAN NOMETER !!!",
            	},
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }

	
   var handleFTPMB = function () {
    	
    	var form = $('#formftpmb');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	produkmb: {
                    required: true,
                },
                mitramb:{
                	required: true,
                },
                userftpmb:{
                	required: true,
                },
                passftpmb:{
                	required: true,
                },
            },
            messages:{
            	produkmb: {
            		required:"<strong>ERROR ! </strong> PILIH BILLER !!!",
            	},
            	mitramb: {
            		required:"<strong>ERROR ! </strong> PILIH MITRA !!!",
            	},
            	userftpmb: {
            		required:"<strong>ERROR ! </strong> MASUKAN USER !!!",
            	},
            	passftpmb: {
            		required:"<strong>ERROR ! </strong> MASUKAN PASSWORD !!!",
            	},
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }

        var Handelblocktrx = function () {
    	var form = $('#blockingtrx');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	server:{
            		required: true,
            	},
            	produk: {
                    required: true,
                },
                bank:{
                	required: true,
                },
                status:{
                	required: true,
                }
            },
            messages:{
            	server: {
            		required:"<strong>ERROR ! </strong> PILIH SERVER !!!",
            	},
            	produk: {
            		required:"<strong>ERROR ! </strong> PILIH PRODUK !!!",
            	},
            	bank:{
                	required: "<strong>ERROR ! </strong> PILIH BANK !!!",
                },
                status: {
            		required:"<strong>ERROR ! </strong> PILIH STATUS !!!",
            	},
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
                $('#dvLoading').hide();
            },
            highlight: function (element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.input-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.input-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function (label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.input-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');
            }
        });    
    }

	var Handelappserverform = function () {
        
        $('#startstop').on('click', function() {
        	
        	var form = $('#listappsrvtrx');
        	var errorHandler = $('.errorHandler', form);
        	
        	$("label.error").hide();
        	$(".error").removeClass("error");
        	
	        form.validate({
	            ignore: "",
	            rules: {
	            	ipserver:{
	            		required: true,
	            	},
	            	appssrvon: {
	                    required: true,
	                },
	                path:{
	                	required: true,
	                }
	            },
	            messages:{
	            	ipserver: {
	            		required:"<strong>ERROR ! </strong> PILIH IP SERVER !!!",
	            	},
	            	appssrvon: {
	            		required:"<strong>ERROR ! </strong> PILIH NAMA APLIKASI !!!",
	            	},
	            	path:{
	                	required: "<strong>ERROR ! </strong> PATH TIDAK TERSEDIA !!!",
	                }
	            },
	            submitHandler: function (form) {
	                errorHandler.hide();
	                form.submit();
	            }, 
	            invalidHandler: function (event, validator) { //display error alert on form submit
	                errorHandler.show();
	                $('#dvLoading').hide();
	            },
	        });   
        });
        
        
        $('#cekstatus').on('click', function() {
       	
        	var forms = $('#listappsrvtrx');
        	var errorHandler = $('.errorHandler', forms);
        	
        	$("label.error").hide();
        	$(".error").removeClass("error");
        	
        	
        	forms.validate({
	            ignore: "",
	            rules: {
	            	ipserver:{
	            		required: true,
	            	}
	            },
	            messages:{
	            	ipserver: {
	            		required:"<strong>ERROR ! </strong> PILIH IP SERVER !!!",
	            	}
	            },
	            submitHandler: function (forms) {
	                errorHandler.hide();
	                forms.submit();
	            }, 
	            invalidHandler: function (event, validator) { //display error alert on form submit
	                errorHandler.show();
	                $('#dvLoading').hide();
	            },
	            
	        });   
        	
        	
        });
    }

	var Handelappserverpulsaform = function () {
        
        $('#updatesrv').on('click', function() {
        	$('#dvLoading').show();
        	
        	var form = $('#listappsrvpulsa');
        	var errorHandler = $('.errorHandler', form);
        	
        	$("label.error").hide();
        	$(".error").removeClass("error");
        	
	        form.validate({
	            ignore: "",
	            rules: {
	            	billerpulsa:{
	            		required: true,
	            	},
	            	url: {
	                    required: true,
	                }
	            },
	            messages:{
	            	billerpulsa: {
	            		required:"<strong>ERROR ! </strong> PILIH BILLER PULSA !!!",
	            	},
	            	url: {
	            		required:"<strong>ERROR ! </strong>  MASUKAN URL  !!!",
	            	}
	            },
	            submitHandler: function (form) {
	                errorHandler.hide();
	                form.submit();
	            }, 
	            invalidHandler: function (event, validator) { //display error alert on form submit
	                errorHandler.show();
	                $('#dvLoading').hide();
	            },
	        });   
        });
        
    }

   

    return {

        //main function to initiate template pages
        init: function () {
            if (jQuery.browser.msie && jQuery.browser.version.substr(0, 1) == 8) {
                isIE8 = true; // checkes for IE8 browser version
                $('.visible-ie8').show();
            }

            handleDeviceWidth(); // handles proper responsive features of the page
            handleSelectInput(); // handles bootstrap chosen dropdowns

            if (isMainPage) {
                handlKnobElements();
                /*handleDashboardCharts(); // handles plot charts for main page
                handleJQVMAP(); // handles vector maps for home page
                handleDashboardCalendar(); // handles full calendar for main page
                */
            } else {
            	/*
                handleCalendar(); // handles full calendars
                handlePortletSortable(); // handles portlet draggable sorting
                */
            }

            if (isMapPage) {
                handleAllJQVMAP(); // handles vector maps for interactive map page
            }

            handleScrollers(); // handles slim scrolling contents
            handleWidgetTools(); // handles portlet action bar functionality(refresh, configure, toggle, remove)
            handlePulsate(); // handles pulsate functionality on page elements
            handlePeity(); // handles pierty bar and line charts
            handleTooltip(); // handles bootstrap tooltips
            handlePopover(); // handles bootstrap popovers
            handleToggleButtons(); // handles form toogle buttons
            handleStyler(); // handles style customer tool
            handleMainMenu(); // handles main menu
            handleFixInputPlaceholderForIE(); // fixes/enables html5 placeholder attribute for IE9, IE8
            handleGoTop(); //handles scroll to top functionality in the footer
            handleAccordions();
            handleDateTimePickers(); //handles form timepickers
            handleColorPicker(); // handles form color pickers
            Handelftr();
            Handelrcn();
            Handelfcn();
            HandelSettlement();
            SearchBiller();
            HandelKereta();
            HandelPajak();
            HandelSyncMB();
            HandelFTRSA();
            HandelSPXSA();
            HandelGenerateFTRSa();
            handleCalendar();
            HandelSetCalender();
            handleWysihtml5();
            HandelFAQ();
            HandelUsr();
            Handelisopasrs();
            HandelSettlement();
	    HandelFTRBPJS();
            HandelFTPMitraTeknis();
            handleTables();
	    HandelErrorBook();
            HandelEmailMitra();
	    HandelUpdateBillerlog();
	    handleFTPMB();
	    Handelblocktrx();
	    Handelappserverform();
	    Handelappserverpulsaform();

            if (isMainPage) { // this is for demo purpose. you may remove handleIntro function for your project
                handleIntro();
            }
        },

        // wrapper function for page element pulsate
        pulsate: function (el, options) {
            var opt = jQuery.extend(options, {
                color: '#d12610', // set the color of the pulse
                reach: 15, // how far the pulse goes in px
                speed: 300, // how long one pulse takes in ms
                pause: 0, // how long the pause between pulses is in ms
                glow: false, // if the glow should be shown too
                repeat: 1, // will repeat forever if true, if given a number will repeat for that many times
                onHover: false // if true only pulsate if user hovers over the element
            });

            jQuery(el).pulsate(opt);
        },

        // wrapper function to scroll to an element
        scrollTo: function (el) {
            pos = el ? el.offset().top : 0;
            jQuery('html,body').animate({
                scrollTop: pos
            }, 'slow');
        },

        // wrapper function to  block element(indicate loading)
        blockUI: function (el, loaderOnTop) {
            lastBlockedUI = el;
            jQuery(el).block({
                message: '<img src="./assets/img/loading.gif" align="absmiddle">',
                css: {
                    border: 'none',
                    padding: '2px',
                    backgroundColor: 'none'
                },
                overlayCSS: {
                    backgroundColor: '#000',
                    opacity: 0.05,
                    cursor: 'wait'
                }
            });
        },

        // wrapper function to  un-block element(finish loading)
        unblockUI: function (el) {
            jQuery(el).unblock({
                onUnblock: function () {
                    jQuery(el).removeAttr("style");
                }
            });
        },

        // set main page
        setMainPage: function (flag) {
            isMainPage = flag;
        },

        // set map page
        setMapPage: function (flag) {
            isMapPage = flag;
        }

    };

}();


