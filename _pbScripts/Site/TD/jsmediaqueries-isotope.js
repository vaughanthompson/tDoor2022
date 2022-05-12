// Pixlbox
// js media queries
// jsmediaqueries.js - navigation and custom js effects

$(document).ready(function(){

});	



// begin enquire.js media queries
enquire

.register("screen and (min-width:900px)", {

    // OPTIONAL
    // If supplied, triggered when a media query matches.
    match : function() {
		
		// init Isotope
		var $grid = $('.gridlinks.iso').isotope({
		  // options
		  percentPosition: true,
		  itemSelector: '.gridsquare',
		  layoutMode: 'packery',
		  masonry: {
			columnWidth: '.gridsquare'
		  }
		});
		// layout Isotope after each image loads
		$grid.imagesLoaded().progress( function() {
		  $grid.isotope('layout');
		});
		
		
		

		},      
                                
    // OPTIONAL
    // If supplied, triggered when the media query transitions 
    // *from a matched state to an unmatched state*.
    unmatch : function() {
		$('.gridlinks.iso').isotope('destroy');
		},    
    
    // OPTIONAL
    // If supplied, triggered once, when the handler is registered.
    setup : function() {
		
		},    
                                
    // OPTIONAL, defaults to false
    // If set to true, defers execution of the setup function 
    // until the first time the media query is matched
    deferSetup : false,
                                
    // OPTIONAL
    // If supplied, triggered when handler is unregistered. 
    // Place cleanup code here
    destroy : function() {
		
		}
      
})











