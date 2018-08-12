function artist(image, artistName, plays){
	this.image = new Image();
	this.image.src = image;
	this.image.onload = imageLoaded;
	this.artistName=artistName;
	this.plays = plays;
}

function album(image, albumName, artistName, plays){
	artist.call(this, image, artistName, plays);
	this.albumName = albumName;
}

album.prototype = Object.create(artist.prototype);
album.prototype.constructor = album;

var albums=[];

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
var captionsOption = document.getElementById('captionsOption');
var playsOption = document.getElementById('playsOption');
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
var limit=200;
var added;
var page = 1;

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
	if (musaicType.value!='recent'){
		var requestURL = 'https://ws.audioscrobbler.com/2.0/?method=user.gettop'+musaicType.value+'&user=' + 
		submitText + '&api_key=57ee3318536b23ee81d6b27e36997cde&limit='+imagesToLoad+
		'&period='+dateRangeChoice.value+'&format=json';
	}
	else{
		var requestURL = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user='+
		submitText+'&api_key=57ee3318536b23ee81d6b27e36997cde&limit='+limit+'&format=json';
	}
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
	var typeString1 = (musaicType.value!='recent')?'top'+musaicType.value:'recenttracks';
	var typeString2 = (musaicType.value!='recent')?musaicType.value:'track';
	if(typeString2!='track')
		typeString2=typeString2.slice(0, -1);
	var results = request.response[typeString1][typeString2];
	if(typeString2!='track'){
	    for (var i = 0; i < imagesToLoad; i++){
	    	var imageLink = (!results[i] || results[i]['image'][2]['#text']=="")?
	    					"./images/notfound.png":results[i]['image'][2]['#text'];
	    	var name=(!results[i])?"":results[i]['name'];
	    	var plays=(!results[i])?"":results[i]['playcount'];
	    	if(typeString2=="artist")
	    		albums[i]=new artist(imageLink, name, plays);
	    	else{
	    		var artistName = (!results[i])?"":results[i]['artist']['name'];
	    		albums[i] = new album(imageLink, name, artistName, results[i]['playcount']);
	    	}

	    }
	}
	else{
				findMostRecent(results);
	}
}


function findMostRecent(results){

	for (var i = 0; albums.length < imagesToLoad && i<limit ; i++){
		added = false;
		albums.forEach(function(el){
			if(el.albumName==results[i]['album']['#text'] && el.artistName==results[i]['artist']['#text'])
				added=true;
		});
		if (!added){
			var imageLink = (!results[i] || results[i]['image'][2]['#text']=="")?
							"./images/notfound.png":results[i]['image'][2]['#text'];
    		var name=(!results[i])?"":results[i]['album']['#text'];
    		var artist = (!results[i])?"":results[i]['artist']['#text'];
				albums.push(new album(imageLink, name, artist, null));
		}

	}
	if (albums.length < imagesToLoad){
		page+=1;
		var requestURL = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user='+
		submitText+'&api_key=57ee3318536b23ee81d6b27e36997cde&limit='+limit+'&page='+page+'&format=json';
		console.log(requestURL);
		var request = new XMLHttpRequest();
		request.open('GET', requestURL);
		request.responseType = 'json';
		request.send();
		request.onload = function() {
			(request.response['error'])?displayError(request):findMostRecent(request.response['recenttracks']['track']);
		};
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
		ctx.drawImage(albums[i].image, (i % columns.value) * 174,  Math.floor(i/columns.value) * 174);
		var offset=0;
		ctx.font='13px arial';
		ctx.strokeStyle='black';
		ctx.lineWidth=3;
		ctx.lineJoin = 'round';
		ctx.textBaseline="hanging";
		ctx.fillStyle='white';
		if(captionsOption.checked){	
			ctx.strokeText(albums[i].artistName, (i % columns.value) * 174+2,  Math.floor(i/columns.value) * 174+2);
			ctx.fillText(albums[i].artistName, (i % columns.value) * 174+2,  Math.floor(i/columns.value) * 174+2);
			offset+=1;
			if(albums[i].albumName){
				ctx.strokeText(albums[i].albumName, (i % columns.value) * 174+2,  Math.floor(i/columns.value) * 174+15);
				ctx.fillText(albums[i].albumName, (i % columns.value) * 174+2,  Math.floor(i/columns.value) * 174+15);
				offset+=1;
			}
		}
		if(playsOption.checked && musaicType.value!='recent'){
			playsString='Plays: '+albums[i].plays;
			ctx.strokeText(playsString, (i % columns.value) * 174+2,  (Math.floor(i/columns.value) * 174)+2+offset*13);
			ctx.fillText(playsString, (i % columns.value) * 174+2,  (Math.floor(i/columns.value) * 174)+2+offset*13);
		}
	}
	albums = [];
	page = 1;
}