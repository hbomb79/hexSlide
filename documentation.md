HexSlide Documentation
======================


The HTML Basics
---------------

To setup your HTML markup, simply start by creating an image tag.

### Image Tag
<img src="youimg.extension" alt="What is this image?">

HTML 5 allows us to use custom attributes, aslong as they are prefixed with data-.  
We are going to use data-slideshow-src.

Inside of this attribute, we place our image URLs separated using "|" (No Quotes).

### Add the custom attribute
<img src="youimg.extension" alt="What is this image?" data-slideshow-src="img.jpg|img2.jpg|img3.jpg|img4.jpg">

Your required HTML code is done now. You may want to target the image to adjust its size and other properties.

The CSS
-------

The CSS required to make this work is contained in the file hexslide.css, move or copy the css file into your site directory *first*

Dont edit CSS rules unless you know what you're doing, rules before the appearance comment should *NOT* be edited at all.

*Only* edit appearence related css rules after this comment:

	/* ONLY EDIT APPEARENCE */

Only change rules like background, color, opacity. But not positioning or transitions etc...

After this comment:

	/* ONLY EDIT APPEARENCE */

edit the rules *however* you like. Be aware that editing the rules may result in unwanted changes.

All CSS before the above comment in the css file is required and should not be adjusted unless you know what your doing.

You may *link* the CSS file to your document, or copy & paste the code into your current CSS file.

I *recommend* linking the CSS.

### Link the hexslide.css file to your document, or copy the CSS rules contained inside.


The Javascript
--------------

The Javascript is minified to reduce file size, and reduce modification attempts.

### Step 1
First off, link the *hexslide.min.js* file from the downloaded .zip into your document. Move or copy the javascript file into your site directory *first*

Then *link* the Javascript document using

<script src="hexslide.min.js"></script>

Replace the *src* argument with the path to the javascript file.

### Step 2
Now that you have the Javascript file included in your document we must now initialize the plugin.

If you want to run the plugin using all default settings, then all you have to do is the following code:

$("img").hexSlide();

The above snippet of code will convert the image into a hexslide slide-show div. Although if you want custom settings to make your slide-show perform how you need it to, we need to understand the settings available.

def. = Default Setting ( Does not need to be set unless changed )

Available String Settings
-------------------------
* interval ( def. 3000 )
* speed ( def. 500 )
* pauseOnHover ( def. true )
* autoPlay ( def. true )
* navigation ( def. true )
* alwaysShowNav ( def. false )
* stopAutoOnNav ( def. false )
* indicators ( def. true )

### Interval ( int )
	The interval is the time ( in ms ) spent waiting between slides ( Only used when autoPlay is true )

### Speed ( int )
	The speed is how fast ( in ms ) the slide fades in and out

### pauseOnHover ( boolean )
	If true, the slide show will not auto play if the user moves mouse onto slide-show, and wont restart until the user moves mouse off of slide-show

### autoPlay ( boolean )
	If true the slide show will use the interval to automatically play the slide-show

### navigation ( boolean )
	If true Back and Next buttons will be created and can be used to navigate the slide-show

### alwaysShowNav ( boolean )
	If true, the navigation and indicators will not hide them selves when the user is not hovering on the slide-show

### stopAutoOnNav ( boolean )
	If true autoPlay will be disabled when the user navigates ( using forward/back or indicator )

### indicators ( boolean )
	If true, circles will be created underneath the slide show, one per slide. A user can use these to navigate the slides.


Available Object Settings
-------------------------
* additionalCSS ( def. false )
* additionalClass ( def.false )
* callback ( def. Object [object] )

### additionalCSS ( object )
	The additionalCSS object can contain 1-2 other objects, indexed using *container* or *slide*
	EG: additionalCSS: { container: { "cssrule": "cssvalue" }, slide: { "cssrule": "cssvalue" } }

	Any CSS in the slide index will be applied to each individual slide. Any rules in the container index will be applied to the parent div.hexslide

### additionalClass ( object )
	This object can contain 1-2 string values, indexed using either *container* or *slide*
	EG: additionalClass: { container: "my-container-class", slide: "my-slide-class and-another-slide-class" }
	
	Mutliple classes must be separated using a *space* not a comma, semi-colon or other character

### callback ( object )
	This object currently only contains one index, named *start*. The key must be a function, this function will be called *after* and *every* time the plugin is used.
	EG: callback:{ start: function(){ alert("done!"); } }

Example Call
------------

$("img").hexSlide({
	speed: 1000,	
	interval: 5000,
	additionalCSS:{
		container:{
			"display":"inline-block",
			"background": "black"
		}
	},
	additionalClass: {
		container: "center-image"
	},
	callback: {
		start: function(){
			console.log("Done!")
			$(window).trigger("resize");
		}
	}
})

The above code will turn any img tags with data-slideshow-src into a hexslide slide-show.

The image will change over 1 second every 5 seconds. The container has a background color of black and a display of inline-block. The container also has a class of center-image

When the plugin has finished, "Done!" will be output to the console and any Javascript listening for a window resize, will fire in case the size of the img (slideshow) has changed.

### Step 3

Nothing, you're done.

Feel free to contact me here:
	
http://harryfelton.web44.net/digital_website/help.php#!contact
	* Only works with javascript.

Email: harryfelton12@gmail.com

### NOTES
If you want to change the plugin settings permanently ( so you don't have to set the setting each time you call the plugin ) you can change them using the following directive:

	$.fn.hexSlide.defaults;

You will have to reset the entire table, so here are the defaults:

	interval: 3000,
	speed: 500,
	pauseOnHover: true,
	autoPlay: true,
	navigation: true,
	alwaysShowNav: false,
	stopAutoOnNav: false,
	indicators: true,
	additionalClass: {
		slide: false,
		container: false
	},
	additionalCSS: {
		slide: false,
		container: false
	},
	callback: {	start: function(){} }

You can simply copy these, change what you need to, and set the directive to them, OR you can simply target them like so:

	$.fn.hexSlide.defaults.interval = 4000

Now unless specified when running the plugin, the interval will be 4 seconds, instead of three.

If any of these defaults are missing the program may crash or not function correctly, because of this the second method of default adjustment is *recommended*

Changing the global defaults is dangerous and can result in undesired changes.