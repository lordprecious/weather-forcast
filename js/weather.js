var temp;
var desc;
var wSpeed;
var loc;
var icn;
var hum;

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
	var url  = "http://api.openweathermap.org/data/2.5/weather?" +
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
			console.log(tempToCelcius(data.main.temp));
			console.log(data.weather[0].description);
			console.log(data.name);
			console.log(data.wind.speed);
			console.log(data.main.humidity);
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

function updateWeather (weather) {
	//weda.innerHTML = weather;
	loc.innerHTML = weather.loc;
	desc.innerHTML = weather.desc;
	temp.innerHTML = weather.temp + "&deg;" + "c";
	wSpeed.innerHTML = weather.wSpeed + " mph";
	hum.innerHTML = weather.hum + " %";
	//icn.scr = weather.icn;
	icn.src = "./img/" + weather.icn + ".png"
}

// function to get the current cordinate
function showPosition (position) {
	updateByGeo(position.coords.latitude, position.coords.longitude);
	console.log(position.coords.latitude, position.coords.longitude);
}

window.onload = function () {
	loc = document.getElementById("location");
	icn = document.getElementById("icon");
	desc = document.getElementById("description");
	temp = document.getElementById("temperature");
	wSpeed = document.getElementById("windSpeed");
	hum = document.getElementById("humidity");

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);	

	} else {
		var name = window.prompt("could not discover your location. What is your current city");
		updateByName("jos");
	}

	
}