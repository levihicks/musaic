var submitInput = document.getElementById('username');
var submitText;
var submitButton = document.querySelector('button[value=Submit');
var form = document.querySelector('.submitUsername');
var body = document.querySelector('body');
var submitButton = document.querySelector('input[name=submit]');
var collageDiv = document.querySelector('.collage');
var musaicCanvas = document.createElement('canvas');
var rows = document.querySelector('select[name=rows]');
var columns = document.querySelector('select[name=columns]');
var dateRangeChoice = document.querySelector('select[name=dateRange]');
var musaicType = document.querySelector('select[name=type]');
var loadingPara = document.createElement('p');
loadingPara.appendChild(document.createTextNode('Loading...'));
var invalidUsernamePara = document.createElement('p');
invalidUsernamePara.appendChild(document.createTextNode('Invalid username, check input and try again...'));
var enterRowsPara = document.createElement('p');
enterRowsPara.appendChild(document.createTextNode('Choose how many rows.'));
var enterColumnsPara = document.createElement('p');
enterColumnsPara.appendChild(document.createTextNode('Choose how many columns.'));
collageDiv.appendChild(musaicCanvas);
var ctx = musaicCanvas.getContext('2d');
var images = [];
var imagesLoaded;
var imagesToLoad;
var perRow;
var infoStrings = [];
submitInput.addEventListener("keyup", function(event) {
	if (event.keyCode === 13){
        submitButton.click();
	}
});

var re = /^[a-z|A-Z][a-z|A-Z|\d|_|-]{0,25}$/;
var re2 = /\d/;

var loadUnderway = false;

function checkInput(){
	removeMessages();
	if(re.test(submitInput.value)){
		if(re2.test(rows.value)){
			if(re2.test(columns.value)){
				if(!loadUnderway)
					createMusaic();
			}
			else
				body.insertBefore(enterColumnsPara, body.children[2]);
		}
		else
			body.insertBefore(enterRowsPara, body.children[2]);
	}
	else
		body.insertBefore(invalidUsernamePara, body.children[2]);
}

function removeMessages(){
	if(body.children[2] != document.querySelector('.collage') && body.children[2]!=loadingPara){
		body.removeChild(body.children[2]);
	}
}

function createMusaic(){
	loadUnderway=true;
	body.insertBefore(loadingPara, body.children[2]);
	imagesToLoad = rows.value*columns.value;
	musaicCanvas.setAttribute('width', 174*columns.value);
	musaicCanvas.setAttribute('height', 174*rows.value);
	imagesLoaded=0;
	submitText = submitInput.value;
	var requestURL = 'https://ws.audioscrobbler.com/2.0/?method=user.gettop'+musaicType.value+'&user=' + 
	submitText + '&api_key=57ee3318536b23ee81d6b27e36997cde&limit='+imagesToLoad+
	'&period='+dateRangeChoice.value+'&format=json';
	console.log(requestURL);
	var request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	request.onload = function() {
		(request.response['error'])?displayError(request):loadImages(request);
	};
}

function displayError(request){
	body.removeChild(loadingPara);
	var errorPara = document.createElement('p');
	errorPara.appendChild(document.createTextNode('Error: '+request.response['message']));
	body.insertBefore(errorPara, body.children[2]);
	loadUnderway=false;
}

function loadImages(request){
	var typeString1 = 'top'+musaicType.value;
	var typeString2 = musaicType.value;
	typeString2=typeString2.slice(0, -1);
	var results = request.response[typeString1][typeString2];
	    for (var i = 0; i < imagesToLoad; i++){
	    	images[i] = new Image();
	    	images[i].src = (!results[i] || results[i]['image'][2]['#text']=="")?"./images/notfound.png":results[i]['image'][2]['#text'];
	    	images[i].onload = imageLoaded;
	    	infoStrings[i] = (!results[i])?"":results[i]['name']
	    	infoStrings[i]+=(typeString2=="artist")?"":' - '+results[i]['artist']['name'];
	    }
}



function imageLoaded(){
	imagesLoaded+=1;
	if (imagesLoaded == imagesToLoad){
		loadUnderway=false;
		body.removeChild(loadingPara);
	    drawMusaicImage();
	}
}

function drawMusaicImage(){
	for(var i = 0; i < imagesToLoad; i++){
		ctx.drawImage(images[i], (i % columns.value) * 174,  Math.floor(i/columns.value) * 174);
		ctx.font='13px arial';
		ctx.strokeStyle='black';
		ctx.lineWidth=3;
		ctx.lineJoin = 'round';
		ctx.textBaseline="hanging";
		ctx.strokeText(infoStrings[i], (i % columns.value) * 174+2,  Math.floor(i/columns.value) * 174+2);
		ctx.fillStyle='white';
		ctx.fillText(infoStrings[i], (i % columns.value) * 174+2,  Math.floor(i/columns.value) * 174+2);
	}
}