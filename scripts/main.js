var submitInput = document.getElementById('username');
var submitText;
var body = document.querySelector('body');
var submitButton = document.querySelector('input[name=submit]');
var collageDiv = document.querySelector('.collage');
var musaicCanvas = document.createElement('canvas');

musaicCanvas.setAttribute('width', '522');
musaicCanvas.setAttribute('height', '522');
collageDiv.appendChild(musaicCanvas);
var ctx = musaicCanvas.getContext('2d');
var images = [];
var imagesLoaded = 0;
function createMusaic(){
	imagesLoaded=0;
	submitText = submitInput.value
	var requestURL = 'http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=' + 
	submitText + '&api_key=57ee3318536b23ee81d6b27e36997cde&format=json';
	console.log(requestURL);
	var request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	request.onload = function(submitText) {
		var results = request.response['topalbums']['album'];
	    for (var i = 0; i < 9; i++){
	    	images[i] = new Image();
	    	if (results[i]['image'][2]['#text']=="")
	    		images[i].src="./images/notfound.png";
	    	else
	    		images[i].src = results[i]['image'][2]['#text'];
	    	if (images[i].src=="")
	    		imageLoaded();
	    	else
	    		images[i].onload = imageLoaded;
	    }
	};
}

function imageLoaded(){
	imagesLoaded+=1;
	if (imagesLoaded == 9)
	    drawMusaicImage();
}

function drawMusaicImage(){
	for(var i = 0; i < 9; i++){
	ctx.drawImage(images[i], (i % 3) * 174,  Math.floor(i/3) * 174);
	}
}