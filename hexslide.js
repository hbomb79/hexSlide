// HexSlide Version beta 2.6 | Copyright (C) 2015 HexCode, Harry Felton.

var _G = _G ? _G : {};
(function( $, window, document, undefined ){
	if ( !_G ) {
		// Users without this super global. We create it now.
		_G.preserve = {};
		_G.variable = {};
	}

	_G.variable.last_slide_id = 0;
	_G.preserve.slide_done = _G.preserve.slide_done ? true : false;
	var timers = [],
		slideshowImgs = [],
		slide_options = {},
		slide_cache = {}
		// These must be kept outside the scope of the plugin, so they are not reset each time an instance is created. They are still private to the window instance

	$.fn.hexSlide = function( options ){
		var img,
			dummy,
			container,
			$container,
			listArray = this.filter(function(){
				return $(this).data("slideshow-src") || $(this).hasClass("hexslide")
			}),
			lastID,
			width,
			currentSlides,
			height;

		cout( "Plugin started - Debug Mode" )
		lastID = _G.variable.last_slide_id ? _G.variable.last_slide_id : 0;
		cout( "_G loaded" )
		for ( var i = 0; i < listArray.length; i++ ) {
			// This listArray item is already a slideshow, simply adjust the settings ( using extend again )
			if ( $(listArray[i]).hasClass("hexslide") ) {
				cout("slideshow found, extend settings "+id)
				// Get the ID of the item
				var id = $( listArray[i] ).attr("id").split("-")[1];
				var set;
				set = slide_options[ id ];
				if ( set ) {
					cout("extending settings from "+set)
					// Already has settings, merge with new and default.
					var newset;
					newset = $.extend(true, {}, $.fn.hexSlide.defaults, set, options);
					options = newset;
					// Stop the slideshow, and restart
					stop( id )
					var $slideshow;
					if ( newset.speed+100 > newset.interval ) {
						console.warn("hexSlide Warning: The interval you set is faster than your speed. To prevent problems your interval has been set to your speed+safety ( " + ( newset.speed + 100 ) + " )");
						newset.interval = newset.speed+100;
						cout("interval under safety limit, increase to speed + 100ms", "w")
					}
					// Check if the alwaysShowNav, navigation or indicators setting has been changed. If so then add/remove the elements
					$slideshow = $("#hexslide-" + id + "-container");
					if ( $slideshow.children(".hexslide-control-container").length >= 1 && newset.navigation == false ) {
						// Remove back/next buttons
						$slideshow.children(".hexslide-control-container").remove();
					}
					if ( $slideshow.children(".indicator-container").length >= 1 && newset.indicators == false ) {
						// Remove back/next buttons
						$slideshow.children(".indicator-container").remove();
					}
					if ( $slideshow.children(".hexslide-control-container").length <= 0 && newset.navigation == true || $slideshow.children(".indicator-container").length <= 0 && newset.indicators == true ) {
						createGUI( $slideshow.children(".hexslide-slide-container").children(".slide") , newset, $slideshow, true )
						// createGUI will create the required elements
					}
					if ( newset.alwaysShowNav ) {
						// Show
						$slideshow.children(".hexslide-control-container").children(".slide-btn").removeClass("hide");
					} else {
						// Hide
						$slideshow.children(".hexslide-control-container").children(".slide-btn").addClass("hide");
					}
					if ( newset.alwaysShowIndicators ) {
						// Show
						$slideshow.children(".indicator-container").removeClass("hide");
					} else {
						// Hide
						$slideshow.children(".indicator-container").addClass("hide");
					}

					if ( !newset.alwaysShowNav || newset.pauseOnHover || !newset.alwaysShowIndicators ) {
						if ( !$slideshow.hasClass("hexslide-hover") ) {
							$slideshow.addClass("hexslide-hover")
						}
					} else {
						// Dont need the hover class.
						$slideshow.removeClass("hexslide-hover")
					}
					$slideshow.width( newset.width ? newset.width : width )
					$slideshow.height( newset.height ? newset.height : height )
					$slideshow.css({
						"max-height": ( newset.maxheight ) ? newset.maxheight : "",
						"max-width": ( newset.maxwidth ) ? newset.maxwidth : "",
						"min-height": ( newset.minheight ) ? newset.minheight : "",
						"min-width": ( newset.minwidth ) ? newset.minwidth : "",
					})
					// Get all slides, position at left 0, opacity 1 and display:none
					cout("reinit complete, slideshow " + id + " ready")
					$slideshow.children(".hexslide-slide-container").children(".slide").hide().css("left", 0);
					$slideshow.children(".hexslide-slide-container").children(".slide:first").show();
					slide_options[ id ] = newset; // Any changes made to the new config applied now.
					if ( newset.autoPlay ) {
						cout(id+" autoplay start")
						if ( !newset.shuffle ) {
							timers[id] = setInterval(function(){
								// Emulate a click on the next button
								nextSlide.call( $slideshow.find(".hexslide-slide-container"), true );
							}, newset.interval)
						} else {
							startShuffle( id, newset )
						}
					}
					if ( typeof newset.callback.start == "function" ) {
						newset.callback.start();
					}
				}
			} else {
				cout("no slideshow detected, creating")
				var options = $.extend(true, {}, $.fn.hexSlide.defaults, options);
				// If the speed is less than the interval, set the interval to speed and notify user
				if ( options.speed+100 > options.interval ) {
					console.warn("hexSlide Warning: The interval you set is faster than your speed. To prevent problems your interval has been set to your speed+safety ( " + ( options.speed + 100 )+ " )");
					options.interval = options.speed+100;
					cout("bad interval, increasing to speed + 100ms", "w")
				}
				// This instances settings should be stored with this slide so that other instances can access them too.
				container = listArray[i];
				$container = $(container);

				var item = i+lastID;
				// Use ITEM so we dont overwrite other settings and so the index matches the ID number.
				width = $container.outerWidth();
				height = $container.outerHeight();

				dummy = $("<div></div>", {
					id: "hexslide-" + item + "-container",
					class: "hexslide"
				});
				cout("dummy start")

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
				cout("processed additionalCSS and additionalClasses")

				// Add a class to be used by event listeners. This indicates the slideshow should be paused when a user hovers on it.
				if ( options.pauseOnHover || !options.alwaysShowNav || !options.alwaysShowIndicators ) {
					dummy.addClass("hexslide-hover");
				}
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
				cout("GUI ready")

				img = $("<div></div>", {
					class: "slide",
					css: {
						"background-image": "url("+ $container.attr('src') +")"
					},
					"data-hexslide-id": 0
				}).appendTo( currentSlides );
				cout("originalsrc ready")

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
				cout("show replaced")
				$("#hexslide-"+item+"-container").children(".hexslide-slide-container").children(".slide:gt(0)").hide();
				// Container done, now adjust stuff!
				lastID++;
				_G.variable.last_slide_id = lastID;
				if ( typeof options.callback.start == "function" ) {
					options.callback.start();
				}
				slide_options[item] = options;
				slide_cache[ item ] = {};
				slide_cache[ item  ].moving = false;
				start( item );
			}
		}

		function cout( message, mode, id ) {
			var settings = id ? slide_options[ id ] : options;
			if ( !settings || !settings.debug ) {
				return;
			}
			message = "hexSlide: "+message;
			switch( mode ) {
				case "e":
					console.error( message )
					break;
				case "w":
					console.warn( message )
					break;
				case "l":
					console.log( message )
					break;
				default:
					console.log( message );
					break;
			}
		}

		function startShuffle( i, settings ) {
			generateShuffle( i ).done(function(slides){
				cout("slide order shuffled")
				// We have the shuffled slides, now we want to log the current shuffle slide using the cache.
				slide_cache[i].shuffle = {
					order: slides,
					current: 0
				}
				// They are now stored, when the timer runs grab the current, add one to it and go to that slide.
				cout("timer starting")
				timers[i] = setInterval(function(){
					var slide, slideid, ind;
					slide = slide_cache[i].shuffle.order[ slide_cache[i].shuffle.current ];
					slideid = $(slide).data("hexslide-id");
					if ( $(slide).parents(".hexslide").children(".hexslide-slide-container").children(".slide:first").data("hexslide-id") == slideid ) {
						slide_cache[i].shuffle.current++;
						slide = slide_cache[i].shuffle.order[ slide_cache[i].shuffle.current ];
						slideid = $(slide).data("hexslide-id");
						cout("advancing slide ahead by 1")
					}
					ind = $(slide).parents(".hexslide").children(".indicator-container").children(".indicator").filter(function(){
						return $(this).data("hexslide-id") == slideid
					})
					indClick.call( ind )
					slide_cache[i].shuffle.current++;
					if ( slide_cache[i].shuffle.current > slide_cache[i].shuffle.order.length-1 ) {
						slide_cache[i].shuffle.current = 0;
						generateShuffle( i ).done( function(slides) {
							slide_cache[i].shuffle.order = slides;
							cout("regenerated slides")
						})
					}
				}, settings.interval)
			});
		}

		function start( i ) {
			var $slideshow;
			$slideshow = $("#hexslide-" + i + "-container");
			var settings = slide_options[ i ]
			if ( !settings.autoPlay ) {
				cout("autplay disabled")
				return;
			}
			if (timers[i]) {
				// Timer already set, clear it just incase it is still running.
				clearInterval( timers[i] );
				cout("reset timer")
			}
			if ( !settings.shuffle ) {
				cout("starting timer")
				timers[i] = setInterval(function(){
					// Emulate a click on the next button
					nextSlide.call( $slideshow.find(".hexslide-slide-container"), true );
				}, settings.interval)
			} else {
				// Use shuffle.
				startShuffle( i, settings )
			}
		}

		function stop( i ) {
			clearTimeout(timers[i]);
			cout("timer stopped")
		}

		function createGUI( id, cfg, applyTo, a ) {
			options = cfg ? cfg : options;
			dummy = applyTo ? applyTo : dummy;
			a = a ? true : false;
			if ( options.navigation && dummy.children(".hexslide-control-container").length <= 0 ) {
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
				cout("appending text to button")
				nextTxt.appendTo(nextBtn);
				prevTxt.appendTo(prevBtn);
				nextBtn.appendTo( controls );
				prevBtn.appendTo( controls );
				cout("buttons appended to panel")
				if ( !a ) {
					controls.appendTo( dummy );
					cout("appended to hexslide container")
				} else {
					controls.insertBefore( dummy.children(".hexslide-slide-container") )
					cout("instered above hexslide container")
				}
			}

			if ( options.indicators && dummy.children(".indicator-container").length <= 0 ) {
				// Now create the slide indicators.
				var indCont, inds, slides;
				indCont = $("<div></div>", {
					class: "indicator-container"
				});
				slides = id;
				cout("creating indicators")
				for ( var i = 0; i < slides.length; i++ ) {
					var ind = $("<span></span>", {
						class: "indicator",
						"data-hexslide-id": i
					}).appendTo( indCont );

					if ( i == 0 ) {
						ind.addClass("active");
					}
				}
				if ( !options.alwaysShowIndicators ) {
					indCont.addClass("hide");
				}
				indCont.css({
					"max-width": options.width
				});
				
				if ( !a ) {
					indCont.appendTo( dummy );
				} else {
					indCont.insertBefore( dummy.children(".hexslide-slide-container") )
				}
				cout("indicators ready")
			}
		}

		function getRandomInt(min, max) {
		    return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		function generateShuffle( slideshow ) {
			// Generate random number, get slide, append to array if not already. When done return the array for the autplay to play from.
			var shuf, slides, id, config, d;
			d = $.Deferred();
			shuf = [];
			var show = $("#hexslide-"+slideshow+"-container")
			slides = show.children(".hexslide-slide-container").children(".slide");
			id = show.attr("id").split("-")[1];
			config = slide_cache[ id ];
			cout("generating")
			while ( true ) {
				// Random number
				var rand;
				rand = getRandomInt(0, slides.length-1)
				if ( $.inArray( slides[ rand ], shuf ) == -1 ) {
					shuf.push( slides[ rand ] );
					cout("pushed "+rand)
				} else {
					cout("ignored "+rand)
				}
				if ( shuf.length == slides.length ) {
					d.resolve(shuf);
					cout("generation complete")
					break;
				}
			}
			// All slides have been processed.
			return d;
		}

		function nextSlide( auto ) {
			// Clear the corresponding interval to stop the slideshow
			if ( slide_cache[ $(this).parents(".hexslide").attr("id").split("-")[1] ].moving ) {
				// Already animating
				cout("already animating, ignoring click", "w")
				return;
			} else {
				slide_cache[ $(this).parents(".hexslide").attr("id").split("-")[1] ].moving = true;
			}
			if (!auto) { clearInterval(timers[($(this).parents(".hexslide").attr('id').split('-')[1])]) }
			var settings = slide_options[ $(this).parents(".hexslide").attr("id").split("-")[1] ];
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
				cout("new slide greater than total, setting to zero")
			}
			if ( settings.animation == "slide" ) {
				$currentSlide.stop().animate({"left": ( $currentSlide.outerWidth() ) /-1 }, settings.speed, function(){
					$(this).hide()
				});
				$(this).parents(".hexslide").find(".slide").filter(function(){
					return $(this).data("hexslide-id") == currentID;
				}).stop().css("left", $currentSlide.outerWidth()).show().animate( { "left": 0 }, settings.speed, function(){ slide_cache[ $(this).parents(".hexslide").attr("id").split("-")[1] ].moving = false; }).insertBefore( $currentSlide );
			} else {
				$currentSlide.stop().fadeOut( settings.speed );
				$(this).parents(".hexslide").find(".slide").filter(function(){
					return $(this).data("hexslide-id") == currentID;
				}).fadeIn( settings.speed, function(){ slide_cache[ $(this).parents(".hexslide").attr("id").split("-")[1] ].moving = false; } ).insertBefore( $currentSlide );
			}

			if ( settings.stopAutoOnNav && !auto ) {
				//$(this).parents(".hexslide").removeClass("hexslide-hover");
				settings.autoPlay = false;
				stop( $(this).parents(".hexslide").attr('id').split("-")[1] );
				cout("stopped auto as stopAutoOnNav is true")
			} else if ( !auto && settings.autoPlay && !settings.pauseOnHover ) {
				// User clicked, auto play is enabled. Stop and restart the timer to prevent it from changing while user is navigating
				stop( $(this).parents(".hexslide").attr('id').split("-")[1] );
				start( $(this).parents(".hexslide").attr('id').split("-")[1] );
				cout("reset timer")
			}
			var newID = $(this).parents(".hexslide").find('.slide:first').data("hexslide-id");
				updateInd( newID, this );
		}

		function updateInd( newID, sibling ) {
			$(sibling).parents(".hexslide").children(".indicator-container").find(".indicator.active").removeClass("active");
			$(sibling).parents(".hexslide").children(".indicator-container").find(".indicator").filter(function(){
				return $(this).data("hexslide-id") == newID;
			}).addClass("active");
			cout("updated indicators")
		}

		function indClick() {
			if ( slide_cache[ $(this).parents(".hexslide").attr("id").split("-")[1] ].moving ) {
				// Already animating
				cout("already animating, ignoring click", "w")
				return;
			} else {
				slide_cache[ $(this).parents(".hexslide").attr("id").split("-")[1] ].moving = true;
			}
			// Find the slide with the correct ID, fade in and move to top of queue
			var $currentSlide, currentID, ind;
			ind = $(this).data("hexslide-id");
			var settings = slide_options[ $(this).parents(".hexslide").attr("id").split("-")[1] ] 
			$currentSlide = $(this).parents(".hexslide").find(".slide:first");
			currentID = $currentSlide.data("hexslide-id");
			if ( currentID == ind ) {
				slide_cache[ $(this).parents(".hexslide").attr("id").split("-")[1] ].moving = false;
				return;
			}
			if ( settings.animation == "slide" ) {

				var newWidth = ( currentID < ind ) ? $currentSlide.outerWidth() / -1 : $currentSlide.outerWidth();
				var newWidthNext = ( currentID < ind ) ? $currentSlide.outerWidth() : $currentSlide.outerWidth() /-1;
				$currentSlide.stop().animate({ "left": newWidth }, settings.speed, function(){
					$(this).hide();
				})
				$(this).parents(".hexslide").find(".slide").filter(function(){
					return $(this).data("hexslide-id") == ind;
				}).stop().css("left", newWidthNext).show().animate( { "left": 0 }, settings.speed, function(){ slide_cache[ $(this).parents(".hexslide").attr("id").split("-")[1] ].moving = false; } ).insertBefore( $currentSlide );

			} else {
				$currentSlide.stop().fadeOut( settings.speed );
				$(this).parents(".hexslide").find(".slide").filter(function(){
					return $(this).data("hexslide-id") == ind;
				}).stop().fadeIn( settings.speed, function(){ slide_cache[ $(this).parents(".hexslide").attr("id").split("-")[1] ].moving = false; } ).insertBefore( $currentSlide );
			}

			updateInd( ind, $currentSlide.parent(".hexslide-slide-container") );
			if ( settings.stopAutoOnNav ) {
				settings.autoPlay = false;
				stop( $(this).parents(".hexslide").attr('id').split("-")[1] );
				cout("stopped auto as stopAutoOnNav is true")
			} else if ( settings.autoPlay && !settings.pauseOnHover ) {
				// User clicked, auto play is enabled. Stop and restart the timer to prevent it from changing while user is navigating
				stop( $(this).parents(".hexslide").attr('id').split("-")[1] );
				start( $(this).parents(".hexslide").attr('id').split("-")[1] );
				cout("reset timer")
			}
		}

		function prevSlide( auto ) {
			// Clear the corresponding interval to stop the slideshow
			if ( slide_cache[ $(this).parents(".hexslide").attr("id").split("-")[1] ].moving ) {
				// Already animating
				cout("already animating, ignoring click", "w")
				return;
			} else {
				slide_cache[ $(this).parents(".hexslide").attr("id").split("-")[1] ].moving = true;
			}
			if (!auto) { clearInterval(timers[($(this).parents(".hexslide").attr('id').split('-')[1])]) }
			var settings = slide_options[ $(this).parents(".hexslide").attr("id").split("-")[1] ] 
			var $currentSlide = $(this).parents(".hexslide").find(".slide:first");
			var currentID = $currentSlide.data("hexslide-id");
			currentID--;

			// If currentID is less that 0, set to highest slide ( last ).
			if ( currentID < 0 ) {
				currentID = $(this).parents(".hexslide").find(".slide").length;
				currentID -= 1;
				cout("new slide is out of bounds, setting to last slide")
			}

			// Get the current slide, animate forward
			if ( settings.animation == "slide" ) {
				$currentSlide.stop().animate({"left": $currentSlide.outerWidth()}, settings.speed, function(){
					$(this).hide()
				})

				$(this).parents(".hexslide").find(".slide").filter(function(){
					return $(this).data("hexslide-id") == currentID;
				}).stop().css({"left": ($currentSlide.outerWidth()) /-1 }).show().animate( {"left": 0}, settings.speed, function(){ slide_cache[ $(this).parents(".hexslide").attr("id").split("-")[1] ].moving = false; } ).insertBefore( $currentSlide );
			} else {
				$currentSlide.stop().fadeOut( settings.speed );

				$(this).parents(".hexslide").find(".slide").filter(function(){
					return $(this).data("hexslide-id") == currentID;
				}).fadeIn( settings.speed, function(){ slide_cache[ $(this).parents(".hexslide").attr("id").split("-")[1] ].moving = false; } ).insertBefore( $currentSlide );
			}

			if ( settings.stopAutoOnNav ) {
				$(this).parents(".hexslide").removeClass("hexslide-hover");
				stop( $(this).parents(".hexslide").attr('id').split("-")[1] );
				cout("stopped auto as stopAutoOnNav is true")
			} else if ( settings.autoPlay && !settings.pauseOnHover ) {
				// User clicked, auto play is enabled. Stop and restart the timer to prevent it from changing while user is navigating
				stop( $(this).parents(".hexslide").attr('id').split("-")[1] );
				start( $(this).parents(".hexslide").attr('id').split("-")[1] );
				cout("reset timer")
			}
			var newID = $(this).parents(".hexslide").find('.slide:first').data("hexslide-id");
			updateInd( newID, this );
		}


		if ( !_G.preserve.slide_done ) {
			_G.preserve.slide_done = true;
			// Stop the slideshow when hovering. This only needs to be run once per session because it uses delegation
			// The options table should NOT be used.
			$(window).on("aj_start", function() {
				cout("aj_start found. Clearing all timers")
				for ( var i = 0; i < timers.length; i++ ) {
					clearTimeout(timers[i]);
					cout("cleared "+i)
				}
			})
			$("body").on("mouseenter", ".hexslide.hexslide-hover", function(){
				// get settings for this slide
				var settings = slide_options[ $(this).attr('id').split('-')[1] ];
				// Stop slideshow
				if ( settings.pauseOnHover ) { stop( $(this).attr('id').split('-')[1] ) }
				// Show navigation
				if ( !settings.alwaysShowNav && settings.navigation ) {
					$(this).find(".slide-btn").removeClass("hide");
					
				}
				if ( !settings.alwaysShowIndicators && settings.indicators ) {
					$(this).find(".indicator-container").removeClass("hide");
				}
				cout("mouse entered hexslide slideshow bounds")
			}).on("mouseleave", ".hexslide.hexslide-hover", function(){
				// Get settings
				var settings = slide_options[ $(this).attr('id').split('-')[1] ]
				// Restart slideshow
				if ( settings.pauseOnHover ) { start( $(this).attr('id').split('-')[1] ) }
				if ( !settings.alwaysShowNav && settings.navigation ) {
					$(this).find(".slide-btn").addClass("hide");
				}
				if ( !settings.alwaysShowIndicators && settings.indicators ) {
					$(this).find(".indicator-container").addClass("hide");
				}
				cout("mouse left hexslide slideshow bounds")
			});
			$("body").on("click", ".slide-btn", function( e ){
				var dir;
				dir = $(this).data("slide-direction");
				if ( dir == "forward" ) {
					nextSlide.call( this );
				} else if ( dir == "backward" ) {
					prevSlide.call( this );
				}
				cout("directional button clicked")
			})
			$("body").on("click", ".indicator", function( e ){
				indClick.call( this );
				cout("indicator clicked")
			})
			cout("jQuery event delegation completed, waiting for events.")
		}
		return this;

	}

	$.fn.hexSlide.defaults = {
		interval: 3000,
		speed: 500,
		shuffle: false,
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
		alwaysShowIndicators: false,
		stopAutoOnNav: false,
		indicators: true,
		animation: false,
		debug: false,
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