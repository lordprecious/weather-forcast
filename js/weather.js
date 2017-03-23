var temp;
var desc;
var wSpeed;
var loc;
var icn;
var hum;
var latitude;
var longitude;
var count = 1;
var dCount = 1;

// my API key
var myId = "82556f01ebbb43d4c57e8628105cc97e"


// function to get weather info by city name
function updateByName (name) {
	var url = "http://api.openweathermap.org/data/2.5/weather?" + 
				"q=" + name + "&appid=" + myId;
	sendRequest(url);
}




// function to get weather info using current coordinates
function updateByGeo (lat, lon) {
	var url = "http://api.openweathermap.org/data/2.5/weather?" +
				"&lat=" + lat + "&lon=" + lon + "&appid=" + myId;
	sendRequest(url);
}




function sendRequest (url) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var data = JSON.parse(xmlhttp.responseText);
			var weather = {};
			weather.loc = data.name;
			weather.icn = data.weather[0].icon;
			weather.desc = data.weather[0].description;
			weather.temp = tempToCelcius(data.main.temp);
			weather.wSpeed = data.wind.speed;
			weather.hum = data.main.humidity;
			updateWeather(weather);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

// function to convert temperature from kelvin to celcius
function tempToCelcius (kel) {
	return Math.round(kel - 273.15)
}



// function to display to interface
function updateWeather (weather) {
	loc.innerHTML = weather.loc;
	desc.innerHTML = weather.desc;
	temp.innerHTML = weather.temp + "&deg;" + "c";
	wSpeed.innerHTML = weather.wSpeed + " mph";
	hum.innerHTML = weather.hum + "%";

	updateCities();
}



function updateCities () {
	loc = document.getElementById("area" + count + "Location");
	icn = document.getElementById("area" + count + "Icon");
	desc = document.getElementById("area" + count + "Description");
	temp = document.getElementById("area" + count + "Temperature");
	cityUrl();
}



function cityUrl () {
	// http://api.openweathermap.org/data/2.5/find?&lat=6.55385&lon=3.36587&cnt=10&appid=82556f01ebbb43d4c57e8628105cc97e
	var url  = "http://api.openweathermap.org/data/2.5/find?" +
				"&lat=" + latitude + "&lon=" + longitude + "&cnt=15" + "&appid=" + myId;
	sendCitiesRequest(url);
}



function sendCitiesRequest (url) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var data = JSON.parse(xmlhttp.responseText);
			var weather = {};
			var num = Math.floor((Math.random() * 15) + 1);
			weather.loc = data.list[num].name;
			weather.desc = data.list[num].weather[0].description;
			weather.temp = tempToCelcius(data.list[num].main.temp);
			//weather.loc = data.list[num] ? data.list[num].name : "No location";
			//console.log(weather.loc);
			// weather.icn = data.weather[0].icon;
			//weather.desc = data.list[num] ? data.list[num].weather[0].description : "No Description";
			//weather.temp = data.list[num]? tempToCelcius(data.list[num].main.temp) : 0;
			//console.log(data.list[num].main.temp);
			updateCitiesWeather(weather);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function updateCitiesWeather (weather) {
	console.log(weather);
	loc.innerHTML = weather.loc;
	desc.innerHTML = weather.desc;
	temp.innerHTML = weather.temp + "&deg;" + "c";
	if (count < 4) {
		count ++;
		updateCities();
	} else {
		updateDays();
	}
}

function updateDays () {
	//loc = document.getElementById("day" + dCount + "Location");
	// icn = document.getElementById("area" + count + "Icon");
	desc = document.getElementById("day" + dCount + "Description");
	temp = document.getElementById("day" + dCount + "Temperature");
	hum = document.getElementById("day" + dCount + "Humidity");

	daysUrl();
}

function daysUrl () {
	// http://api.openweathermap.org/data/2.5/forecast/daily?&lat=6.5538929&lon=3.3657957&cnt=10&appid=82556f01ebbb43d4c57e8628105cc97e
	var url  = "http://api.openweathermap.org/data/2.5/forecast/daily?" +
				"&lat=" + latitude + "&lon=" + longitude + "&cnt=10" + "&appid=" + myId;
	sendDayRequest(url);
}

function sendDayRequest (url) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var data = JSON.parse(xmlhttp.responseText);
			var weather = {};
			console.log(data.list[0].humidity);
			weather.temp = tempToCelcius(data.list[dCount].temp.day);
			weather.desc = data.list[dCount].weather[0].description;
			weather.hum = data.list[dCount].humidity


			updateDayWeather(weather);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function updateDayWeather(weather) {
	console.log(weather);
	hum.innerHTML = weather.hum + "%";
	desc.innerHTML = weather.desc;
	temp.innerHTML = weather.temp + "&deg;" + "c";
	if (dCount < 5) {
		dCount ++;
		updateDays();
	}
}






// function to get the current cordinate
function showPosition (position) {
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	//updateByGeo(position.coords.latitude, position.coords.longitude);
	updateByGeo(latitude, longitude);
}





window.onload = function () {
	loc = document.getElementById("location");
	icn = document.getElementById("icon");
	desc = document.getElementById("description");
	temp = document.getElementById("temperature");
	wSpeed = document.getElementById("windSpeed");
	hum = document.getElementById("humidity");


	// check if browser supports geolocation
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);	

	} else {
		var name = window.prompt("could not discover your location. What is your current city");
		updateByName("name");
	}

	
}