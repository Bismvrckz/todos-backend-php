var Login = function () {
    var runlogin = function () {
    	$('#dvLoading').hide();
    	var form = $('#loginform');
        var errorHandler = $('.errorHandler', form);
        form.validate({
        	errorElement: "span", // contain the error msg in a span tag
            errorClass: 'help-block',
            errorPlacement: function (error, element) { // render error placement for each input type
                 error.insertAfter(element);
            },
            ignore: "",
            rules: {
            	usr: {
                    required: true,
                }, 
                passwd:{
                	required: true,
                },
                cha:{
                	required: true,
                }
            },
            messages:{
            	usr: {
            		required:"<strong>ERROR ! </strong> MASUKAN USER NAME !!!",
            	},
            	passwd: {
            		required:"<strong>ERROR ! </strong> MASUKAN PASSWORD !!!",
            	},
            	cha:{
            		required:"<strong>ERROR ! </strong> MASUKAN CHAPTCHA !!!",
            	}
            	
            },
            submitHandler: function (form) {
                errorHandler.hide();
                form.submit();
                $('#dvLoading').show();
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
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
    };
    
    
    return {
        init: function () {
        	runlogin();
        }
    };
}();