// ---------Responsive-navbar-active-animation-----------
function test(){
	var tabsNewAnim = $('#navbarSupportedContent');
	var selectorNewAnim = $('#navbarSupportedContent').find('li').length;
	var activeItemNewAnim = tabsNewAnim.find('.active');
	var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
	var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
	var itemPosNewAnimTop = activeItemNewAnim.position();
	var itemPosNewAnimLeft = activeItemNewAnim.position();
	$(".hori-selector").css({
		"top":itemPosNewAnimTop.top + "px", 
		"left":itemPosNewAnimLeft.left + "px",
		"height": activeWidthNewAnimHeight + "px",
		"width": activeWidthNewAnimWidth + "px"
	});
	$("#navbarSupportedContent").on("click","li",function(e){
		$('#navbarSupportedContent ul li').removeClass("active");
		$(this).addClass('active');
		var activeWidthNewAnimHeight = $(this).innerHeight();
		var activeWidthNewAnimWidth = $(this).innerWidth();
		var itemPosNewAnimTop = $(this).position();
		var itemPosNewAnimLeft = $(this).position();
		$(".hori-selector").css({
			"top":itemPosNewAnimTop.top + "px", 
			"left":itemPosNewAnimLeft.left + "px",
			"height": activeWidthNewAnimHeight + "px",
			"width": activeWidthNewAnimWidth + "px"
		});
	});
    $("#navbarSupportedContent").on("click","li",function(e){

    })
}
$(document).ready(function(){
	setTimeout(function(){ test(); });
});
$(window).on('resize', function(){
	setTimeout(function(){ test(); }, 500);
});
$(".navbar-toggler").click(function(){
	$(".navbar-collapse").slideToggle(300);
	setTimeout(function(){ test(); });
});



// --------------add active class-on another-page move----------
jQuery(document).ready(function($){
	// Get current path and find target link
	var path = window.location.pathname.split("/").pop();

	// Account for home page with empty path
	if ( path == '' ) {
		path = 'index.html';
	}

	var target = $('#navbarSupportedContent ul li a[href="'+path+'"]');
	// Add active class to target link
	target.parent().addClass('active');
});



let image=[
    "https://static.thcdn.com/images/xlarge/webp/widgets/121-us/04/0712-STDCRE-38046-SS-MH-Photography-July-22-REMAINING-BATCHING-Shot2-1180x450-021804.png",
    "https://static.thcdn.com/images/xlarge/webp/widgets/121-us/16/0701-STDCRE-38244-SS-BME-Skinstore-July-4-Assets-Shot_01-1180x450-095516.jpg",
    "https://static.thcdn.com/images/xlarge/webp/widgets/121-us/38/1180x450-082838.jpg",
    "https://static.thcdn.com/images/xlarge/webp/widgets/121-us/55/0712_THG0034801_SS_JUL_22_SHOT_03_1180x450-061455.jpg"
    ]

    let leftbtn=document.querySelector("#lbtn")
    let rightbtn=document.querySelector("#rbtn")
    let imagestate=0;
    let crau=document.querySelector("#crauser")

	function updateImage() {
		crau.src = image[imagestate];
	}
	
	// Right button click event
	rightbtn.addEventListener("click", function () {
		imagestate++;
		if (imagestate === image.length) {
			imagestate = 0;
		}
		updateImage();
	});
	
	// Left button click event
	leftbtn.addEventListener("click", function () {
		imagestate--;
		if (imagestate < 0) {
			imagestate = image.length - 1;
		}
		updateImage();
	});
	
	// Automatic interval for switching images
	let interval = setInterval(function () {
		imagestate++;
		if (imagestate === image.length) {
			imagestate = 0;
		}
		updateImage();
	}, 3000); // Change image every 3 seconds
	
	// Optional: Clear the interval on button click (if you want to stop automatic slideshow on manual control)
	// rightbtn.addEventListener("click", function () {
	// 	clearInterval(interval);
	// });
	// leftbtn.addEventListener("click", function () {
	// 	clearInterval(interval);
	// });



