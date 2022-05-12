// Pixlbox
// js media queries
// jsmediaqueries for owl carousel control

enquire

.register("screen and (min-width:400px)", {

    // OPTIONAL
    // If supplied, triggered when a media query matches.
    match : function() {		
		    $('body.home div#feature div.carousel-item').matchHeight();
			$('article.teasers a.teaserInfo').matchHeight();
			//$('body #container > footer section').matchHeight();
			
			$('article.gridlinks.panels-6 span.centerContent div.mh').matchHeight({byRow: false});
	},      
                                
    // OPTIONAL
    // If supplied, triggered when the media query transitions 
    // *from a matched state to an unmatched state*.
    unmatch : function() {
		    $('body.home div#feature div.carousel-item').matchHeight('destroy');
			$('article.teasers a.teaserInfo').matchHeight('destroy');
			//$('body #container > footer section').matchHeight('destroy');
			
			$('article.gridlinks.panels-6 span.centerContent div.mh').matchHeight('destroy');
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


















