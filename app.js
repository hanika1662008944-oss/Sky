const API_KEY = "YOUR_API_KEY";

function WeatherApp(){

this.cityInput = document.getElementById("cityInput");
this.searchBtn = document.getElementById("searchBtn");
this.weatherContainer = document.getElementById("weatherContainer");
this.forecastContainer = document.getElementById("forecastContainer");
this.recentContainer = document.getElementById("recentContainer");
this.clearBtn = document.getElementById("clearBtn");

}

WeatherApp.prototype.init = function(){

this.showWelcome();

this.searchBtn.addEventListener(
"click",
this.handleSearch.bind(this)
);

this.clearBtn.addEventListener(
"click",
this.clearHistory.bind(this)
);

this.loadRecentSearches();
this.loadLastCity();

};

WeatherApp.prototype.showWelcome = function(){

this.weatherContainer.innerHTML = `
<p>Search for a city to see weather information</p>
`;

};

WeatherApp.prototype.handleSearch = function(){

const city = this.cityInput.value.trim();

if(city === "") return;

this.getWeather(city);

};

WeatherApp.prototype.showLoading = function(){

this.weatherContainer.innerHTML = `<p>Loading...</p>`;

};

WeatherApp.prototype.showError = function(){

this.weatherContainer.innerHTML = `<p>City not found</p>`;

};

WeatherApp.prototype.getWeather = async function(city){

try{

this.showLoading();

const weatherURL =
`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

const forecastURL =
`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

const [weatherRes, forecastRes] = await Promise.all([
fetch(weatherURL),
fetch(forecastURL)
]);

const weatherData = await weatherRes.json();
const forecastData = await forecastRes.json();

this.displayWeather(weatherData);

const forecast = this.processForecastData(forecastData.list);

this.displayForecast(forecast);

this.saveRecentSearch(city);

localStorage.setItem("lastCity", city);

}
catch(error){

this.showError();

}

};

WeatherApp.prototype.displayWeather = function(data){

const icon =
`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

this.weatherContainer.innerHTML = `
<h2>${data.name}</h2>
<img src="${icon}">
<h3>${data.main.temp}°C</h3>
<p>${data.weather[0].description}</p>
`;

};

WeatherApp.prototype.processForecastData = function(list){

const daily = list.filter(item =>
item.dt_txt.includes("12:00:00")
);

return daily.slice(0,5);

};

WeatherApp.prototype.displayForecast = function(forecast){

this.forecastContainer.innerHTML = "";

forecast.forEach(day =>{

const date = new Date(day.dt_txt);

const dayName =
date.toLocaleDateString("en-US",{weekday:"short"});

const icon =
`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

this.forecastContainer.innerHTML += `
<div class="forecast-card">
<h4>${dayName}</h4>
<img src="${icon}">
<p>${day.main.temp}°C</p>
<p>${day.weather[0].description}</p>
</div>
`;

});

};

WeatherApp.prototype.loadRecentSearches = function(){

const searches =
JSON.parse(localStorage.getItem("recentSearches")) || [];

this.displayRecentSearches(searches);

};

WeatherApp.prototype.saveRecentSearch = function(city){

let searches =
JSON.parse(localStorage.getItem("recentSearches")) || [];

city =
city.charAt(0).toUpperCase() + city.slice(1);

searches = searches.filter(c => c !== city);

searches.unshift(city);

if(searches.length > 5){
searches.pop();
}

localStorage.setItem(
"recentSearches",
JSON.stringify(searches)
);

this.displayRecentSearches(searches);

};

WeatherApp.prototype.displayRecentSearches = function(searches){

this.recentContainer.innerHTML = "";

searches.forEach(city =>{

const btn = document.createElement("button");

btn.textContent = city;

btn.addEventListener(
"click",
() => this.getWeather(city)
);

this.recentContainer.appendChild(btn);

});

};

WeatherApp.prototype.loadLastCity = function(){

const lastCity =
localStorage.getItem("lastCity");

if(lastCity){
this.getWeather(lastCity);
}

};

WeatherApp.prototype.clearHistory = function(){

localStorage.removeItem("recentSearches");

this.recentContainer.innerHTML = "";

};

const app = new WeatherApp();
app.init();
