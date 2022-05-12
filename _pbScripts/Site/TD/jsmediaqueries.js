
$(window).ready(function(){                   
// push carousel down by height of fixed header 
var mastheadHeight = $('#mobileHeader').outerHeight();
$("#navSpcr").css('height',mastheadHeight + 'px');
}); 


$(window).resize(function(){
// push carousel down by height of fixed header 
var mastheadHeight = $('#mobileHeader').outerHeight();
$("#navSpcr").css('height',mastheadHeight + 'px');
}); 






// Pixlbox
// js media queries
// jsmediaqueries.js - navigation and custom js effects
$(document).ready(function(){

    	
$("header nav a:odd").addClass("odd");
$("header nav a:even").addClass("even");


$("nav.collapsible > a").hide();

$("#close-1").hide();
$('#expand-1').click(function(){
    $(this).hide();
    $('#close-1').show();
    $('nav.collapsible > a').show();
    return false;
}); 

$('#close-1').click(function(){
    $(this).hide();
    $('#expand-1').show();
    $('nav.collapsible > a').hide();
    return false;
}); 


$('#navMenu').click(function(){
   $('#asideMenu').css('display','flex');
    $(this).hide();
    $('#navClose').show();
    $('#navUser').show();
    return false;
}); 

$('#navClose').click(function(){
   $('#asideMenu').hide();
    $(this).hide();
    $('#navUser, #navMenu').show();
    return false;
}); 



});	






// mobile navigation functions
// full page nav
function fullPageNav() {
	$('nav#mobileNavigation').fadeTo(500, 1);
	$('nav#mobileNavigation').on('touchmove', function(e) {e.preventDefault();}); // stop scroling on touch when nav active
	$('a#mobileNavTrigger').fadeTo(500, 0).hide();
	return false;
}













// begin enquire.js media queries
enquire

.register("screen and (max-width:1100px)", {

    // OPTIONAL
    // If supplied, triggered when a media query matches.
    match : function() {
	
		

        $(window).ready(function(){                   
        var mastheadHeight = $('#mobileHeader').outerHeight();
        $("#asideMenu").css('marginTop',mastheadHeight + 'px');
        }); 


        $(window).resize(function(){
        var mastheadHeight = $('#mobileHeader').outerHeight();
        $("#asideMenu").css('marginTop',mastheadHeight + 'px');
        }); 


		}
      
})


.register("screen and (min-width:1100px)", {

    // OPTIONAL
    // If supplied, triggered when a media query matches.
    match : function() {

        $(window).ready(function(){                   
        $("#asideMenu").css('marginTop',0);
        }); 


        $(window).resize(function(){
        $("#asideMenu").css('marginTop',0);
        }); 


        }
      
})









.register("screen and (min-width:100px)", {

    // OPTIONAL // If supplied, triggered when a media query matches.
    match : function() {

			function WayPoints() {
				$.waypoints.settings.scrollThrottle = 2;
				$('.showTop').waypoint(function (event, direction) {
						if (direction === 'down'){
							$('a#toTop').stop( true, true ).show().css({opacity: 1, display: 'inline-block' });
						} else {
							$('a#toTop').stop( true, true ).hide();
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









