// Pixlbox
// js media queries
// jsmediaqueries.js v1.1



// mobile navigation functions

// hide jquery effect elements - see jsmediaqueries for handling				   
$('a#mobileNavTrigger, a#toTop, a#close').hide();





// full page nav
function fullPageNav() {
	$('header nav a').fadeTo(500, 1);
	$('header nav a').on('touchmove', function(e) {e.preventDefault();}); // stop scroling on touch when nav active
	$('a#mobileNavTrigger').fadeTo(500, 0).hide();
	return false;
}
function closefullpagenav() {
	$("header nav a").not('.cart').stop( true, true )
	.delay(100).slideUp(300, 'easeOutQuad')
	.animate({ opacity: 0 },{ queue: false, duration: 200});
	$('a#mobileNavTrigger').fadeTo(500, 1);
	return false;
}

// slideDownNav nav
function slideDownNav() {
	$("header nav a").not('.cart')
	.stop( true, true )
	.css({opacity: 0})
	//.show()
	.delay(100).slideDown(300, 'easeOutQuad')
	.animate({ opacity: 1 },{ queue: false, duration: 750 });
	return false;
}



// begin enquire.js media queries

enquire



.register("screen and (max-width:900px)", {

    // OPTIONAL
    // If supplied, triggered when a media query matches.
    match : function() {
		$('a#mobileNavTrigger').stop( true, true ).fadeTo(750, 1.0);	
		$("header nav a").not('.cart').css('display','block').hide();

		$('a#mobileNavTrigger').click(function() {
			slideDownNav()
			$(this).hide();
			$('a#close').css({opacity: 1}).show();
		});
	
		$('a#close').click(function() {
			closefullpagenav();
			$(this).hide();
			$('a#mobileNavTrigger').css({opacity: 1}).show();
		});
		
		},      
                                
    // OPTIONAL
    // If supplied, triggered when the media query transitions 
    // *from a matched state to an unmatched state*.
    unmatch : function() {
		$('a#mobileNavTrigger, a#toTop, a#close').stop( true, true ).fadeTo(500, 0).hide();
		$("header nav a").not('.cart').css({opacity: 1}).show().css('display','inline-block');

		},    
    
    // OPTIONAL
    // If supplied, triggered once, when the handler is registered.
    setup : function() {
				
		},    
                                
    // OPTIONAL, defaults to false
    // If set to true, defers execution of the setup function 
    // until the first time the media query is matched
    deferSetup : true,
                                
    // OPTIONAL
    // If supplied, triggered when handler is unregistered. 
    // Place cleanup code here
    destroy : function() {
		
		}
      
})




















.register("screen and (min-width:100px)", {

    // OPTIONAL // If supplied, triggered when a media query matches.
    match : function() {

			function WayPoints() {
				$.waypoints.settings.scrollThrottle = 2;
				$('.showTop').waypoint(function (event, direction) {
						if (direction === 'down'){
							$('a#toTop').stop( true, true ).fadeTo(500, 1.0);
						} else {
							$('a#toTop').stop( true, true ).fadeTo(500, 0, function(){$('a#toTop').hide();});
						}
					})	
				}
			WayPoints();
		},      
                                
    // OPTIONAL // If supplied, triggered when the media query transitions  // *from a matched state to an unmatched state*.
    unmatch : function() {
		$('.showTop').waypoint('destroy');
		
		},    
    
    // OPTIONAL // If supplied, triggered once, when the handler is registered.
    setup : function() {
		},    
                                
    // OPTIONAL, defaults to false // If set to true, defers execution of the setup function  // until the first time the media query is matched
    deferSetup : true,
                                
    // OPTIONAL // If supplied, triggered when handler is unregistered. // Place cleanup code here
    destroy : function() {}
      
});









