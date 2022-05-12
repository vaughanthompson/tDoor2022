// JavaScript Document


	$(document).ready(function(){
		
			
		$(document).on({
		mouseenter: function () {
			//stuff to do on mouse enter
			$(this).removeClass('grayscale');
		},
		mouseleave: function () {
			//stuff to do on mouse leave
			$(this).addClass('grayscale');
		}
		}, "div.square"); //pass the element as an argument to .on
				
	});	

