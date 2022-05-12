// Only process if there is more than 1 carousel item:
var itemCount = $("div.carousel-item").length;
if (itemCount > 1) {

// Pixlbox
// js media queries
// jsmediaqueries for owl carousel control

enquire

.register("screen and (min-height: 200px)", {

    // OPTIONAL
    // If supplied, triggered when a media query matches.
    match : function() {
		$("#feature.owl-carousel").owlCarousel({
			items:1,
			loop:true,
			autoplay:false,
			autoplayTimeout:4000,
			autoplayHoverPause:false,
			//animateOut: 'easeOutQuad',
			//animateIn: 'easeInQuad',
			touchDrag:true,
			mouseDrag:false,
			stopOnHover:false,
			dots:false,
			navText:['<i class="fa fa-fw">&#xf092;</i>','<i class="fa fa-fw">&#xf093;</i>'],
			nav:true,
			navContainer: '#customNav',
		    dotsContainer: '#customDots',
			smartSpeed:1000
		});
		

	},      
                                
    // OPTIONAL
    // If supplied, triggered when the media query transitions 
    // *from a matched state to an unmatched state*.
    unmatch : function() {
		$('#feature.owl-carousel').trigger('destroy.owl.carousel').removeClass('owl-loaded');
		$('#feature.owl-carousel').find('.owl-stage-outer').children().unwrap();
		
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









}