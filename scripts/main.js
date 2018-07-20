var submitInput = document.getElementById('username');
var submitText;
var body = document.querySelector('body');
var submitButton = document.querySelector('input[name=submit]');
var collageDiv = document.querySelector('.collage');
var musaicCanvas = document.createElement('canvas');
var rows = document.querySelector('select[name=rows]');
var columns = document.querySelector('select[name=columns]');
var dateRangeChoice = document.querySelector('select[name=dateRange]');
collageDiv.appendChild(musaicCanvas);
var ctx = musaicCanvas.getContext('2d');
var images = [];
var imagesLoaded;
var imagesToLoad;
var perRow;
function createMusaic(){
	imagesToLoad = rows.value*columns.value;
	musaicCanvas.setAttribute('width', 174*columns.value);
	musaicCanvas.setAttribute('height', 174*rows.value);
	imagesLoaded=0;
	submitText = submitInput.value;
	var requestURL = 'https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=' + 
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
		ctx.drawImage(images[i], (i % columns.value) * 174,  Math.floor(i/columns.value) * 174);
	}
}