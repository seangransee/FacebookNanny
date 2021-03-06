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

var mouseOverCountdown;

var settings = {
	get: function(k) {
		var options = JSON.parse(localStorage.FBNanny);
		return options[k];
	},

	set: function(k, v) {
		var options = localStorage.FBNanny;
		if (options) {
			options = JSON.parse(options);
		} else {
			options = {};
		}
		options[k] = v;
		json = JSON.stringify(options);
		localStorage.FBNanny = json;
	}
}

var updateTimesup = function(t) {
	current = settings.get('timesup');
	if (t > current || !current) settings.set('timesup', t);
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

var allowprofile;
var profile;
var firstname;

function loop() {
	var login = document.title.indexOf('Log In') > -1;
	var messages = document.title.split(' ').reverse()[0] == "Messages";
	allowprofile = settings.get('allowprofile');
	var currentpage = document.URL.split('?')[0].split('://')[1];
	var allowed = (profile == currentpage) && allowprofile;
	if (login) {
		localStorage.removeItem('fb_firstname');
	}
	if (login || messages || allowed) {
		countdown.hide();
		overlay.hide();
	} else {
		var now = new Date().getTime();
		notifications = +$('#notificationsCountValue').text();
		if (notifications) {
			var timesup = new Date(now + notifications*60000).getTime();
			updateTimesup(timesup);
			countdown.hide();
			overlay.hide();
		} else {
			var stop = settings.get('timesup');
			if (stop < now) {
				overlay.show();
				countdown.hide();
			} else {
				overlay.hide();
				if (!mouseOverCountdown) countdown.show();
			}
		}
	}
}

$(document).ready(function() {
	settings.set('start', 15);
	settings.set('duration', 3);
	settings.set('allowprofile', true);
	allowprofile = settings.get('allowprofile');
	if ($('.tinyman a').attr('href'))
		profile = $('.tinyman a').attr('href').split('?')[0].split('://')[1];
	if ($('.navLink[title="Timeline"]').attr('href'))
		profile = $('.navLink[title="Timeline"]').attr('href').split('?')[0].split('://')[1];

	var name = $('.fbxWelcomeBoxName').text();
	if (name) {
		localStorage.setItem('fb_firstname', name.split(' ')[0]);
	}

	var firstname = localStorage.getItem('fb_firstname');
	mouseOverCountdown = false;
	var now = new Date().getTime();
	var timesup = new Date(now + ((settings.get('start') + 2) / 60)*60000).getTime();
	updateTimesup(timesup);
	$('body').append(popup(firstname, profile));
	$('body').append('<div id="countdown"></div>');
	loop();
	$('#countdown').hover(function() {
		mouseOverCountdown = true;
		$(this).fadeOut();
	}, function() {
		mouseOverCountdown = false;
	});

	setInterval(function() {
		updateCountdown();
		loop();
	}, 1000);
});

var updateCountdown = function() {
	var stop = settings.get('timesup');
	var now = new Date().getTime();
	if (stop >= now) {
		var time = Math.floor((stop - now) / 1000);
		var minutes = Math.floor(time / 60);
		var seconds = Math.floor(time % 60);
		if (seconds < 10) seconds = "0" + seconds;
		$('#countdown').html(minutes + ':' + seconds);
		return true;
	}
	return false;
}


var popup = function(name, profile) {
	var text = '<div id="overlay"></div><div id="message"><h1>';
	if (name) {
		text += name + ', d';
	} else {
		text += 'D';
	}

	text += 'on\'t you have work to do?</h1>  \
	<p>You don\'t have any notifications, which makes Facebook a waste of your time right now. You can still chat with people on <a href="http://www.facebook.com/messages">messages</a> or post updates to your <a href="http://'+profile+'">profile</a>.</p> \
</div>    													\
';
	return text;
}