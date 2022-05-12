// Pixlbox
// JQuery basic functions and effects.
// common.js v1.1


$(document).ready(function(){
				   
						   
		// for in-page scrolling to named anchors e.g. top link
		//$.localScroll.defaults.axis = 'y';
			  $.localScroll({
					target: 'body',
					queue: false,
					hash: false,
					duration: 500,
					easing: 'easeOutQuad'
		 });
			
		// zebra strip for mobile view of feature items	
		$("div.carousel-item:odd").addClass("odd");
		$("div.carousel-item:even").addClass("even");
			
			
		
	
	
	
	
		// for prettySocial sharing
		var metatitle = $('meta[property=og\\:title]').attr('content');
		var metadesc = $('meta[property=og\\:description]').attr('content');
		var metaname = $('meta[property=og\\:site_name]').attr('content');
		var metaurl = $('meta[property=og\\:url]').attr('content');
		var metaimage = $('meta[property=og\\:image]').attr('content');
		$('a.prettySocial').attr({'data-title': metatitle, 'data-description': metadesc, 'data-site_name': metaname, 'data-url': metaurl, 'data-media': metaimage});
		$('a.prettySocial.fa-twitter, a.prettySocial.fa-linkedin').attr('data-via', metaname);
		$('.prettySocial').prettySocial();


});		  