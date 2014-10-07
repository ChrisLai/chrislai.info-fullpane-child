;// Themify Theme Scripts - http://themify.me/

// Initialize object literals
var AutoColumnClass = {},
	Themify_Carousel_Tools = {};

/////////////////////////////////////////////
// jQuery functions					
/////////////////////////////////////////////
(function($){

var isFullPageScroll = 'undefined' !== typeof $.fn.fullpage && themifyScript.fullPageScroll ? true : false;

Themify_Carousel_Tools = {

	intervals: [],

	highlight: function( item ) {
		item.addClass('current');
	},
	unhighlight: function($context) {
		$('li', $context).removeClass('current');
	},

	timer: function($timer, intervalID, timeout, step) {
		var progress = 0,
			increment = 0;

		this.resetTimer($timer, intervalID);

		this.intervals[intervalID] = setInterval(function() {
			progress += step;
			increment = ( progress * 100 ) / timeout;
			$timer.css('width', increment + '%');
		}, step);
	},

	resetTimer: function($timer, intervalID) {
		if ( null !== this.intervals[intervalID] ) {
			clearInterval( this.intervals[intervalID] );
		}
		$timer.width('width', '0%');
	},

	getCenter: function($context) {
		var visible = $context.triggerHandler('currentVisible');
		return Math.floor(visible.length / 2 );
	},

	getDirection: function($context, $element) {
		var visible = $context.triggerHandler( 'currentVisible' ),
			center = Math.floor(visible.length / 2 ),
			index = $element.index();
		if ( index >= center ) {
			return 'next';
		}
		return 'prev';
	},

	adjustCarousel: function($context) {
		if ( $context.closest('.twg-wrap' ).length > 0 ) {
			var visible = $context.triggerHandler('currentVisible').length,
				liWidth = $('li:first-child', $context).width();

			$context.triggerHandler('configuration', { width: ''+liWidth * visible, responsive: false });
			$context.parent().css('width', ( liWidth * visible ) + 'px');
		}
	}
};

// Initialize carousels //////////////////////////////
function createCarousel(obj) {
	obj.each(function() {
		var $this = $(this),
			autoSpeed = 'off' != $this.data('autoplay') ? parseInt($this.data('autoplay'), 10) : 0,
			sliderArgs = {
				responsive : true,
				circular :  !!('yes' == $this.data('wrap')),
				infinite : true,
				height: 'auto',
				swipe: true,
				scroll : {
					items : $this.data('scroll') ? parseInt( $this.data('scroll'), 10 ) : 1,
					fx : $this.data('effect'),
					duration : parseInt($this.data('speed')),
					onBefore : function(items) {
						var $twgWrap = $this.closest('.twg-wrap'),
							$timer = $('.timer-bar', $twgWrap);
						if ( $timer.length > 0 ) {
							Themify_Carousel_Tools.timer($timer, $this.data('id'), autoSpeed, 20);
							Themify_Carousel_Tools.unhighlight( $this );
						}
					},
					onAfter : function(items) {
						var newItems = items.items.visible;
						var $twgWrap = $this.closest('.twg-wrap' );
						if ( $twgWrap.length > 0 ) {
							var $center = newItems.filter(':eq(' + Themify_Carousel_Tools.getCenter($this) + ')');
							$('.twg-link', $center).trigger(themifyScript.galleryEvent);
							Themify_Carousel_Tools.highlight( $center );
						}
					}
				},
				auto : {
					play : !!('off' != $this.data('autoplay')),
					timeoutDuration : autoSpeed
				},
				items : {
					visible : {
						min : 1,
						max : $this.data('visible') ? parseInt( $this.data('visible'), 10 ) : 1
					},
					width : $this.data('width') ? parseInt( $this.data('width'), 10 ) : 222
				},
				prev : {
					button: 'yes' == $this.data('slidernav') ? '#' + $this.data('id') + ' .carousel-prev' : null
				},
				next : {
					button: 'yes' == $this.data('slidernav') ? '#' + $this.data('id') + ' .carousel-next' : null
				},
				pagination : {
					container : 'yes' == $this.data('pager') ? '#' + $this.data('id') + ' .carousel-pager' : null,
					anchorBuilder: function() {
						if ( $this.closest('.testimonial.slider').length > 0 ) {
							var thumb = $('.testimonial-post', this).data('thumb'),
								thumbw = $('.testimonial-post', this).data('thumbw'),
								thumbh = $('.testimonial-post', this).data('thumbh');
							return '<span><a href="#"><img src="' + thumb + '" width="' + thumbw + '" height="' + thumbh + '" /></a></span>';
						}
						if ( ( $this.closest('.portfolio-multiple.slider').length > 0 ) || ( $this.closest('.team-multiple.slider').length > 0 ) ) {
							return '<a href="#"></a>';
						}
						return false;
					}
				},
				onCreate : function() {
					var $slideshowWrap = $this.closest('.slideshow-wrap' ),
						$teamSliderWrap = $this.closest('.team-multiple.slider' ),
						$portfolioSliderWrap = $this.closest('.portfolio-multiple.slider' ),
						$testimonialSlider = $this.closest('.testimonial.slider' ),
						$twgWrap = $this.closest('.twg-wrap');

					$this.closest('.slider').prevAll('.slideshow-slider-loader').first().remove(); // remove slider loader

					$slideshowWrap.css({
						'visibility' : 'visible',
						'height' : 'auto'
					}).addClass('carousel-ready');

					if( $testimonialSlider.length > 0 ) {
						$testimonialSlider.css({
							'visibility' : 'visible',
							'height' : 'auto'
						});
						$('.carousel-pager', $slideshowWrap).addClass('testimonial-pager');
					}

					if ( $teamSliderWrap.length > 0 ) {
						$teamSliderWrap.css({
							'visibility' : 'visible',
							'height' : 'auto'
						});
						$('.carousel-prev, .carousel-next', $teamSliderWrap ).text('');
					}
					if ( $portfolioSliderWrap.length > 0 ) {
						$portfolioSliderWrap.css({
							'visibility' : 'visible',
							'height' : 'auto'
						});
						$('.carousel-prev, .carousel-next', $portfolioSliderWrap ).text('');
					}

					if ( 'no' == $this.data('slidernav') ) {
						$('.carousel-prev', $slideshowWrap).remove();
						$('.carousel-next', $slideshowWrap).remove();
					}

					if ( $twgWrap.length > 0 ) {

						var center = Themify_Carousel_Tools.getCenter($this),
							$center = $('li', $this).filter(':eq(' + center + ')');

						Themify_Carousel_Tools.highlight( $center );

						$this.trigger( 'slideTo', [ -center, { duration: 0 } ] );

						$('.carousel-pager', $twgWrap).remove();
						$('.carousel-prev', $twgWrap).addClass('gallery-slider-prev').text('');
						$('.carousel-next', $twgWrap).addClass('gallery-slider-next').text('');
					}

					$(window).resize();

					Themify_Carousel_Tools.adjustCarousel($this);
				}
			};

		// Fix unresponsive js script when there are only one slider item
		if ( $this.children().length < 2 ) {
			sliderArgs.onCreate();
			return true; // skip initialize carousel on this element
		}

		$this.carouFredSel( sliderArgs ).find('li').on(themifyScript.galleryEvent, function(){
			if ( $this.closest('.twg-wrap').length > 0 ) {
				var $thisli = $(this);
				$('li', $this).removeClass('current');
				$thisli.addClass('current');
				$thisli.trigger('slideTo', [
					$thisli,
					- Themify_Carousel_Tools.getCenter($this),
					false,
					{
						items: 1,
						duration: 300,
						onBefore : function(items) {
							var $twgWrap = $this.closest('.twg-wrap' ),
								$timer = $('.timer-bar', $twgWrap);
							if ( $timer.length > 0 ) {
								Themify_Carousel_Tools.timer($timer, $this.data('id'), autoSpeed, 20);
								Themify_Carousel_Tools.unhighlight( $this );
							}
						},
						onAfter	: function(items) { }
					},
					null,
					Themify_Carousel_Tools.getDirection($this, $thisli)]
				);
			}
		});

		/////////////////////////////////////////////
		// Resize thumbnail strip on window resize
		/////////////////////////////////////////////
		$(window).on('debouncedresize', Themify_Carousel_Tools.adjustCarousel($this) );

	});
}

// Test if touch event exists //////////////////////////////
function is_touch_device() {
	return 'true' == themifyScript.isTouch;
}

// Apply auto column position element class /////////////////////////
AutoColumnClass = {
	init: function() {
		this.setup();
	},
	setup: function() {
		// shortcode columns add class
		$('.col2-1.first, .col3-1.first, .col3-2.first, .col4-1.first, .col4-2.first, .col4-3.first', $('#body')).each(function(){
			var $this = $(this);
			if($this.hasClass('col2-1')) {
				$this.next('.col2-1').addClass('last');
				$this.next('.col4-1').addClass('third').next('.col4-1').addClass('last');
			} else if($this.hasClass('col3-1')) {
				$this.next('.col3-1').addClass('second').next('.col3-1').addClass('last');
				$this.next('.col3-2').addClass('last');
			} else if($this.hasClass('col3-2')) {
				$this.next('.col3-1').addClass('last');
			} else if($this.hasClass('col4-1')) {
				$this.next('.col4-1').addClass('second').next('.col4-1').addClass('third').next('.col4-1').addClass('last');
				$this.next('.col4-2').addClass('second');
			} else if($this.hasClass('col4-2')) {
				$this.next('.col4-2').addClass('last');
				$this.next('.col4-1').addClass('third').next('.col4-1').addClass('last');
			} else if($this.hasClass('col4-3')) {
				$this.next('.col4-1').addClass('last');
			}
		});
		var col_nums = 1;
		$('.col-full').each(function(){
			var $this = $(this);
			if( col_nums % 2 == 0) {
				$this.addClass('animate-last');
			} else {
				$this.addClass('animate-first');
			}
			col_nums += 1;
		});
	}
};

// Scroll to Element //////////////////////////////
function themeScrollTo(offset) {
	$('body,html').animate({ scrollTop: offset }, 800);
}

// DOCUMENT READY
$(document).ready(function() {

	var $window = $(window),
		$body = $('body'),
		$charts = $('.chart', $body),
		$skills = $('.progress-bar', $body);

	//////////////////////
	// Slide menu
	//////////////////////
	if ( 'undefined' !== typeof $.fn.sidr ) {
		var RefreshMenuWrap = function(method){
			if(navigator.userAgent.match(/iPhone/i)) {
				var $this = $('#headerwrap');
				if(method == 'close'){
					$this.addClass('clear-left');
				} else {
					$this.removeClass('clear-left');
				}
			}
		};
		$('#menu-icon').sidr({
			name: 'slide-nav',
			side: 'right',
			onOpen: function(){
				RefreshMenuWrap('open');
			},
			onClose: function(){
				RefreshMenuWrap('close')
			}
		});
		$('#menu-icon-close').on('click', function(e){
			e.preventDefault();
			$.sidr('close', 'slide-nav', function(){
				RefreshMenuWrap('close');
			});
		});
	}

	/////////////////////////////////////////////
	// Chart Initialization
	/////////////////////////////////////////////
	if( 'undefined' !== typeof $.fn.easyPieChart ) {
		$.each(themifyScript.chart, function(index, value){
			if( 'false' == value || 'true' == value ){
				themifyScript.chart[index] = 'false'!=value;
			} else if( parseInt(value) ){
				themifyScript.chart[index] = parseInt(value);
			} else if( parseFloat(value) ){
				themifyScript.chart[index] = parseFloat(value);
			}
		});

		for (var i=0; i < $charts.length; i++){
			var $self = $charts.eq(i),
				barColor = $self.data('color'),
				percent = $self.data('percent');
			if( 'undefined' !== typeof barColor ) {
				themifyScript.chart.barColor = '#' + barColor.toString().replace('#', '');
			}
			$self.easyPieChart( themifyScript.chart );
			$self.data('easyPieChart').update(0);
		}

		if ( isFullPageScroll && $body.hasClass('query-section') && themifyScript.scrollingEffectOn ) {
			$body.on('themify_onepage_afterload themify_onepage_after_render', function(event, $section, section_id){
				var chartLength = $section.find('.chart').length;
				for (var i=0; i < chartLength; i++){
					var $self = $section.find('.chart').eq(i),
					percent = $self.data('percent');
					$self.data('easyPieChart').update(percent);
				}
			});
		} else {
			for (var i=0; i < $charts.length; i++){
				var $self = $charts.eq(i),
				percent = $self.data('percent');
				if( 'undefined' !== typeof $.waypoints && themifyScript.scrollingEffectOn ) {
					$charts.eq(i).waypoint(function(direction){
						$(this).data('easyPieChart').update(percent);
					}, {offset: '80%'});
				} else {
					$self.data('easyPieChart').update(percent);	
				}
			}
		}
	}

	/////////////////////////////////////////////
	// Skillset Animation
	/////////////////////////////////////////////
	for (var i = 0; i < $skills.length; i++) {
		var $self = $('span', $skills.eq(i));
		$self.width('0%');
	}
	if ( isFullPageScroll && $body.hasClass('query-section') && themifyScript.scrollingEffectOn ){
		$body.on('themify_onepage_afterload themify_onepage_after_render', function(event, $section, section_id){
			// Skillset
			var $progressBars = $section.find('.progress-bar');
			if( $progressBars.length > 0 ) {
				$progressBars.find('span').each(function(){
					var $bar = $(this),
						percent = $bar.data('percent');
					if( 'undefined' !== typeof percent ) {
						$bar.delay(200).animate({
							width: percent
						}, 800);
					}
				});
			}
		});
	} else {
		for (var i = 0; i < $skills.length; i++) {
			var percent = $('span', $skills.eq(i)).data('percent');
			if( 'undefined' !== typeof $.waypoints ){
				$skills.eq(i).waypoint(function() {
					$('.progress-bar').find('span').each(function(){
						var $bar = $(this),
							percent = $bar.data('percent');
						if( 'undefined' !== typeof percent ) {
							$bar.delay(200).animate({
								width: percent
							}, 800);
						}
					});
				}, { offset: '80%' });
			} else {
				$('span', $skills.eq(i)).width(percent);
			}
		}
	}

	/////////////////////////////////////////////
	// Transition Animation ( FlyIn or FadeIn )
	/////////////////////////////////////////////
	if( themifyScript.scrollingEffectOn ) {
		AutoColumnClass.init(); // apply auto column class
		// Global Animation
		$.each(themifyScript.transitionSetup.selectors, function(key, val){
			$(val).addClass(themifyScript.transitionSetup.effect);
		});
		// re-init the animation class setup
		if ( typeof ThemifyBuilderModuleJs.animationOnScroll !== 'undefined' ) {
			ThemifyBuilderModuleJs.animationOnScroll();
		}
		if ( isFullPageScroll && $body.hasClass('query-section') ){
			var runAnimation = function( $section, section_id ){
				var $sections = $('#loops-wrapper').children().not('.active'); 
				
				if ( typeof ThemifyBuilderModuleJs !== 'undefined' && typeof ThemifyBuilderModuleJs.wow.scrollHandler() === 'boolean' ) {
					ThemifyBuilderModuleJs.wow.scrollHandler();
				}

				if($section.length > 0){
					// show animation
					$section.find('.section-title').addClass('animated fadeInLeftBig')
					.end().find('.section-content').addClass('animated flyInBottom');
				}
			};
			$body.on('themify_onepage_afterload themify_onepage_after_render', function(event, $section, section_id){
				runAnimation($section, section_id);
			});
		} else {
			if( 'undefined' !== typeof $.waypoints ){
				$('.section-post', $('#loops-wrapper')).waypoint(function() {
					$(this).find('.section-title').addClass('animated fadeInLeftBig')
					.end().find('.section-content').addClass('animated flyInBottom');
				}, { offset: '50%' });
			}
		}
	}


	/////////////////////////////////////////////
	// Scroll to top
	/////////////////////////////////////////////
	$('.back-top a').on('click', function(e){
		e.preventDefault();
		themeScrollTo(0);
	});

	// anchor scrollTo
	$('#body').on('click', 'a[href*=#]', function(e){
		var url = $(this).prop('href'),
			idx = url.indexOf('#'),
			hash = idx != -1 ? url.substring(idx+1) : '',
			offset = 0;

		if(hash.length > 1 && $('#' + hash).length > 0 && hash !== 'header') {
			offset = $('#' + hash).offset().top;
			// If header is set to fixed, calculate this
			if ( $('.fixed-header' ).length > 0 ) {
				offset += $( '#headerwrap' ).outerHeight();
			}

			if ( isFullPageScroll && $('body').hasClass('query-section') ){
				var index = $('#' + hash).index() + 1;
				$.fn.fullpage.moveTo(index);
			} else {
				themeScrollTo(offset);
			}
			e.preventDefault();
		}
	});

	/////////////////////////////////////////////
	// Toggle main nav on mobile
	/////////////////////////////////////////////
	$body.on('click', '#menu-icon', function(e){
		e.preventDefault();
		//$('#main-nav').fadeToggle();
		$('#top-nav', $('#headerwrap')).hide();
		$(this).toggleClass('active');
	});

	/////////////////////////////////////////////
	// Add class "first" to first elements
	/////////////////////////////////////////////
	$('.highlight-post:odd').addClass('odd');

	/////////////////////////////////////////////
	// Fullscreen bg
	/////////////////////////////////////////////
	if ( 'undefined' !== typeof $.fn.backstretch ) {
		var $sectionPost = $('.section-post');
		$sectionPost.each(function() {
			var bg = $(this).data('bg');
			if ( 'undefined' !== typeof bg ) {
				if ($(this).hasClass('fullcover')) {
					$(this).backstretch(bg);
				} else {
					$(this).css('background-image', 'url(' + bg + ')');
				}
			}
		});
		$window.on('backstretch.show', function(e, instance) {
			instance.$container.css('z-index', '');
		})
		.on('debouncedresize', function(){
			$sectionPost.each(function(){
				if($(this).hasClass('fullcover')){
					var instance = $(this).data("backstretch");
					if('undefined' !== typeof instance) instance.resize();
				}
			});
		});
	}

	/////////////////////////////////////////////
	// Single Gallery Post Type
	/////////////////////////////////////////////
	if ( $('body.single-gallery').length > 0 && 'undefined' !== typeof $.fn.masonry ) {
		$('.gallery-type-gallery').masonry({
			itemSelector: '.item',
			isFitWidth: true,
			isAnimated: !Modernizr.csstransitions
		}).imagesLoaded(function() {
			$(this).masonry('reload');
		});
	}

	/////////////////////////////////////////////
	// One Page Scroll
	/////////////////////////////////////////////
	if ( isFullPageScroll && $body.hasClass('query-section') ) {
		var anchors = [];
		$('#loops-wrapper').fullpage({
			resize: false,
			sectionSelector: '.section-post',
			paddingBottom: '78px',
			scrollOverflow: true,
			navigation: true,
			afterRender: function(){
				var section_id = $('.section-post.active', $('#loops-wrapper')).prop('id'),
					$section = $('#' + section_id);

				$('.section_loader').hide();

				$body.trigger('themify_onepage_after_render', [ $section, section_id ]);
			},
			afterLoad: function(anchorLink, index){
				var section_id = $('.section-post.active', $('#loops-wrapper')).prop('id'),
					$section = $('#' + section_id);
				
				if($('a[href=#'+section_id+']').length > 0){
					$('a[href=#'+section_id+']').closest('li').addClass('current_page_item').siblings().removeClass('current_page_item');
				}

				$('body').trigger( 'themify_onepage_afterload', [ $section, section_id ] );
			}
		});
	}

	$('#main-nav').on('click', 'a[href*=#]', function(e){
		var section_id = $(this).prop('hash');
		if($(section_id).length > 0){
			e.preventDefault();
			if( isFullPageScroll && $('body').hasClass('query-section') ) {
				var index_el = $(section_id).index('.section-post') + 1;
				$.fn.fullpage.moveTo(index_el);
			} else {
				var offset = $(section_id).offset().top;
				themeScrollTo(offset);
			}
		}

		// close mobile menu
		if($window.width() <= 1200 && $('#main-nav').is(':visible')){
			$('#menu-icon-close').trigger('click');
		}
	});

	/////////////////////////////////////////////
	// Portfolio Expander
	/////////////////////////////////////////////
	if( 'undefined' !== typeof $.fn.themifyPortfolioExpander ) {
		$body.themifyPortfolioExpander({
			itemContainer: '.shortcode.portfolio',
			animeasing: 'easeInQuart',
			animspeed: 500
		});
	}

	/////////////////////////////////////////////
	// Footer Toggle
	/////////////////////////////////////////////
	$('#footer-tab').on('click', 'a', function(e){
		e.preventDefault();
		$('#footerwrap-inner').slideToggle();
		$('#footerwrap').toggleClass('expanded');
	});

	/////////////////////////////////////////////
	// Fullcover Gallery
	/////////////////////////////////////////////
	function fullCoverGallery() {
		var height = parseInt($('#headerwrap').height()),
			areaHeight = $window.height()+5,
			fullPageOn = isFullPageScroll && $body.hasClass('query-section') ? true : false,
			$contexts = $('.section-post.gallery, .twg-slider');

		$contexts.find('.gallery-image-holder').each(function(){
			var $self = $(this),
				thisAreaHeight = areaHeight,
				$section = $self.closest('.section-post'),
				$sectionTitle = $section.find('.section-title'),
				$adminBar = $('#wpadminbar');
			// If this gallery is placed inside a section
			if ( $section.length > 0 && $sectionTitle.length > 0 ) {
				thisAreaHeight -= $sectionTitle.outerHeight(true);
			}
			if ( $adminBar.length > 0 ) {
				thisAreaHeight -= $adminBar.outerHeight();
			}
			$self.css( { minHeight: thisAreaHeight + 'px' } );
		});
		if ( fullPageOn ) {
			$contexts.find('.gallery-slider-wrap').css( { bottom: height } );
		} else {
			$contexts.find('.gallery-slider-wrap').css( { bottom: '' } );
		}
	}
	fullCoverGallery();
	$window.on('debouncedresize', fullCoverGallery);

	$window.on('debouncedresize', function(){
		$('#menu-icon-close').trigger('click');
	});

	$body.on('touchstart touchmove touchend mousewheel DOMMouseScroll', '#main-nav, #portfolio-full', function(e) {
		e.stopPropagation();
	});
	
	/////////////////////////////////////////////
	// Lightbox / Fullscreen initialization
	/////////////////////////////////////////////
	if('undefined' !== typeof ThemifyGallery) {
		ThemifyGallery.init({'context': $(themifyScript.lightboxContext)});
	}

});

// WINDOW LOAD
$(window).load(function() {
	// scrolling nav
	if ( 'undefined' !== typeof(skrollr) && 'undefined' !== typeof $.fn.themifySectionHighlight && themifyScript.scrollingEffectOn ) {
		$('body').themifySectionHighlight();
	}

	/////////////////////////////////////////////
	// Carousel initialization
	/////////////////////////////////////////////
	if( 'undefined' !== typeof $.fn.carouFredSel ) {
		createCarousel($('.slideshow'));
	}

	/////////////////////////////////////////////
	// Initialize WordPress Gallery in Section
	/////////////////////////////////////////////
	if ( 'undefined' !== typeof $.fn.ThemifyWideGallery ) {
		$('.twg-wrap').ThemifyWideGallery({
			speed: parseInt(themifyScript.galleryFadeSpeed, 10),
			event: themifyScript.galleryEvent,
			ajax_url: themifyScript.ajax_url,
			ajax_nonce: themifyScript.ajax_nonce,
			networkError: themifyScript.networkError,
			termSeparator: themifyScript.termSeparator
		});
	}

	// hide section loader
	if ( ! isFullPageScroll && $('.section_loader').length > 0 ) {
		$('.section_loader').hide(); 
	}

});

})(jQuery);