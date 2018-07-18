var submitInput = document.getElementById('username');
var submitText;
var body = document.querySelector('body');
var submitButton = document.querySelector('input[name=submit]');
var collageDiv = document.querySelector('.collage');
var musaicCanvas = document.createElement('canvas');
var sizeChoice = document.querySelector('select[name=size]');
var dateRangeChoice = document.querySelector('select[name=dateRange]');
collageDiv.appendChild(musaicCanvas);
var ctx = musaicCanvas.getContext('2d');
var images = [];
var imagesLoaded;
var imagesToLoad;
var perRow;
function createMusaic(){
	imagesToLoad = sizeChoice.value;
	perRow = Math.sqrt(imagesToLoad);
	musaicCanvas.setAttribute('width', 174*perRow);
	musaicCanvas.setAttribute('height', 174*perRow);
	imagesLoaded=0;
	submitText = submitInput.value;
	var requestURL = 'http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=' + 
	submitText + '&api_key=57ee3318536b23ee81d6b27e36997cde&limit='+imagesToLoad+
	'&period='+dateRangeChoice.value+'&format=json';
	var request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	request.onload = function(submitText) {
		var results = request.response['topalbums']['album'];
	    for (var i = 0; i < imagesToLoad; i++){
	    	images[i] = new Image();
	    	images[i].src = (results[i]['image'][2]['#text']=="")?"./images/notfound.png":results[i]['image'][2]['#text'];
	    	images[i].onload = imageLoaded;
	    }
	};
}

function imageLoaded(){
	imagesLoaded+=1;
	if (imagesLoaded == imagesToLoad)
	    drawMusaicImage();
}

function drawMusaicImage(){
	for(var i = 0; i < imagesToLoad; i++){
		ctx.drawImage(images[i], (i % perRow) * 174,  Math.floor(i/perRow) * 174);
	}
}