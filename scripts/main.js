var submitInput = document.getElementById('username');
var submitText;
var body = document.querySelector('body');
var submitButton = document.querySelector('input[name=submit]');
var collageDiv = document.querySelector('.collage');
var musaicCanvas = document.createElement('canvas');

musaicCanvas.setAttribute('width', '300');
musaicCanvas.setAttribute('height', '300');
collageDiv.appendChild(musaicCanvas);
var ctx = musaicCanvas.getContext('2d');

function createMusaic(){
	submitText = submitInput.value
	var requestURL = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + 
	submitText + '&api_key=57ee3318536b23ee81d6b27e36997cde&format=json';
	console.log(requestURL);
	var request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	request.onload = function(submitText) {
		var image = new Image();
	    image.src = request.response['recenttracks']['track']['0']['image']['3']['#text'];
	    image.onload = function(){
			ctx.drawImage(image, 0, 0);
		};
	};
	
}