WebFontConfig = {
    google: { families: [ 'PT+Sans::latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();

var updateStopCount = function() {
	var now = new Date().getTime();
	var future = new Date(now + 3*60000).getTime();
	localStorage.setItem("FBstop", future);
};

var countdown = {
	show: function() {
		$('#countdown').fadeIn('slow');
	},
	hide: function() {
		$('#countdown').fadeOut('slow');
	}
};

var overlay = {
	show: function() {
		$('#overlay, #message').fadeIn('slow');
		$('body').css('overflow', 'hidden');
	},
	hide: function() {
		$('#overlay, #message').fadeOut('slow');
		$('body').css('overflow', 'auto');
	}
};

function loop() {
	var login = document.title.indexOf('Log In') > -1;
	var messages = document.title.split(' ').reverse()[0] == "Messages";
	if (login || messages) {
		console.log('login or messages page');
		countdown.hide();
		overlay.hide();
	} else {
		console.log('not login or messages page');
		var notifications = false;
		$('.jewelCount span').each(function() { if ($(this).text() > 0) { notifications = true; } });
		if (notifications) {
			console.log('notifications found');
			updateStopCount();
			countdown.hide();
			overlay.hide();
		} else {
			console.log('no notifications found');
			var stop = parseInt(localStorage.getItem("FBstop"), 10);
			var now = new Date().getTime();
			if (stop < now) {
				console.log('stop < now');
				overlay.show();
			} else {
				console.log('stop > now');
				overlay.hide();
				countdown.show();
			}
		}
	}
}

loop();

setInterval(function() {
	loop();
}, 5000);


var popup = '\
<div id="overlay">									\
</div>															\
<div id="message">    							\
	<h1>Can\'t let you do that!</h1>  \
	<p>You don\'t have any messages or notifications, which makes Facebook a waste of your time right now. You may still use <a href="http://www.facebook.com/messages">Facebook messages</a>.</p> \
</div>    													\
';

$('body').append(popup);
$('body').append('<div id="countdown">blah countdown</div>');

