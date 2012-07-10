function checkAll() {

	var overlay = '<div class="overlay"><h1>GTFO</h1></div>'

	var notif = false;

	var minutes = 3;
	var now = new Date();
	var future = new Date(now.getTime() + minutes*60000);

	var path = window.location.pathname.replace(/\//g,"")

	console.log(path);

	var stop = localStorage.getItem("FBstop");

	$('.jewelCount span').each(function() { if ($(this).text() > 0) notif = true; });

	if (notif) {
		localStorage.setItem("FBstop", future);
	} else {
		if (stop < now && path != "messages") {
			//$('body').html('<h1>GTFO</h1><p>You can visit <a target="_top" href="https://www.facebook.com/messages/">Facebook Messages</a> to talk to people.</p>');
			$('body').append(overlay)
		}
	}
}

checkAll();


$('a').click(function() {
	window.setTimeout("checkAll()", 1000);
});