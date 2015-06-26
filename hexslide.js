// This function will target a particular target, using no delegation ( because it needs to be recalled each time ).
// When the plugin is initialized the plugin will

var _G = _G ? _G : false;
(function( $, window, document, undefined ){
	if ( !_G ) {
		// Users without this super global. We create it now.
		_G = {};
		_G.preserve = {};
		_G.variable = {};
	}

	_G.variable.last_slide_id = 0;
	_G.preserve.slide_done = _G.preserve.slide_done ? true : false;
	var timers = [],
		slideshowImgs = [],
		slide_options = {};
		// These must be kept outside the cope of the plugin, so they are not reset each time an instance is created. They are still private to the window instance

	$.fn.hexSlide = function( options ){
		var img,
			dummy,
			container,
			$container,
			listArray = this.filter(function(){
				return $(this).data("slideshow-src")
			}),
			lastID,
			width,
			currentSlides,
			height;

		lastID = _G.variable.last_slide_id ? _G.variable.last_slide_id : 0;
		for ( var i = 0; i < listArray.length; i++ ) {
			var options = $.extend(true, {}, $.fn.hexSlide.defaults, options);
			// This instances settings should be stored with this slide so that other instances can access them too.
			container = listArray[i];
			$container = $(container);

			var item = i+lastID;
			slide_options[item] = options;
			// Use ITEM so we dont overwrite other settings and so the index matches the ID number.
			width = $container.outerWidth();
			height = $container.outerHeight();

			dummy = $("<div></div>", {
				id: "hexslide-" + item + "-container",
				class: "hexslide"
			});

			dummy.width( options.width ? options.width : width )
			dummy.height( options.height ? options.height : height )
			dummy.css({
				"max-height": ( options.maxheight ) ? options.maxheight : "",
				"max-width": ( options.maxwidth ) ? options.maxwidth : "",
				"min-height": ( options.minheight ) ? options.minheight : "",
				"min-width": ( options.minwidth ) ? options.minwidth : "",
			})

			if ( options.additionalClass.container ) {
				dummy.addClass( options.additionalClass.container );
			}

			if ( options.additionalCSS.container ) {
				dummy.css( options.additionalCSS.container );
			}

			// Add a class to be used by event listeners. This indicates the slideshow should be paused when a user hovers on it.
			dummy.addClass("hexslide-hover");
			currentSlides = $("<div></div>", {
				"class": "hexslide-slide-container"
			});
			slideshowImgs[item] = $container.data("slideshow-src").split("|");
			// Compile list of static steps.
			var temp_slides = [];
			temp_slides[0] = $container.attr('src');
			var temp_imgs = [];
			temp_imgs = $container.data("slideshow-src").split("|");
			for ( var p = 0; p < temp_imgs.length; p++ ) {
				temp_slides.push( temp_imgs[p] );
			}
			createGUI( temp_slides );

			img = $("<div></div>", {
				class: "slide",
				css: {
					"background-image": "url("+ $container.attr('src') +")"
				},
				"data-hexslide-id": 0
			}).appendTo( currentSlides );

			if ( options.additionalClass.slide ) {
				img.addClass( options.additionalClass.slide );
			}

			if ( options.additionalCSS.slide ) {
				img.css( options.additionalCSS.slide );
			}
			var d = 1;
			for ( var index = 0; index < slideshowImgs[item].length; index++ ) {
				img = $("<div></div>", {
					class: "slide",
					css: {
						"background-image": "url(" + slideshowImgs[item][index] + ")"
					},
					"data-hexslide-id": d
				}).appendTo( currentSlides );
				if ( options.additionalClass.slide ) {
					img.addClass( options.additionalClass.slide );
				}
				if ( options.additionalCSS.slide ) {
					img.css( options.additionalCSS.slide );
				}
				d++;
			}
			currentSlides.appendTo( dummy );
			$container.replaceWith( dummy );
			$("#hexslide-"+item+"-container").children(".hexslide-slide-container").children(".slide:gt(0)").hide();
			// Container done, now adjust stuff!
			lastID++;
			_G.variable.last_slide_id = lastID;
			if ( typeof options.callback.start == "function" ) {
				options.callback.start();
			}
			start( item );
		}

		function start( i ) {
			var $slideshow;
			$slideshow = $("#hexslide-" + i + "-container");
			if ( !options.autoPlay ) {
				return;
			}
			if (timers[i]) {
				// Timer already set, clear it just incase it is still running.
				clearInterval( timers[i] );
			}
			timers[i] = setInterval(function(){
				// Emulate a click on the next button
				nextSlide.call( $slideshow.find(".hexslide-slide-container"), true );
			}, options.interval)
		}

		function stop( i ) {
			clearTimeout(timers[i]);
		}

		function createGUI( id ) {
			if ( options.navigation ) {
				var nextBtn, prevBtn, nextTxt, prevTxt, controls;
				controls = $("<div></div>", {
					class: "hexslide-control-container"
				});
				nextBtn = $("<div></div>", {
					class: "slide-btn right",
					"data-slide-direction": "forward"
				});
				prevBtn = $("<div></div>", {
					class: "slide-btn left",
					"data-slide-direction":"backward"
				});
				nextTxt = $("<span></span>", {
					text: options.text.next
				});
				prevTxt = $("<span></span>", {
					text: options.text.previous
				});
				if ( options.additionalCSS.nextBtn ) {
					nextBtn.css( options.additionalCSS.nextBtn );
				}
				if ( options.additionalCSS.nextTxt ) {
					nextTxt.css( options.additionalCSS.nextTxt );
				}
				if ( options.additionalCSS.prevBtn ) {
					prevBtn.css( options.additionalCSS.prevBtn );
				}
				if ( options.additionalCSS.prevTxt ) {
					prevTxt.css( options.additionalCSS.prevTxt );
				}
				if ( !options.alwaysShowNav ) {
					nextBtn.addClass("hide");
					prevBtn.addClass("hide");
				}
				nextTxt.appendTo(nextBtn);
				prevTxt.appendTo(prevBtn);
				nextBtn.appendTo( controls );
				prevBtn.appendTo( controls );
				controls.appendTo( dummy );
			}

			if ( options.indicators ) {
				// Now create the slide indicators.
				var indCont, inds, slides;
				indCont = $("<div></div>", {
					class: "indicator-container"
				});
				slides = id;
				for ( var i = 0; i < slides.length; i++ ) {
					var ind = $("<span></span>", {
						class: "indicator",
						"data-hexslide-id": i
					}).appendTo( indCont );

					if ( i == 0 ) {
						ind.addClass("active");
					}
				}
				if ( !options.alwaysShowNav ) {
					indCont.addClass("hide");
				}
				indCont.appendTo( dummy );
			}
		}

		function nextSlide( auto ) {
			// Clear the corresponding interval to stop the slideshow
			if (!auto) { clearInterval(timers[($(this).parents(".hexslide").attr('id').split('-')[1])]) }
			var settings = slide_options[ $(this).parents(".hexslide").attr("id").split("-")[1] ] 
			// Load settings for this slideshow. To do this get the ID of the slideshow and access the slide_options object providing the ID number as the index
			// For sliding, animate the css of the current image to match the width ( global )
			// set the css of the new slide to left of slideshow. Then animate to 0

			// Fade out the current image, fade in the next ID.
			var $currentSlide = $(this).parents(".hexslide").find(".slide:first");
			var currentID = $currentSlide.data("hexslide-id");
			currentID++;
			// If current ID is greater than the amount of slides, then set to 0
			if ( currentID > $(this).parents(".hexslide").find(".slide").length-1 ) {
				currentID = 0;
			}
			if ( settings.animation == "slide" ) {
				$currentSlide.stop().animate({"left": ( $currentSlide.outerWidth() ) /-1 }, settings.speed, function(){
					$(this).hide()
				});
				$(this).parents(".hexslide").find(".slide").filter(function(){
					return $(this).data("hexslide-id") == currentID;
				}).stop().css("left", $currentSlide.outerWidth()).show().animate( { "left": 0 }, settings.speed ).insertBefore( $currentSlide );
			} else {
				$currentSlide.stop().fadeOut( settings.speed );
				$(this).parents(".hexslide").find(".slide").filter(function(){
					return $(this).data("hexslide-id") == currentID;
				}).fadeIn( settings.speed ).insertBefore( $currentSlide );
			}

			if ( settings.stopAutoOnNav ) {
				$(this).parents(".hexslide").removeClass("hexslide-hover");
				stop( $(this).parents(".hexslide").attr('id').split("-")[1] );
			} else if ( !auto && settings.autoPlay && !settings.pauseOnHover ) {
				// User clicked, auto play is enabled. Stop and restart the timer to prevent it from changing while user is navigating
				stop( $(this).parents(".hexslide").attr('id').split("-")[1] );
				start( $(this).parents(".hexslide").attr('id').split("-")[1] );
			}
			var newID = $(this).parents(".hexslide").find('.slide:first').data("hexslide-id");
				updateInd( newID, this );
		}

		function updateInd( newID, sibling ) {
			$(sibling).parents(".hexslide").children(".indicator-container").find(".indicator.active").removeClass("active");
			$(sibling).parents(".hexslide").children(".indicator-container").find(".indicator").filter(function(){
				return $(this).data("hexslide-id") == newID;
			}).addClass("active");
		}

		function indClick() {
			// Find the slide with the correct ID, fade in and move to top of queue
			var $currentSlide, currentID, ind;
			ind = $(this).data("hexslide-id");
			var settings = slide_options[ $(this).parents(".hexslide").attr("id").split("-")[1] ] 
			$currentSlide = $(this).parents(".hexslide").find(".slide:first");
			currentID = $currentSlide.data("hexslide-id");
			if ( settings.animation == "slide" ) {

				var newWidth = ( currentID < ind ) ? $currentSlide.outerWidth() / -1 : $currentSlide.outerWidth();
				var newWidthNext = ( currentID < ind ) ? $currentSlide.outerWidth() : $currentSlide.outerWidth() /-1;
				$currentSlide.stop().animate({ "left": newWidth }, settings.speed, function(){
					$(this).hide();
				})
				$(this).parents(".hexslide").find(".slide").filter(function(){
					return $(this).data("hexslide-id") == ind;
				}).stop().css("left", newWidthNext).show().animate( { "left": 0 }, settings.speed ).insertBefore( $currentSlide );

			} else {
				$currentSlide.stop().fadeOut( settings.speed );
				$(this).parents(".hexslide").find(".slide").filter(function(){
					return $(this).data("hexslide-id") == ind;
				}).stop().fadeIn( settings.speed ).insertBefore( $currentSlide );
			}

			updateInd( ind, $currentSlide.parent(".hexslide-slide-container") );
			if ( settings.autoPlay && !settings.pauseOnHover ) {
				// User clicked, auto play is enabled. Stop and restart the timer to prevent it from changing while user is navigating
				stop( $(this).parents(".hexslide").attr('id').split("-")[1] );
				start( $(this).parents(".hexslide").attr('id').split("-")[1] );
			}
		}

		function prevSlide( auto ) {
			// Clear the corresponding interval to stop the slideshow
			if (!auto) { clearInterval(timers[($(this).parents(".hexslide").attr('id').split('-')[1])]) }
			var settings = slide_options[ $(this).parents(".hexslide").attr("id").split("-")[1] ] 
			var $currentSlide = $(this).parents(".hexslide").find(".slide:first");
			var currentID = $currentSlide.data("hexslide-id");
			currentID--;

			// If currentID is less that 0, set to highest slide ( last ).
			if ( currentID < 0 ) {
				currentID = $(this).parents(".hexslide").find(".slide").length;
				currentID -= 1;
			}

			// Get the current slide, animate forward
			if ( settings.animation == "slide" ) {
				$currentSlide.stop().animate({"left": $currentSlide.outerWidth()}, settings.speed, function(){
					$(this).hide()
				})

				$(this).parents(".hexslide").find(".slide").filter(function(){
					return $(this).data("hexslide-id") == currentID;
				}).stop().css({"left": ($currentSlide.outerWidth()) /-1 }).show().animate( {"left": 0}, settings.speed ).insertBefore( $currentSlide );
			} else {
				$currentSlide.stop().fadeOut( settings.speed );

				$(this).parents(".hexslide").find(".slide").filter(function(){
					return $(this).data("hexslide-id") == currentID;
				}).fadeIn( settings.speed ).insertBefore( $currentSlide );
			}

			if ( settings.stopAutoOnNav ) {
				$(this).parents(".hexslide").removeClass("hexslide-hover");
				stop( $(this).parents(".hexslide").attr('id').split("-")[1] );
			} else if ( settings.autoPlay && !settings.pauseOnHover ) {
				// User clicked, auto play is enabled. Stop and restart the timer to prevent it from changing while user is navigating
				stop( $(this).parents(".hexslide").attr('id').split("-")[1] );
				start( $(this).parents(".hexslide").attr('id').split("-")[1] );
			}
			var newID = $(this).parents(".hexslide").find('.slide:first').data("hexslide-id");
			updateInd( newID, this );
		}


		$(window).on("aj_start", function() {
			for ( var i = 0; i < timers.length; i++ ) {
				clearTimeout(timers[i]);
			}
		})
		if ( !_G.preserve.slide_done ) {
			_G.preserve.slide_done = true;
			// Stop the slideshow when hovering. This only needs to be run once per session because it uses delegation
			// The options table should NOT be used.
			$("body").on("mouseenter", ".hexslide.hexslide-hover", function(){
				// get settings for this slide
				var settings = slide_options[ $(this).attr('id').split('-')[1] ];
				// Stop slideshow
				if ( settings.pauseOnHover ) { stop( $(this).attr('id').split('-')[1] ) }
				// Show navigation
				if ( !settings.alwaysShowNav ) {
					$(this).find(".slide-btn").removeClass("hide");
					if ( settings.indicators ) {
						$(this).find(".indicator-container").removeClass("hide");
					}
				}
			}).on("mouseleave", ".hexslide.hexslide-hover", function(){
				// Get settings
				var settings = slide_options[ $(this).attr('id').split('-')[1] ]
				// Restart slideshow
				if ( settings.pauseOnHover ) { start( $(this).attr('id').split('-')[1] ) }
				if ( !settings.alwaysShowNav ) {
					$(this).find(".slide-btn").addClass("hide");
					if ( settings.indicators ) {
						$(this).find(".indicator-container").addClass("hide");
					}
				}
			});
			$("body").on("click", ".slide-btn", function( e ){
				var dir;
				dir = $(this).data("slide-direction");
				if ( dir == "forward" ) {
					nextSlide.call( this );
				} else if ( dir == "backward" ) {
					prevSlide.call( this );
				}
			})
			$("body").on("click", ".indicator", function( e ){
				indClick.call( this );
			})

		}
		console.log( slide_options )

	}

	$.fn.hexSlide.defaults = {
		interval: 3000,
		speed: 500,
		width: false,
		height: false,
		maxheight: false,
		maxwidth: false,
		minheight: false,
		minwidth: false,
		pauseOnHover: true,
		autoPlay: true,
		navigation: true,
		alwaysShowNav: false,
		stopAutoOnNav: false,
		indicators: true,
		animation: "fade",
		additionalClass: {
			slide: false,
			container: false
		},
		additionalCSS: {
			slide: false,
			container: false,
			nextBtn: false,
			nextTxt: false,
			prevBtn: false,
			prevTxt: false
		},
		callback: {
			start: function(){}
		},
		text: {
			previous: "Back",
			next: "Next"
		}
	}

})( jQuery, window, document );